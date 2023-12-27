const { Schema, model } = require("mongoose");

const reportSchema = new Schema(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    dateSubmitted: {
      type: Date,
      default: Date.now(),
    },
    fundraiserOrContributionID: {
      type: Schema.Types.ObjectId,
      ref: "Fundraiser", 
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Report = model("Report", reportSchema);

module.exports = Report;
