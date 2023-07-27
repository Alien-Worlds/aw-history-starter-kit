import {
  ProcessorTaskQueue,
  ProcessorTaskQueueConfig,
  log,
} from '@alien-worlds/aw-history';
import { MongoConfig, MongoSource } from '@alien-worlds/aw-storage-mongodb';
import { ProcessorTaskMongoCollection } from './processor-task.mongo.collection';
import { ProcessorTaskMongoMapper } from './processor-task.mongo.mapper';
import { UnsuccessfulProcessorTaskSource } from './unsuccessful-processor-task.mongo.collection';

export class ProcessortaskQueueCreator {
  public static async create(
    mongo: MongoSource | MongoConfig,
    config: ProcessorTaskQueueConfig
  ): Promise<ProcessorTaskQueue> {
    let mongoSource: MongoSource;

    log(` *  Processor Tasks Queue ... [starting]`);

    if (mongo instanceof MongoSource) {
      mongoSource = mongo;
    } else {
      mongoSource = await MongoSource.create(mongo);
    }

    const queue = new ProcessorTaskQueue(
      new ProcessorTaskMongoCollection(mongoSource, config),
      new ProcessorTaskMongoMapper(),
      new UnsuccessfulProcessorTaskSource(mongoSource)
    );

    log(` *  Processor Tasks Queue ... [ready]`);

    return queue;
  }
}
