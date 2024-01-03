const { User,
  ActivityLog,
  Analytics,
  CampaignUpdate,
  DonationRefundRequest,
  Report, } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [
        { _id: user ? user._id : params.id },
        { username: params.username },
      ],
    });

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Cannot find a user with this id!" });
    }

    res.json(foundUser);
  },
  async createUser({ body }, res) {
    const user = await User.create(body);

    if (!user) {
      return res.status(400).json({ message: "Something is wrong!" });
    }
    const token = signToken(user);
    res.json({ token, user });
  },
  async login({ body }, res) {
    const user = await User.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });
    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.isCorrectPassword(body.password);

    if (!correctPw) {
      return res.status(400).json({ message: "Wrong password!" });
    }
    const token = signToken(user);
    res.json({ token, user });
  },
  async saveFundraiser({ user, body }, res) {
    console.log(user);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedFundraisers: body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
  async deleteFundraiser({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedFundraisers: { fundraiserId: params.fundraiserId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
  },
  async getActivityLogs(req, res) {
    try {
      const activityLogs = await ActivityLog.find({});
      res.json(activityLogs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async createActivityLog(req, res) {
    try {
      const { actionType, description } = req.body;
      const userPerformingAction = req.user ? req.user._id : null;
      const ipAddress = req.ip; // Assuming you're using Express and IP middleware
  
      const activityLog = await ActivityLog.create({
        userPerformingAction,
        actionType,
        description,
        ipAddress,
      });
  
      res.json(activityLog);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async getAnalytics(req, res) {
    try {
      const analytics = await Analytics.findOne({});
      res.json(analytics);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async createAnalytics(req, res) {
    try {
      const { analyticsInput } = req.body;
      const createdAnalytics = await Analytics.create(analyticsInput);
      res.json(createdAnalytics);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async updateAnalytics(req, res) {
    try {
      const { analyticsInput } = req.body;
      const updatedAnalytics = await Analytics.findOneAndUpdate(
        {},
        { $set: analyticsInput },
        { new: true, upsert: true }
      );
      res.json(updatedAnalytics);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async addCampaignUpdate(req, res) {
    try {
      const { campaignUpdateInput } = req.body;
      const newCampaignUpdate = await CampaignUpdate.create(campaignUpdateInput);
      res.json(newCampaignUpdate);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async getCampaignUpdatesByFundraiser(req, res) {
    try {
      const { fundraiserID } = req.params;
      const campaignUpdates = await CampaignUpdate.find({ fundraiserID }).sort({ datePosted: -1 });
      res.json(campaignUpdates);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async requestDonationRefund(req, res) {
    try {
      const { donationRefundRequestInput } = req.body;
      const newDonationRefundRequest = await DonationRefundRequest.create(
        donationRefundRequestInput
      );
      res.json(newDonationRefundRequest);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async updateDonationRefundRequestStatus(req, res) {
    try {
      const { refundRequestID, status, administratorComments } = req.body;
      const updatedDonationRefundRequest = await DonationRefundRequest.findByIdAndUpdate(
        refundRequestID,
        { $set: { status, administratorComments } },
        { new: true }
      );
      res.json(updatedDonationRefundRequest);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async getAllDonationRefundRequests(req, res) {
    try {
      const refunds = await DonationRefundRequest.find({});
      res.json(refunds);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async getDonationRefundRequestsByUser(req, res) {
    try {
      const { userRequestingRefund } = req.params;
      const donationRefundRequests = await DonationRefundRequest.find({
        userRequestingRefund,
      }).sort({ dateRequested: -1 });
      res.json(donationRefundRequests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async submitReport(req, res) {
    try {
      const { reportInput } = req.body;
      const newReport = await Report.create(reportInput);
      res.json(newReport);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async updateReportStatus(req, res) {
    try {
      const { reportID, status } = req.body;
      const updatedReport = await Report.findByIdAndUpdate(
        reportID,
        { $set: { status } },
        { new: true }
      );
      res.json(updatedReport);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async getReportsByUser(req, res) {
    try {
      const { reporter } = req.params;
      const reports = await Report.find({ reporter }).sort({ dateSubmitted: -1 });
      res.json(reports);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async getReports(req, res) {
    try {
      const reports = await Report.find().sort({ dateSubmitted: -1 });
      res.json(reports);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
