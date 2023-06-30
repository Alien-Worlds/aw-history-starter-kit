import { MongoDB } from '@alien-worlds/storage-mongodb';

export type BlockNumberWithIdDocument = {
  block_num?: MongoDB.Long;
  block_id?: string;
};

export type BlockMongoModel = {
  _id?: MongoDB.ObjectId;
  head?: BlockNumberWithIdDocument;
  this_block?: BlockNumberWithIdDocument;
  last_irreversible?: BlockNumberWithIdDocument;
  prev_block?: BlockNumberWithIdDocument;
  block?: MongoDB.Binary;
  traces?: MongoDB.Binary;
  deltas?: MongoDB.Binary;
  abi_version?: string;
  [key: string]: unknown;
};
