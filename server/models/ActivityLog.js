const { Schema, model } = require("mongoose");

const activityLogSchema = new Schema(
  {
    userPerformingAction: {
      type: Schema.Types.ObjectId,
      ref: "User", 
    },
    actionType: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
    description: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const ActivityLog = model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
