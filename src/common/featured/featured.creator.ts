import {
  MongoConfig,
  MongoQueryBuilders,
  MongoSource,
} from '@alien-worlds/storage-mongodb';
import { FeaturedContractMongoCollection } from './featured-contract.mongo.collection';
import { FeaturedContractMongoMapper } from './featured-contract.mongo.mapper';
import {
  Featured,
  FeaturedConfig,
  FeaturedContractDataCriteria,
  RepositoryImpl,
  log,
} from '@alien-worlds/api-history-tools';
import { EosRpcSourceImpl, EosSmartContractServiceImpl } from '@alien-worlds/eos';

export class FeaturedCreator {
  public static async create(
    mongo: MongoSource | MongoConfig,
    config: FeaturedConfig,
    featuredCriteria: FeaturedContractDataCriteria
  ): Promise<Featured> {
    let mongoSource: MongoSource;

    log(` *  Featured ... [starting]`);

    if (mongo instanceof MongoSource) {
      mongoSource = mongo;
    } else {
      mongoSource = await MongoSource.create(mongo);
    }
    const repository = new RepositoryImpl(
      new FeaturedContractMongoCollection(mongoSource),
      new FeaturedContractMongoMapper(),
      new MongoQueryBuilders()
    );
    const smartContractService = new EosSmartContractServiceImpl(
      new EosRpcSourceImpl(config.rpcUrl),
      config.serviceUrl,
      ''
    );

    const featured = new Featured(repository, smartContractService, featuredCriteria);

    log(` *  Featured ... [ready]`);

    return featured;
  }
}
