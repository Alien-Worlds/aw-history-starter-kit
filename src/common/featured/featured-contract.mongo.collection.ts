import { MongoCollectionSource, MongoSource } from '@alien-worlds/storage-mongodb';
import { FeaturedContractMongoModel } from './featured.mongo.types';

/**
 * Represents a source for FeaturedContract documents stored in a MongoDB collection.
 * Extends the MongoCollectionSource class.
 *
 * @class
 * @extends {MongoCollectionSource<FeaturedContractMongoModel>}
 */
export class FeaturedContractMongoCollection extends MongoCollectionSource<FeaturedContractMongoModel> {
  /**
   * Creates a new instance of the FeaturedContractSource class.
   *
   * @constructor
   * @param {MongoSource} mongoSource - The MongoSource object used for database operations.
   */
  constructor(mongoSource: MongoSource) {
    super(mongoSource, 'history_tools.featured_contracts', {
      indexes: [
        { key: { account: 1 }, background: true },
        { key: { initial_block_number: 1, account: 1 }, unique: true, background: true },
      ],
    });
  }
}
