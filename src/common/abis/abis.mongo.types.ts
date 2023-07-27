import { MongoDB } from '@alien-worlds/aw-storage-mongodb';

export type ContractEncodedAbiMongoModel = {
  block_number: MongoDB.Long;
  contract: string;
  hex: string;
};
