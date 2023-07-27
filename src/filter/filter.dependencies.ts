/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path';
import {
  MongoConfig,
  MongoSource,
  buildMongoConfig,
} from '@alien-worlds/aw-storage-mongodb';
import {
  BroadcastClient,
  BroadcastTcpClient,
  DatabaseConfigBuilder,
  Failure,
  FilterAddons,
  FilterConfig,
  FilterDependencies,
  Result,
  UnprocessedBlockQueue,
} from '@alien-worlds/aw-history';
import { BlockMongoModel, UnprocessedBlockQueueFactory } from '../common';

export class DefaultFilterDependencies implements FilterDependencies {
  public broadcastClient: BroadcastClient;
  public unprocessedBlockQueue: UnprocessedBlockQueue<BlockMongoModel>;
  public databaseConfigBuilder: DatabaseConfigBuilder = buildMongoConfig;
  public readonly workerLoaderDependenciesPath = path.join(
    __dirname,
    './filter.worker-loader.dependencies'
  );

  public async initialize(
    config: FilterConfig<MongoConfig>,
    addons?: FilterAddons
  ): Promise<Result<void>> {
    try {
      const mongoSource = await MongoSource.create(config.database);

      this.unprocessedBlockQueue = await UnprocessedBlockQueueFactory.create(
        mongoSource,
        config.unprocessedBlockQueue
      );
      this.broadcastClient = new BroadcastTcpClient(config.broadcast, 'filter');

      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
