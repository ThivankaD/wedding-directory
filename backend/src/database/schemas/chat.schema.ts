import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';


export interface IChat {
  chatId: string;
  serviceId: string;
  vendorId: string;
  visitorId: string;
  visitor: { id: string };
  vendor: { id: string };
  service: { id: string };
  messages: Array<{
    id : string;
    content: string;
    senderId: string;
    senderType: string;
    timestamp: Date;
    readBy: string[]; // Array of user IDs who have read this message
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export const ChatSchema = new Schema({
  chatId: { type: String, required: true, unique: true },
  serviceId: { type: String, required: true },
  vendorId: { type: String, required: true },
  visitorId: { type: String, required: true },
  messages: [{
    id: { type: String, default: uuid },
    content: String,
    senderId: String,
    senderType: String,
    timestamp: { type: Date, default: Date.now },
    readBy: { type: [String], default: [] }
  }]
}, { timestamps: true });
