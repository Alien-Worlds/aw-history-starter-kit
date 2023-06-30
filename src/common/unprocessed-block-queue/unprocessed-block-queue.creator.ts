import { MongoConfig, MongoSource } from '@alien-worlds/storage-mongodb';

import {
  UnprocessedBlockQueue,
  UnprocessedBlockQueueConfig,
  log,
} from '@alien-worlds/api-history-tools';
import { UnprocessedBlockMongoCollection } from './unprocessed-block-queue.mongo.collection';
import { UnprocessedBlockMongoMapper } from './unprocessed-block-queue.mongo.mapper';
import { BlockMongoModel } from './unprocessed-block-queue.mongo.types';

export class UnprocessedBlockQueueCreator {
  public static async create(
    mongo: MongoSource | MongoConfig,
    config: UnprocessedBlockQueueConfig
  ): Promise<UnprocessedBlockQueue<BlockMongoModel>> {
    let mongoSource: MongoSource;

    log(` *  Unprocessed Block Queue ... [starting]`);

    if (mongo instanceof MongoSource) {
      mongoSource = mongo;
    } else {
      mongoSource = await MongoSource.create(mongo);
    }

    const queue = new UnprocessedBlockQueue(
      new UnprocessedBlockMongoCollection(mongoSource),
      new UnprocessedBlockMongoMapper(),
      config.maxBytesSize,
      config.batchSize
    );

    log(` *  Unprocessed Block Queue ... [ready]`);

    return queue;
  }
}
