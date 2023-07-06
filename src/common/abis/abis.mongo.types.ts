import { MongoDB } from '@alien-worlds/storage-mongodb';

export type ContractEncodedAbiMongoModel = {
  block_number: MongoDB.Long;
  contract: string;
  hex: string;
};
