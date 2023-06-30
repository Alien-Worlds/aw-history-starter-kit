import {
  MongoConfig,
  MongoQueryBuilders,
  MongoSource,
} from '@alien-worlds/storage-mongodb';
import { BlockState, log } from '@alien-worlds/api-history-tools';

import { UpdateBlockNumberMongoQueryBuilder } from './query-builders/update-block-number.mongo.query-builder';
import { BlockStateMongoMapper } from './block-state.mongo.mapper';
import { BlockStateCollection } from './block-state.mongo.collection';

export class BlockStateCreator {
  public static async create(mongo: MongoSource | MongoConfig) {
    log(` *  Block State ... [starting]`);
    const mapper = new BlockStateMongoMapper();
    const queryBuilders = new MongoQueryBuilders();
    const updateBlockNumberQueryBuilder = new UpdateBlockNumberMongoQueryBuilder();
    const mongoSource =
      mongo instanceof MongoSource ? mongo : await MongoSource.create(mongo);
    const collection = new BlockStateCollection(mongoSource);
    const state = new BlockState(
      collection,
      mapper,
      queryBuilders,
      updateBlockNumberQueryBuilder
    );

    log(` *  Block State ... [ready]`);
    return state;
  }
}
