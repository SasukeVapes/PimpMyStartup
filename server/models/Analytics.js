const { Schema, model } = require("mongoose");

const analyticsSchema = new Schema(
  {
    totalFundsRaised: {
      type: Number,
      default: 0,
    },
    numberOfFundraisersCreated: {
      type: Number,
      default: 0,
    },
    averageDonationAmount: {
      type: Number,
      default: 0,
    },
    popularCategoriesTags: [
      {
        type: String,
      },
    ],
    userActivityTrends: {
      signUps: {
        type: Number,
        default: 0,
      },
      logins: {
        type: Number,
        default: 0,
      },
      donations: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Analytics = model("Analytics", analyticsSchema);

module.exports = Analytics;
