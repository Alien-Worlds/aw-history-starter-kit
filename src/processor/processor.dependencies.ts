/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BroadcastClient,
  BroadcastTcpClient,
  ContractDeltaMatchCriteria,
  ContractTraceMatchCriteria,
  DatabaseConfigBuilder,
  Failure,
  Featured,
  FeaturedUtils,
  MissingCriteriaError,
  ProcessorAddons,
  ProcessorConfig,
  ProcessorDependencies,
  ProcessorTaskQueue,
  Result,
} from '@alien-worlds/api-history-tools';
import {
  MongoConfig,
  MongoSource,
  buildMongoConfig,
} from '@alien-worlds/storage-mongodb';
import { ProcessortaskQueueCreator } from '../common';
import path from 'path';

export class DefaultProcessorDependencies implements ProcessorDependencies {
  public broadcastClient: BroadcastClient;
  public featuredTraces: Featured<ContractTraceMatchCriteria>;
  public featuredDeltas: Featured<ContractDeltaMatchCriteria>;
  public processorTaskQueue: ProcessorTaskQueue;
  public processorsPath: string;
  public databaseConfigBuilder: DatabaseConfigBuilder = buildMongoConfig;

  public readonly workerLoaderDependenciesPath = path.join(
    __dirname,
    './processor.worker-loader.dependencies'
  );

  public async initialize(
    config: ProcessorConfig<MongoConfig>,
    featuredCriteriaPath: string,
    processorsPath: string,
    addons?: ProcessorAddons
  ): Promise<Result> {
    try {
      const featuredCriteria = await FeaturedUtils.fetchCriteria(featuredCriteriaPath);

      if (!featuredCriteria) {
        throw new MissingCriteriaError(featuredCriteriaPath);
      }

      const mongoSource = await MongoSource.create(config.database);
      this.processorsPath = processorsPath;
      this.broadcastClient = new BroadcastTcpClient(config.broadcast, 'processor');
      this.processorTaskQueue = await ProcessortaskQueueCreator.create(
        mongoSource,
        config.queue
      );

      this.featuredTraces = new Featured(
        featuredCriteria.traces,
        {
          shipTraceMessageName: [],
          shipActionTraceMessageName: [],
          contract: [],
          action: [],
        },
        {
          shipTraceMessageName: ['transaction_trace_v0'],
          shipActionTraceMessageName: ['action_trace_v0', 'action_trace_v1'],
        }
      );
      this.featuredDeltas = new Featured(
        featuredCriteria.deltas,
        {
          shipDeltaMessageName: [],
          name: [],
          code: [],
          scope: [],
          table: [],
        },
        { shipDeltaMessageName: ['table_delta_v0'] }
      );

      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
