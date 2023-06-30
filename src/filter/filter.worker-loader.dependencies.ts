import {
  Abis,
  Featured,
  FeaturedContracts,
  FeaturedUtils,
  FilterConfig,
  FilterWorkerLoaderDependencies,
  MissingCriteriaError,
  ProcessorTaskQueue,
  Serializer,
  ShipAbis,
} from '@alien-worlds/api-history-tools';
import { MongoConfig, MongoSource } from '@alien-worlds/storage-mongodb';
import {
  AbisCreator,
  FeaturedContractsCreator,
  ProcessortaskQueueCreator,
} from '../common';
import { EosSerializer } from '@alien-worlds/eos';
import { ShipAbisCreator } from '../common/ship/ship-abis.creator';

export default class DefaultFilterWorkerLoaderDependencies
  implements FilterWorkerLoaderDependencies
{
  public processorTaskQueue: ProcessorTaskQueue;
  public abis: Abis;
  public shipAbis: ShipAbis;
  public featuredContracts: FeaturedContracts;
  public serializer: Serializer;

  public async initialize(
    config: FilterConfig<MongoConfig>,
    featuredCriteriaPath: string
  ): Promise<void> {
    const featuredCriteria = await FeaturedUtils.fetchCriteria(featuredCriteriaPath);

    if (!featuredCriteria) {
      throw new MissingCriteriaError(featuredCriteriaPath);
    }

    const mongoSource = await MongoSource.create(config.database);
    const contracts = FeaturedUtils.readFeaturedContracts(featuredCriteria);
    this.processorTaskQueue = await ProcessortaskQueueCreator.create(
      mongoSource,
      config.processorTaskQueue
    );
    this.abis = await AbisCreator.create(
      mongoSource,
      config.abis.service,
      contracts,
      false
    );
    this.featuredContracts = await FeaturedContractsCreator.create(
      mongoSource,
      config.featured,
      featuredCriteria
    );
    this.shipAbis = await ShipAbisCreator.create(mongoSource);
    this.serializer = new EosSerializer();
  }
}
