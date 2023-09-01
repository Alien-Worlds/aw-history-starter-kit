import {
  BlockRangeScanner,
  BlockReader,
  BlockState,
  BroadcastClient,
  BroadcastTcpClient,
  DatabaseConfigBuilder,
  Failure,
  ReaderConfig,
  ReaderDependencies,
  Result,
  UnprocessedBlockQueue,
} from '@alien-worlds/aw-history';
import {
  MongoConfig,
  MongoSource,
  buildMongoConfig,
} from '@alien-worlds/aw-storage-mongodb';
import {
  BlockRangeScannerFactory,
  BlockStateFactory,
  UnprocessedBlockQueueFactory,
} from '../common';
import path from 'path';
import { AntelopeBlockReaderFactory } from '@alien-worlds/aw-antelope';

/**
 * An abstract class representing a reader dependencies.
 * @class ReaderDependencies
 */
export class DefaultReaderDependencies implements ReaderDependencies {
  public broadcastClient: BroadcastClient;
  public scanner: BlockRangeScanner;
  public blockState: BlockState;
  public unprocessedBlockQueue: UnprocessedBlockQueue;
  public blockReader: BlockReader;

  public databaseConfigBuilder: DatabaseConfigBuilder = buildMongoConfig;

  public readonly workerLoaderDependenciesPath = path.join(
    __dirname,
    './reader.worker-loader.dependencies'
  );

  public async initialize(config: ReaderConfig<MongoConfig>): Promise<Result> {
    try {
      const mongo = await MongoSource.create(config.database);
      this.broadcastClient = new BroadcastTcpClient(config.broadcast, 'reader');
      this.scanner = await BlockRangeScannerFactory.create(
        config.database,
        config.scanner
      );
      this.blockReader = await AntelopeBlockReaderFactory.create(
        mongo,
        config.blockReader
      );
      this.blockState = await BlockStateFactory.create(mongo);
      this.unprocessedBlockQueue = await UnprocessedBlockQueueFactory.create(
        mongo,
        config.unprocessedBlockQueue
      );

      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
