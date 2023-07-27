/* eslint-disable @typescript-eslint/no-unused-vars */
import { BroadcastClient } from '@alien-worlds/aw-broadcast';
import { AbisFactory } from '../common/abis';
import {
  MongoConfig,
  MongoSource,
  buildMongoConfig,
} from '@alien-worlds/aw-storage-mongodb';
import {
  BootstrapDependencies,
  Abis,
  BlockRangeScanner,
  Featured,
  BlockState,
  BlockchainService,
  DatabaseConfigBuilder,
  BootstrapConfig,
  FeaturedContractDataCriteria,
  Result,
  FeaturedUtils,
  BroadcastTcpClient,
  Failure,
  FeaturedContracts,
} from '@alien-worlds/aw-history';
import { FeaturedContractsFactory } from '../common/featured';
import { BlockRangeScannerFactory } from '../common/block-range-scanner';
import { BlockStateFactory } from '../common/block-state';
import { AntelopeBlockchainServiceFactory } from '@alien-worlds/aw-antelope';

export class DefaultBootstrapDependencies implements BootstrapDependencies {
  public broadcastClient: BroadcastClient;
  public abis: Abis;
  public scanner: BlockRangeScanner;
  public featuredContracts: FeaturedContracts;
  public blockState: BlockState;
  public blockchain: BlockchainService;
  public databaseConfigBuilder: DatabaseConfigBuilder = buildMongoConfig;

  public async initialize(
    config: BootstrapConfig<MongoConfig>,
    featuredCriteria: FeaturedContractDataCriteria
  ): Promise<Result<void>> {
    try {
      const mongoSource = await MongoSource.create(config.database);
      const contracts = FeaturedUtils.readFeaturedContracts(featuredCriteria);

      this.broadcastClient = this.broadcastClient = new BroadcastTcpClient(
        config.broadcast,
        'bootstrap'
      );
      this.featuredContracts = await FeaturedContractsFactory.create(
        mongoSource,
        config.featured,
        featuredCriteria
      );
      this.abis = await AbisFactory.create(mongoSource, config.abis, contracts, true);
      this.scanner = await BlockRangeScannerFactory.create(mongoSource, config.scanner);
      this.blockState = await BlockStateFactory.create(mongoSource);
      this.blockchain = await AntelopeBlockchainServiceFactory.create(config.blockchain);

      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
