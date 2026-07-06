import Conversation from "../models/Conversation.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    }).populate("participants", "username name avatarUrl");
    sendSuccess(res, conversations);
  } catch (err) {
    next(err);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { participants } = req.body;
    const sortedParticipants = participants.sort();

    let conversation = await Conversation.findOne({
      participants: sortedParticipants,
    });

    if (conversation) {
      return sendSuccess(res, conversation);
    }

    conversation = new Conversation({
      participants: sortedParticipants,
    });

    await conversation.save();
    await conversation.populate("participants", "username name avatarUrl");

    sendSuccess(res, conversation, "Conversation created successfully", 201);
  } catch (err) {
    next(err);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate(
      "participants",
      "username name avatarUrl"
    );
    sendSuccess(res, conversation);
  } catch (err) {
    next(err);
  }
};
