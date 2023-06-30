/* eslint-disable @typescript-eslint/no-unused-vars */
import { BroadcastClient } from '@alien-worlds/broadcast';
import { AbisCreator } from '../common/abis';
import {
  MongoConfig,
  MongoSource,
  buildMongoConfig,
} from '@alien-worlds/storage-mongodb';
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
} from '@alien-worlds/api-history-tools';
import { FeaturedCreator } from '../common/featured';
import { BlockRangeScannerCreator } from '../common/block-range-scanner';
import { BlockStateCreator } from '../common/block-state';
import { BlockchainServiceCreator } from '../common';

export class DefaultBootstrapDependencies implements BootstrapDependencies {
  public broadcastClient: BroadcastClient;
  public abis: Abis;
  public scanner: BlockRangeScanner;
  public featured: Featured;
  public blockState: BlockState;
  public blockchain: BlockchainService;
  public featuredContracts: BlockchainService;
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
      this.featured = await FeaturedCreator.create(
        mongoSource,
        config.featured,
        featuredCriteria
      );
      this.abis = await AbisCreator.create(mongoSource, config.abis, contracts, true);
      this.scanner = await BlockRangeScannerCreator.create(mongoSource, config.scanner);
      this.blockState = await BlockStateCreator.create(mongoSource);
      this.blockchain = await BlockchainServiceCreator.create(config.blockchain);

      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
