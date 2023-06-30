import {
  MongoConfig,
  MongoQueryBuilders,
  MongoSource,
} from '@alien-worlds/storage-mongodb';
import { AbisMongoMapper } from './abis.mongo.mapper';
import {
  Abis,
  AbisRepositoryImpl,
  AbisServiceConfig,
  log,
} from '@alien-worlds/api-history-tools';
import { AbisMongoCollection } from './abis.mongo.collection';
import { AbiServiceImpl } from './abis.service-impl';

export class AbisCreator {
  public static async create(
    mongo: MongoSource | MongoConfig,
    config: AbisServiceConfig,
    contracts?: string[],
    setCache?: boolean
  ): Promise<Abis> {
    let mongoSource: MongoSource;

    log(` *  Abis ... [starting]`);

    if (mongo instanceof MongoSource) {
      mongoSource = mongo;
    } else {
      mongoSource = await MongoSource.create(mongo);
    }

    const abiService = config ? new AbiServiceImpl(config) : null;

    const mapper = new AbisMongoMapper();
    const repository = new AbisRepositoryImpl(
      new AbisMongoCollection(mongoSource),
      mapper,
      new MongoQueryBuilders(mapper)
    );
    const abis = new Abis(repository, abiService, contracts);

    if (setCache) {
      await abis.cacheAbis();
      log(` *  Abis cache restored`);
    }

    log(` *  Abis ... [ready]`);

    return abis;
  }
}
