const { Schema, model } = require("mongoose");

const donationRefundRequestSchema = new Schema(
  {
    userRequestingRefund: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    contributionID: {
      type: Schema.Types.ObjectId,
      ref: "Contribution", 
      required: true,
    },
    fundraiserID: {
      type: Schema.Types.ObjectId,
      ref: "Fundraiser", 
      required: true,
    },
    reasonForRefund: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Denied"],
      default: "Pending",
    },
    administratorComments: {
      type: String,
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const DonationRefundRequest = model("DonationRefundRequest", donationRefundRequestSchema);

module.exports = DonationRefundRequest;
