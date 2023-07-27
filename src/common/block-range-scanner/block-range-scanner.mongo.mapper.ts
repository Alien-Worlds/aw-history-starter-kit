import { MongoDB, MongoMapper } from '@alien-worlds/aw-storage-mongodb';
import {
  BlockRangeScan,
  BlockRangeScanParent,
  parseToBigInt,
} from '@alien-worlds/aw-history';
import {
  BlockRangeScanIdModel,
  BlockRangeScanModel,
} from './block-range-scanner.mongo.types';

export class BlockRangeScanMongoMapper extends MongoMapper<
  BlockRangeScan,
  BlockRangeScanModel
> {
  protected toBlockRangeScanParent(model: BlockRangeScanIdModel) {
    const { start, end, scan_key, tree_depth } = model;

    return new BlockRangeScanParent(
      parseToBigInt(start),
      parseToBigInt(end),
      scan_key,
      tree_depth
    );
  }

  protected fromBlockRangeScanParent(entity: BlockRangeScanParent) {
    const { start, end, scanKey, treeDepth } = entity;
    const model = {
      start: MongoDB.Long.fromString(start.toString()),
      end: MongoDB.Long.fromString(end.toString()),
      scan_key: scanKey,
      tree_depth: treeDepth,
    };

    return model;
  }

  public toEntity(model: BlockRangeScanModel): BlockRangeScan {
    const {
      _id: { start, end, scan_key, tree_depth },
      hash,
      processed_block,
      timestamp,
      start_timestamp,
      end_timestamp,
      parent_id,
      is_leaf_node,
    } = model;

    const parent = parent_id ? this.toBlockRangeScanParent(parent_id) : null;

    let processedBlock: bigint;

    if (processed_block) {
      processedBlock = parseToBigInt(processed_block);
    }

    return new BlockRangeScan(
      hash,
      parseToBigInt(start),
      parseToBigInt(end),
      scan_key,
      tree_depth,
      parent,
      is_leaf_node,
      processedBlock,
      timestamp,
      start_timestamp,
      end_timestamp
    );
  }

  public fromEntity(entity: BlockRangeScan): BlockRangeScanModel {
    const { start, scanKey, end, treeDepth, hash } = entity;
    const model: BlockRangeScanModel = {
      _id: {
        start: MongoDB.Long.fromString(start.toString()),
        end: MongoDB.Long.fromString(end.toString()),
        scan_key: scanKey,
        tree_depth: treeDepth,
      },
      hash,
    };

    if (typeof entity.processedBlock == 'bigint') {
      model.processed_block = MongoDB.Long.fromString(entity.processedBlock.toString());
    }

    if (typeof entity.isLeafNode == 'boolean') {
      model.is_leaf_node = entity.isLeafNode;
    }

    if (entity.parent) {
      model.parent_id = this.fromBlockRangeScanParent(entity.parent);
    }

    if (entity.timestamp) {
      model.timestamp = entity.timestamp;
    }

    if (entity.startTimestamp) {
      model.start_timestamp = entity.startTimestamp;
    }

    if (entity.endTimestamp) {
      model.end_timestamp = entity.endTimestamp;
    }

    return model;
  }
}
