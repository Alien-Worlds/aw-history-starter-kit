import {
  BlockRangeScanner,
  BroadcastClient,
  BroadcastTcpClient,
  DatabaseConfigBuilder,
  Failure,
  ReaderConfig,
  ReaderDependencies,
  Result,
} from '@alien-worlds/aw-history';
import { MongoConfig, buildMongoConfig } from '@alien-worlds/aw-storage-mongodb';
import { BlockRangeScannerFactory } from '../common';
import path from 'path';

/**
 * An abstract class representing a reader dependencies.
 * @class ReaderDependencies
 */
export class DefaultReaderDependencies implements ReaderDependencies {
  public broadcastClient: BroadcastClient;
  public scanner: BlockRangeScanner;
  public databaseConfigBuilder: DatabaseConfigBuilder = buildMongoConfig;

  public readonly workerLoaderDependenciesPath = path.join(
    __dirname,
    './reader.worker-loader.dependencies'
  );

  public async initialize(config: ReaderConfig<MongoConfig>): Promise<Result> {
    try {
      this.broadcastClient = new BroadcastTcpClient(config.broadcast, 'reader');
      this.scanner = await BlockRangeScannerFactory.create(
        config.database,
        config.scanner
      );
      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
