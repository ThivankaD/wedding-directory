import 'dotenv/config';
import mongoose, { Schema } from 'mongoose';

interface LegacyChat {
  _id: mongoose.Types.ObjectId;
  chatId: string;
  serviceId?: string;
  offeringId?: string;
  vendorId?: string;
  visitorId?: string;
}

const ChatMigrationSchema = new Schema<LegacyChat>(
  {},
  {
    strict: false,
    collection: 'chats',
  },
);

const ChatMigrationModel = mongoose.model<LegacyChat>(
  'ChatMigration',
  ChatMigrationSchema,
);

async function migrate() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing. Set it in backend/.env');
  }

  const apply = process.argv.includes('--apply');
  await mongoose.connect(mongoUri);

  try {
    const missingServiceChats = await ChatMigrationModel.find({
      $or: [
        { serviceId: { $exists: false } },
        { serviceId: null },
        { serviceId: '' },
      ],
    })
      .select('_id chatId offeringId vendorId visitorId serviceId')
      .lean<LegacyChat[]>();

    const migratable = missingServiceChats.filter(
      (chat) => typeof chat.offeringId === 'string' && chat.offeringId.trim(),
    );
    const unresolved = missingServiceChats.filter((chat) => !chat.offeringId);

    console.log(`Chats missing serviceId: ${missingServiceChats.length}`);
    console.log(`Chats migratable from offeringId: ${migratable.length}`);
    console.log(`Chats requiring manual review: ${unresolved.length}`);

    if (!apply) {
      console.log(
        'Dry run only. Re-run with --apply to migrate offeringId values.',
      );
      return;
    }

    if (migratable.length > 0) {
      const result = await ChatMigrationModel.bulkWrite(
        migratable.map((chat) => ({
          updateOne: {
            filter: {
              _id: chat._id,
              $or: [
                { serviceId: { $exists: false } },
                { serviceId: null },
                { serviceId: '' },
              ],
            },
            update: { $set: { serviceId: chat.offeringId!.trim() } },
          },
        })),
      );
      console.log(`Migrated chats: ${result.modifiedCount}`);
    }

    if (unresolved.length > 0) {
      console.warn('Unresolved chat IDs:');
      unresolved.forEach((chat) => console.warn(`- ${chat.chatId}`));
    }
  } finally {
    await mongoose.disconnect();
  }
}

migrate().catch((error: unknown) => {
  console.error('Chat migration failed:', error);
  process.exitCode = 1;
});
