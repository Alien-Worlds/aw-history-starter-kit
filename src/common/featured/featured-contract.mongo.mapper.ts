import { MongoDB, MongoMapper } from '@alien-worlds/aw-storage-mongodb';
import { FeaturedContractMongoModel } from './featured.mongo.types';
import { FeaturedContract, parseToBigInt } from '@alien-worlds/aw-history';

/**
 * Class representing a FeaturedContractMongoMapper
 * This class extends the MongoMapper to provide MongoDB-specific mappings for FeaturedContract.
 * @class
 * @extends {MongoMapper<FeaturedContract, FeaturedContractMongoModel>}
 * @public
 */
export class FeaturedContractMongoMapper extends MongoMapper<
  FeaturedContract,
  FeaturedContractMongoModel
> {
  /**
   * Creates a new instance of FeaturedContractMongoMapper and sets up the mapping from 'initialBlockNumber' and 'account' to MongoDB's 'initial_block_number' and 'account'.
   * @constructor
   */
  constructor() {
    super();
    this.mappingFromEntity.set('initialBlockNumber', {
      key: 'initial_block_number',
      mapper: (value: bigint) => MongoDB.Long.fromBigInt(value),
    });
    this.mappingFromEntity.set('account', {
      key: 'account',
      mapper: (value: string) => value,
    });
  }

  /**
   * Converts a MongoDB document of FeaturedContractMongoModel to a FeaturedContract entity.
   *
   * @param {FeaturedContractMongoModel} model - The MongoDB document.
   * @returns {FeaturedContract} The FeaturedContract entity.
   */
  public toEntity(model: FeaturedContractMongoModel): FeaturedContract {
    const { initial_block_number, _id, account } = model;

    return new FeaturedContract(
      _id ? _id.toString() : '',
      parseToBigInt(initial_block_number),
      account
    );
  }
}
