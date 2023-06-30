import { BlockStateModel } from '@alien-worlds/api-history-tools';
import { BlockStateMongoModel } from './block-state.mongo.types';
import { MongoDB, MongoMapper } from '@alien-worlds/storage-mongodb';

export class BlockStateMongoMapper extends MongoMapper<
  BlockStateModel,
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
}
