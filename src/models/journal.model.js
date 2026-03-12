import mongoose, {Schema} from "mongoose";

const journalSchema = new Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  ambience: {
    type: String,
    enum: ["forest", "ocean", "mountain","other"]
  },

  text: {
    type: String,
    required: true
  },

  emotion: { // might not needed
    type: String
  }

}, { timestamps: true });

export const Journal = mongoose.model("Journal", journalSchema)