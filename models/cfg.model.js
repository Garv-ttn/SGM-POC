const mongoose = require("mongoose");

const cfgSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["popular", "featured"],
      default: "popular",
    },
    sportName: {
      type: String,
      required: true,
    },
    compName: {
      type: String,
      required: true,
    },
    matchId: {
      type: Number,
    },
    matchName: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    numberOfBets: {
      type: Number,
    },
    minLegs: {
      type: Number,
    },
    maxLegs: {
      type: Number,
    },
    minPrice: {
      type: Number,
    },
    maxPrice: {
      type: Number,
    },
    tournamentName: {
      type: String,
    },
    propositions: [
      {
        propId: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("configurations", cfgSchema);
