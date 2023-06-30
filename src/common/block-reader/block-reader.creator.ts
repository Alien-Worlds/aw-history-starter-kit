import {
  BlockReader,
  BlockReaderConfig,
  BlockReaderSource,
  ShipAbiRepositoryImpl,
  log,
} from '@alien-worlds/api-history-tools';
import {
  MongoCollectionSource,
  MongoConfig,
  MongoQueryBuilders,
  MongoSource,
} from '@alien-worlds/storage-mongodb';
import { ShipAbiMongoModel } from '../ship/ship-abis.mongo.types';
import { ShipAbisMongoMapper } from '../ship/ship-abis.mongo.mapper';
import { EosSerializer } from '@alien-worlds/eos';

export class BlockReaderCreator {
  public static async create(
    mongo: MongoSource | MongoConfig,
    config: BlockReaderConfig
  ) {
    log(` *  Block Reader ... [starting]`);
    let mongoSource: MongoSource;
    if (mongo instanceof MongoSource) {
      mongoSource = mongo;
    } else {
      mongoSource = await MongoSource.create(mongo);
    }

    const repository = new ShipAbiRepositoryImpl(
      new MongoCollectionSource<ShipAbiMongoModel>(
        mongoSource,
        'history_tools.ship_abis'
      ),
      new ShipAbisMongoMapper(),
      new MongoQueryBuilders()
    );
    const source = new BlockReaderSource(config);

    const reader = new BlockReader(source, repository, new EosSerializer());

    log(` *  Block Reader ... [ready]`);
    return reader;
  }
}
