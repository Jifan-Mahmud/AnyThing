import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).populate(
      "senderId",
      "username name avatarUrl"
    );
    sendSuccess(res, messages);
  } catch (err) {
    next(err);
  }
};
