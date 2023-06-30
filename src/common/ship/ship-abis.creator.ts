import {
  MongoCollectionSource,
  MongoConfig,
  MongoQueryBuilders,
  MongoSource,
} from '@alien-worlds/storage-mongodb';
import { ShipAbiRepositoryImpl, ShipAbis, log } from '@alien-worlds/api-history-tools';
import { ShipAbisMongoMapper } from './ship-abis.mongo.mapper';
import { ShipAbiMongoModel } from './ship-abis.mongo.types';

/**
 * @class
 */
export class ShipAbisCreator {
  public static async create(mongo: MongoSource | MongoConfig): Promise<ShipAbis> {
    let mongoSource: MongoSource;

    log(` *  SHIP ABis ... [starting]`);

    if (mongo instanceof MongoSource) {
      mongoSource = mongo;
    } else {
      mongoSource = await MongoSource.create(mongo);
    }
    const source = new MongoCollectionSource<ShipAbiMongoModel>(
      mongoSource,
      'history_tools.ship_abis'
    );
    const mapper = new ShipAbisMongoMapper();
    const repository = new ShipAbiRepositoryImpl(
      source,
      mapper,
      new MongoQueryBuilders()
    );
    const ship = new ShipAbis(repository);

    log(` *  SHIP ABis ... [ready]`);
    return ship;
  }
}
