import { MongoDB } from '@alien-worlds/storage-mongodb';

export type FeaturedContractMongoModel = {
  _id?: MongoDB.ObjectId;
  account?: string;
  initial_block_number?: MongoDB.Long;
};
