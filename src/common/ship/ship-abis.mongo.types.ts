import { MongoDB } from '@alien-worlds/storage-mongodb';

export type ShipAbiMongoModel = {
  _id?: MongoDB.ObjectId;
  last_modified_timestamp: Date;
  version: string;
  abi: string;
};
