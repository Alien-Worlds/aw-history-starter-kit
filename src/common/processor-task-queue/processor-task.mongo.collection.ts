import {
  MongoCollectionSource,
  MongoDB,
  MongoSource,
} from '@alien-worlds/storage-mongodb';
import { ProcessorTaskMongoModel } from './processor-task.mongo.types';
import {
  DataSourceError,
  ProcessorTaskQueueConfig,
  ProcessorTaskSource,
} from '@alien-worlds/api-history-tools';

export class ProcessorTaskMongoCollection
  extends MongoCollectionSource<ProcessorTaskMongoModel>
  implements ProcessorTaskSource<ProcessorTaskMongoModel>
{
  private transactionOptions: MongoDB.TransactionOptions;

  constructor(mongoSource: MongoSource, private config: ProcessorTaskQueueConfig) {
    super(mongoSource, 'history_tools.processor_tasks', {
      indexes: [
        {
          key: { block_number: 1 },
          background: true,
        },
        {
          key: { timestamp: 1, block_number: 1 },
          background: true,
        },
        {
          key: { mode: 1, type: 1 },
          background: true,
        },
        {
          key: { short_id: 1, mode: 1, type: 1 },
          background: true,
        },
        {
          key: { short_id: 1, mode: 1, block_number: 1, hash: 1 },
          unique: true,
          background: true,
        },
      ],
    });
  }

  public async nextTask(mode?: string): Promise<ProcessorTaskMongoModel> {
    try {
      const filter = mode ? { mode } : {};
      const result = await this.collection.findOneAndDelete(filter);

      return result.value;
    } catch (error) {
      throw DataSourceError.createError(error);
    }
  }
}
