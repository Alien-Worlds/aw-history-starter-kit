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
} from '@alien-worlds/aw-history';
import { MongoConfig, MongoSource } from '@alien-worlds/aw-storage-mongodb';
import {
  AbisFactory,
  FeaturedContractsFactory,
  ProcessortaskQueueCreator,
} from '../common';
import { AntelopeSerializer, ShipAbis, ShipAbisFactory } from '@alien-worlds/aw-antelope';

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
    this.abis = await AbisFactory.create(
      mongoSource,
      config.abis.service,
      contracts,
      false
    );
    this.featuredContracts = await FeaturedContractsFactory.create(
      mongoSource,
      config.featured,
      featuredCriteria
    );
    this.shipAbis = await ShipAbisFactory.create(mongoSource);
    this.serializer = new AntelopeSerializer();
  }
}
