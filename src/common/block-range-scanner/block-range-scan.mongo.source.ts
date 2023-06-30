/* eslint-disable @typescript-eslint/no-unsafe-return */

import { parseToBigInt } from '@alien-worlds/api-history-tools';
import { BlockRangeScanModel } from './block-range-scanner.mongo.types';
import {
  MongoCollectionSource,
  MongoDB,
  MongoSource,
} from '@alien-worlds/storage-mongodb';

/**
 * Block range scan nodes data source from the mongo database
 * @class
 */
export class BlockRangeScanMongoSource extends MongoCollectionSource<BlockRangeScanModel> {
  public static Token = 'BLOCK_RANGE_SCAN_MONGO_SOURCE';

  /**
   * @constructor
   * @param {MongoSource} mongoSource
   */
  constructor(mongoSource: MongoSource) {
    super(mongoSource, 'history_tools.block_range_scans');
  }

  private async setCurrentBlockProgress(
    document: BlockRangeScanModel,
    processedBlock: bigint
  ) {
    const { _id, is_leaf_node } = document;
    const { start, end } = _id;

    if (!is_leaf_node) {
      throw new Error(
        `(${start.toString()}-${end.toString()}) range has already completed scanning the blockchain.`
      );
    }

    if (processedBlock == parseToBigInt(end) - 1n) {
      await this.findCompletedParentNode(document);
    } else {
      await this.collection.updateOne(
        { _id },
        {
          $set: {
            processed_block: MongoDB.Long.fromBigInt(processedBlock),
            timestamp: new Date(),
          },
        }
      );
    }
  }

  public async startNextScan(scanKey: string): Promise<BlockRangeScanModel> {
    const result = await this.collection.findOneAndUpdate(
      {
        $and: [
          { is_leaf_node: true },
          {
            $or: [
              { timestamp: { $exists: false } },
              /*
              The trick to not use the same block range again on another thread/worker
              ...Probably this could be handled better.
              */
              { timestamp: { $lt: new Date(Date.now() - 1000) } },
            ],
          },
          { '_id.scan_key': scanKey },
        ],
      },
      { $set: { timestamp: new Date() } },
      {
        sort: { timestamp: 1 },
        returnDocument: 'after',
      }
    );

    return result.value as BlockRangeScanModel;
  }

  public async countScanNodes(
    scanKey: string,
    startBlock: bigint,
    endBlock: bigint
  ): Promise<number> {
    const options: unknown[] = [{ '_id.scan_key': scanKey }];

    if (startBlock) {
      options.push({ '_id.start': { $gte: MongoDB.Long.fromBigInt(startBlock) } });
    }

    if (endBlock) {
      options.push({ '_id.end': { $lte: MongoDB.Long.fromBigInt(endBlock) } });
    }

    const result = await this.collection.countDocuments({
      $and: options,
    });

    return result;
  }

  public async removeAll(scanKey: string) {
    await this.collection.deleteMany({ '_id.scan_key': scanKey });
  }

  public async hasScanKey(
    scanKey: string,
    startBlock?: bigint,
    endBlock?: bigint
  ): Promise<boolean> {
    const options: unknown[] = [{ '_id.scan_key': scanKey }];

    if (startBlock) {
      options.push({ '_id.start': MongoDB.Long.fromBigInt(startBlock) });
    }

    if (endBlock) {
      options.push({ '_id.end': MongoDB.Long.fromBigInt(endBlock) });
    }
    const dto = await this.collection.findOne({ $and: options });

    return !!dto;
  }

  public async hasUnscannedNodes(
    scanKey: string,
    startBlock?: bigint,
    endBlock?: bigint
  ): Promise<boolean> {
    const options: unknown[] = [
      { '_id.scan_key': scanKey },
      { '_id.tree_depth': { $gt: 0 } },
      { is_leaf_node: true },
    ];

    if (startBlock) {
      options.push({ 'parent_id.start': MongoDB.Long.fromBigInt(startBlock) });
    }

    if (endBlock) {
      options.push({ 'parent_id.end': MongoDB.Long.fromBigInt(endBlock) });
    }

    const dto = await this.collection.findOne({ $and: options });

    return !!dto;
  }

  public async findRangeForBlockNumber(blockNumber: bigint, scanKey: string) {
    const result = this.collection.find(
      {
        '_id.start': { $lte: MongoDB.Long.fromBigInt(blockNumber) },
        '_id.end': { $gt: MongoDB.Long.fromBigInt(blockNumber) },
        '_id.scan_key': scanKey,
        '_id.tree_depth': { $gt: 0 },
      },
      { sort: { '_id.tree_depth': -1 } }
    );
    const document = await result.next();
    return document;
  }

  public async findCompletedParentNode(document: BlockRangeScanModel) {
    const { _id, parent_id } = document;

    if (parent_id) {
      await this.collection.deleteOne({ _id });
      // fetch all child nodes with parent id that matches this parent_id
      const matchingParentCount = await this.collection.countDocuments({
        parent_id,
      });
      if (matchingParentCount == 0) {
        const parentDocument: BlockRangeScanModel = await this.collection.findOne({
          _id: parent_id,
        });
        await this.findCompletedParentNode(parentDocument);
      }
    } else if (_id.tree_depth === 0) {
      await this.collection.updateOne({ _id }, { $set: { end_timestamp: new Date() } });
    }
  }

  public async updateProcessedBlockNumber(
    scanKey: string,
    blockNumber: bigint
  ): Promise<void> {
    const range: BlockRangeScanModel = await this.findRangeForBlockNumber(
      blockNumber,
      scanKey
    );

    if (range) {
      return this.setCurrentBlockProgress(range, blockNumber);
    }
  }
}
