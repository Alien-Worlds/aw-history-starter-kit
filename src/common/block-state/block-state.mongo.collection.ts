import { MongoCollectionSource, MongoSource } from '@alien-worlds/storage-mongodb';
import { BlockStateMongoModel } from './block-state.mongo.types';
/**
 * Represents a collection of BlockStateDocument objects in a MongoDB database.
 * Extends the MongoCollectionSource class.
 *
 * @class
 * @extends {MongoCollectionSource<BlockStateMongoModel>}
 */
export class BlockStateCollection extends MongoCollectionSource<BlockStateMongoModel> {
  /**
   * Creates a new instance of the BlockStateCollection class.
   *
   * @constructor
   * @param {MongoSource} source - The MongoSource object used for database operations.
   */
  constructor(source: MongoSource) {
    super(source, 'history_tools.block_state');
  }
}
