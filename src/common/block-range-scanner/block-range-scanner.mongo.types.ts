import { MongoDB } from '@alien-worlds/storage-mongodb';

/*
  We need to keep tree_depth in _id because if the entire scan will use only one node,
  we will not be able to create a child document with the same _id and tree_depth: 1.
*/

export type BlockRangeScanIdModel = {
  start: MongoDB.Long;
  end: MongoDB.Long;
  scan_key: string;
  tree_depth: number;
};

export type BlockRangeScanModel = {
  _id: BlockRangeScanIdModel;
  hash?: string;
  processed_block?: MongoDB.Long;
  timestamp?: Date;
  start_timestamp?: Date;
  end_timestamp?: Date;
  is_leaf_node?: boolean;
  parent_id?: BlockRangeScanIdModel;
};
