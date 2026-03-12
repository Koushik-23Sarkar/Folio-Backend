import mongoose, { Schema } from "mongoose";

const EmotionAnalysisSchema = new Schema({

    journalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Journal",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
    emotion: {
      type: String,
      required: true
    },
    keywords: [
      {
        type: String
      }
    ],
    summary: {
      type: String
    },

}, { timestamps: true });

export const EmotionAnalysis = mongoose.model("EmotionAnalysis", EmotionAnalysisSchema)