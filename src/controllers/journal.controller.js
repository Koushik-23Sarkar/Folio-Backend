import mongoose, { isValidObjectId } from "mongoose";
import { Journal } from "../models/journal.model.js";
import { EmotionAnalysis } from "../models/EmotionAnalysis.model.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import analyzeEmotion from "../services/llm.service.js";

// GET /journals?page=1&limit=10&emotion=happy&ambience=forest&sortBy=createdAt&sortOrder=desc
const getAllJournal = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    emotion,
    ambience,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const userId = req.user._id;

  const filter = { userId };
  if (emotion) filter.emotion = emotion;
  if (ambience) filter.ambience = ambience;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [journals, total] = await Promise.all([
    Journal.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Journal.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        journals,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
      "Journals fetched successfully"
    )
  );
});

// POST /journals
const publishAJournal = asyncHandler(async (req, res) => {
  const { text, ambience, emotion } = req.body;

  if (!text?.trim()) {
    throw new ApiError(400, "Journal text is required");
  }

  const validAmbiences = ["forest", "ocean", "mountain", "other"];
  if (ambience && !validAmbiences.includes(ambience)) {
    throw new ApiError(
      400,
      `Invalid ambience. Must be one of: ${validAmbiences.join(", ")}`
    );
  }

  const journal = await Journal.create({
    userId: req.user._id,
    text: text.trim(),
    ambience: ambience || "other",
    emotion: emotion?.trim() || "",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, journal, "Journal created successfully"));
});

// GET /journals/:journalId
const getJournalById = asyncHandler(async (req, res) => {
  const { journalId } = req.params;

  if (!isValidObjectId(journalId)) {
    throw new ApiError(400, "Invalid journal ID");
  }

  const journal = await Journal.findById(journalId).lean();

  if (!journal) {
    throw new ApiError(404, "Journal not found");
  }

  if (journal.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to view this journal");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, journal, "Journal fetched successfully"));
});

// PATCH /journals/:journalId
const updateJournal = asyncHandler(async (req, res) => {
  const { journalId } = req.params;
  const { text, ambience, emotion } = req.body;

  if (!isValidObjectId(journalId)) {
    throw new ApiError(400, "Invalid journal ID");
  }

  if (!text?.trim() && !ambience && !emotion) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const validAmbiences = ["forest", "ocean", "mountain", "other"];
  if (ambience && !validAmbiences.includes(ambience)) {
    throw new ApiError(
      400,
      `Invalid ambience. Must be one of: ${validAmbiences.join(", ")}`
    );
  }

  const journal = await Journal.findById(journalId);

  if (!journal) {
    throw new ApiError(404, "Journal not found");
  }

  if (journal.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this journal");
  }

  if (text?.trim()) journal.text = text.trim();
  if (ambience) journal.ambience = ambience;
  if (emotion?.trim()) journal.emotion = emotion.trim();

  await journal.save();

  return res
    .status(200)
    .json(new ApiResponse(200, journal, "Journal updated successfully"));
});

// DELETE /journals/:journalId
const deleteJournal = asyncHandler(async (req, res) => {
  const { journalId } = req.params;

  if (!isValidObjectId(journalId)) {
    throw new ApiError(400, "Invalid journal ID");
  }

  const journal = await Journal.findById(journalId);

  if (!journal) {
    throw new ApiError(404, "Journal not found");
  }

  if (journal.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this journal");
  }

  await Promise.all([
    Journal.findByIdAndDelete(journalId),
    EmotionAnalysis.deleteMany({ journalId }),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Journal deleted successfully"));
});

// POST /api/journal/analyze
// Accepts raw text directly (no journalId needed)
const analyzeJournal = asyncHandler(async (req, res) => {
  const { text, journalId } = req.body;

  if (!text?.trim()) {
    throw new ApiError(400, "Journal text is required");
  }

  const response = await analyzeEmotion(text);
  console.log(response);

  const EmotionAnalysisResult = await EmotionAnalysis.create({
    journalId: journalId,
    userId: req.user._id,
    emotion: response.emotion,
    keywords: response.keywords,
    summary: response.summary
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      EmotionAnalysisResult,
      "Journal analyzed successfully"
    )
  );
});

// GET /api/journal/insights/:userId
const getInsights = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (userId !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to view these insights");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Total journal entries: ok
  const totalEntries = await Journal.countDocuments({ userId: userObjectId });

  // Most frequent emotion
  const topEmotion = await EmotionAnalysis.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: "$emotion",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  // Most used ambience: ok
  const mostUsedAmbience = await Journal.aggregate([
    { $match: { userId: userObjectId } },
    {
      $group: {
        _id: "$ambience",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  // Recent keywords
  const recentKeywords = await EmotionAnalysis.aggregate([
    {
      $match: { userId: userObjectId }
    },

    {
      $sort: { createdAt: -1 }
    },

    {
      $limit: 5
    },

    {
      $unwind: "$keywords"
    },

    {
      $group: {
        _id: null,
        recentKeywords: { $addToSet: "$keywords" }
      }
    },

    {
      $project: {
        _id: 0,
        recentKeywords: 1
      }
    }
  ]);

  res.json({
    totalEntries,
    topEmotion: topEmotion[0]?._id || null,
    mostUsedAmbience: mostUsedAmbience[0]?._id || null,
    recentKeywords: recentKeywords[0].recentKeywords
  });
});

export {
  getAllJournal,
  publishAJournal,
  getJournalById,
  updateJournal,
  deleteJournal,
  getInsights,
  analyzeJournal,
};