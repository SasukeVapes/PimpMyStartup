const { Schema, model } = require("mongoose");

const campaignUpdateSchema = new Schema(
  {
    fundraiserID: {
      type: Schema.Types.ObjectId,
      ref: "Fundraiser", // Adjust this based on your actual model name
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    datePosted: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const CampaignUpdate = model("CampaignUpdate", campaignUpdateSchema);

module.exports = CampaignUpdate;