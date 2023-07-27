import { MongoDB } from '@alien-worlds/aw-storage-mongodb';

export type BlockStateMongoModel = {
  _id: MongoDB.ObjectId;
  last_modified_timestamp: Date;
  block_number: MongoDB.Long;
  actions: string[];
  tables: string[];
};
