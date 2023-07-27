import { BlockRangeScanMongoSource } from './block-range-scan.mongo.source';
import { MongoConfig, MongoSource } from '@alien-worlds/aw-storage-mongodb';
import { BlockRangeScanMongoMapper } from './block-range-scanner.mongo.mapper';
import {
  BlockRangeScanConfig,
  BlockRangeScanRepository,
  BlockRangeScanner,
  log,
} from '@alien-worlds/aw-history';

/**
 * @class
 */
export class BlockRangeScannerFactory {
  public static async create(
    mongo: MongoSource | MongoConfig,
    config: BlockRangeScanConfig
  ): Promise<BlockRangeScanner> {
    let mongoSource: MongoSource;

    log(` *  Block Range Scanner ... [starting]`);

    if (mongo instanceof MongoSource) {
      mongoSource = mongo;
    } else {
      mongoSource = await MongoSource.create(mongo);
    }
    const source = new BlockRangeScanMongoSource(mongoSource);
    const mapper = new BlockRangeScanMongoMapper();
    const repository = new BlockRangeScanRepository(source, mapper, config.maxChunkSize);
    const scanner: BlockRangeScanner = new BlockRangeScanner(repository);

    log(` *  Block Range Scanner ... [ready]`);
    return scanner;
  }
}
