const { User, Fundraiser, ActivityLog, Analytics, CampaignUpdate, DonationRefundRequest, Report } = require("../models");
const { signToken, signAdminToken } = require("../utils/auth");
const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const valid = require("card-validator");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        return null;
      }
      const user = await User.findById(context.user._id);
      const fundraisers = await Fundraiser.find({
        posterUsername: user.username,
      });
      user.createdFundraisers = fundraisers;
      return user;
    },
    createdFundraisers: async (parent, args, context) => {
      if (!context.user) {
        return [];
      }

      const user = await User.findById(context.user._id).populate(
        "savedFundraisers"
      );

      return user.savedFundraisers;
    },
    getFundraiserById: async (parent, { fundraiserId }) => {
      return await Fundraiser.findById(fundraiserId).populate("contributions");
    },
    getAllFundRaisers: async (parent) => {
      return await Fundraiser.find({});
    },
    getActivityLogs: async (parent, args, context) => {
      return await ActivityLog.find({});
    },
    getAnalytics: async (parent, args, context) => {
      return await Analytics.findOne({});
    },
    getCampaignUpdatesByFundraiser: async (parent, { fundraiserID }) => {
      return await CampaignUpdate.find({ fundraiserID }).sort({ datePosted: -1 });
    },
    getAllDonationRefundRequests: async () => {
      return await DonationRefundRequest.find().sort({ dateRequested: -1 });
    },
    getDonationRefundRequestsByUser: async (parent, { userRequestingRefund }) => {
      return await DonationRefundRequest.find({ userRequestingRefund }).sort({ dateRequested: -1 });
    },
    getReportsByUser: async (parent, { reporter }) => {
      return await Report.find({ reporter }).sort({ dateSubmitted: -1 });
    },
    getReports: async () => {
      return await Report.find().sort({ dateSubmitted: -1 });
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      let token;

    if (user.username === "korennoy.grgbrotea@gmail.com") {
      token = signAdminToken(user);
    } else {
      token = signToken(user);
    }

      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      let token;

      if (user.username === "korennoy.grgbrotea@gmail.com") {
        token = signAdminToken(user);
      } else {
        token = signToken(user);
      }

      return { token, user };
    },

    addFundraiser: async (
      parent,
      { description, posterUsername, image, title },
      context
    ) => {
      console.log(
        "Adding new fundraiser",
        description,
        posterUsername,
        image,
        title,
        context.user._id
      );
      try {
        await Fundraiser.create({ description, posterUsername, image, title });

        const user = await User.findById(context.user._id);
        const fundraisers = await Fundraiser.find({
          posterUsername: user.username,
        });
        user.createdFundraisers = fundraisers;
        return user;
      } catch (err) {
        console.error("Error creating fundraiser", err);
        return {};
      }
    },
    removeFundraiser: async (parent, { fundraiserId }, context) => {
      console.log("Remove fundraiser", fundraiserId, context.user._id);
      try {
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedFundraisers: { fundraiserId: fundraiserId } } }
        );

        return await User.findById(context.user._id).populate(
          "savedFundraisers"
        );
      } catch (err) {
        console.error("Error removing fundraiser", err);
        return {};
      }
    },
    addContribution: async (
      parent,
      { contributorUsername, contributedAmount, fundraiserId, card }
    ) => {
      if (!valid.number(card.number).isValid) {
        throw new UserInputError("Invalid credit card number");
      }

      if (!valid.expirationMonth(card.expirationMonth).isValid) {
        throw new UserInputError("Invalid expiration month");
      }

      if (!valid.expirationYear(card.expirationYear).isValid) {
        throw new UserInputError("Invalid expiration year");
      }

      if (!valid.cvv(card.cvv).isValid) {
        throw new UserInputError("Invalid cvv");
      }

      if (!valid.cardholderName(card.name).isValid) {
        throw new UserInputError("Invalid name");
      }

      let fundraiser = await Fundraiser.findOneAndUpdate(
        { _id: fundraiserId },
        {
          $addToSet: {
            contributions: {
              contributorUsername,
              contributedAmount,
            },
          },
        }
      );
      console.log("card", card);

      return await Fundraiser.findById(fundraiserId).populate("contributions");
    },
    addActivityLog: async (parent, { actionType, description }, context) => {
      const userPerformingAction = context.user ? context.user._id : null;
      const ipAddress = context.req.ipInfo ? context.req.ipInfo.ip : null;
  
      const activityLog = await ActivityLog.create({
        userPerformingAction,
        actionType,
        description,
        ipAddress,
      });
  
      return activityLog;
    },
    createAnalytics: async (parent, { analyticsInput }, context) => {
      const createdAnalytics = await Analytics.create(analyticsInput);
  
      return createdAnalytics;
    },
    updateAnalytics: async (parent, { analyticsInput }, context) => {
      const updatedAnalytics = await Analytics.findOneAndUpdate(
        {},
        { $set: analyticsInput },
        { new: true, upsert: true }
      );
  
      return updatedAnalytics;
    },
    addCampaignUpdate: async (parent, { campaignUpdateInput }) => {
      const newCampaignUpdate = await CampaignUpdate.create(campaignUpdateInput);
      return newCampaignUpdate;
    },
    requestDonationRefund: async (parent, { donationRefundRequestInput }) => {
      const newDonationRefundRequest = await DonationRefundRequest.create(donationRefundRequestInput);
      return newDonationRefundRequest;
    },
    updateDonationRefundRequestStatus: async (parent, { refundRequestID, status, administratorComments }) => {
      return await DonationRefundRequest.findByIdAndUpdate(
        refundRequestID,
        { $set: { status, administratorComments } },
        { new: true }
      );
    },
    submitReport: async (parent, { reportInput }) => {
      const newReport = await Report.create(reportInput);
      return newReport;
    },
    updateReportStatus: async (parent, { reportID, status }) => {
      return await Report.findByIdAndUpdate(
        reportID,
        { $set: { status } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
