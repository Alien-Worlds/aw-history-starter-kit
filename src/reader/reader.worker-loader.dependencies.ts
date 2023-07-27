import { MongoConfig, MongoSource } from '@alien-worlds/aw-storage-mongodb';
import { ReaderConfig, ReaderWorkerLoaderDependencies } from '@alien-worlds/aw-history';
import {
  BlockRangeScannerFactory,
  BlockStateFactory,
  UnprocessedBlockQueueFactory,
} from '../common';
import { AntelopeBlockReaderFactory } from '@alien-worlds/aw-antelope';

/**
 * An abstract class representing a default ReaderWorkerLoader dependencies.
 * @class DefaultReaderWorkerLoaderDependencies
 */
export class DefaultReaderWorkerLoaderDependencies extends ReaderWorkerLoaderDependencies {
  public async initialize(config: ReaderConfig<MongoConfig>): Promise<void> {
    const mongo = await MongoSource.create(config.database);
    this.scanner = await BlockRangeScannerFactory.create(mongo, config.scanner);
    this.blockReader = await AntelopeBlockReaderFactory.create(mongo, config.blockReader);
    this.blockState = await BlockStateFactory.create(mongo);
    this.blockQueue = await UnprocessedBlockQueueFactory.create(
      mongo,
      config.unprocessedBlockQueue
    );
  }
}
