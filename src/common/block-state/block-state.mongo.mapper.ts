import { BlockStateEntity, parseToBigInt } from '@alien-worlds/aw-history';
import { BlockStateMongoModel } from './block-state.mongo.types';
import { MongoDB, MongoMapper } from '@alien-worlds/aw-storage-mongodb';

export class BlockStateMongoMapper extends MongoMapper<
  BlockStateEntity,
  BlockStateMongoModel
> {
  constructor() {
    super();
    this.mappingFromEntity.set('lastModifiedTimestamp', {
      key: 'last_modified_timestamp',
      mapper: value => value,
    });
    this.mappingFromEntity.set('blockNumber', {
      key: 'block_number',
      mapper: (value: bigint) => MongoDB.Long.fromBigInt(value),
    });
    this.mappingFromEntity.set('actions', {
      key: 'actions',
      mapper: value => value,
    });
    this.mappingFromEntity.set('tables', {
      key: 'tables',
      mapper: value => value,
    });
  }

  public toEntity(model: BlockStateMongoModel): BlockStateEntity {
    const { block_number, actions, tables, last_modified_timestamp } = model;

    return {
      lastModifiedTimestamp: last_modified_timestamp,
      blockNumber: parseToBigInt(block_number),
      actions,
      tables,
    };
  }
}
