import { ProcessorTaskError } from '@alien-worlds/api-history-tools';
import { MongoDB } from '@alien-worlds/storage-mongodb';

export type ProcessorTaskMongoModel = {
  _id?: MongoDB.ObjectId;
  abi?: string;
  is_fork?: boolean;
  short_id?: string;
  label?: string;
  timestamp?: Date;
  type?: string;
  mode?: string;
  content?: MongoDB.Binary;
  hash?: string;
  block_number?: MongoDB.Long;
  block_timestamp?: Date;
  error?: ProcessorTaskError;
};
