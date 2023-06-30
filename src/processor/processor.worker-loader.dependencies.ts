import { EosSerializer } from '@alien-worlds/eos';
import {
  ProcessorConfig,
  ProcessorWorkerLoaderDependencies,
} from '@alien-worlds/api-history-tools';
import { MongoConfig, MongoSource } from '@alien-worlds/storage-mongodb';

/**
 * An abstract class representing a ProcessorWorkerLoader dependencies.
 * @class ProcessorWorkerLoaderDependencies
 */
export class DefaultProcessorWorkerLoaderDependencies
  implements ProcessorWorkerLoaderDependencies
{
  public dataSource: MongoSource;
  public serializer: EosSerializer;
  public processorsPath: string;

  public async initialize(
    config: ProcessorConfig<MongoConfig>,
    processorsPath: string
  ): Promise<void> {
    this.dataSource = await MongoSource.create(config.database);
    this.serializer = new EosSerializer();
    this.processorsPath = processorsPath;
  }
}
