import { MongoConfig, MongoSource } from '@alien-worlds/storage-mongodb';
import {
  ReaderConfig,
  ReaderWorkerLoaderDependencies,
} from '@alien-worlds/api-history-tools';
import { BlockReaderCreator } from '../common/block-reader/block-reader.creator';
import {
  BlockRangeScannerCreator,
  BlockStateCreator,
  UnprocessedBlockQueueCreator,
} from '../common';

/**
 * An abstract class representing a default ReaderWorkerLoader dependencies.
 * @class DefaultReaderWorkerLoaderDependencies
 */
export class DefaultReaderWorkerLoaderDependencies extends ReaderWorkerLoaderDependencies {

  public async initialize(config: ReaderConfig<MongoConfig>): Promise<void> {
    const mongo = await MongoSource.create(config.database);
    this.scanner = await BlockRangeScannerCreator.create(mongo, config.scanner);
    this.blockReader = await BlockReaderCreator.create(mongo, config.blockReader);
    this.blockState = await BlockStateCreator.create(mongo);
    this.blockQueue = await UnprocessedBlockQueueCreator.create(
      mongo,
      config.unprocessedBlockQueue
    );
  }
}
