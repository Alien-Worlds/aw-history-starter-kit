import { MongoDB, MongoMapper } from '@alien-worlds/aw-storage-mongodb';
import { ContractEncodedAbiMongoModel } from './abis.mongo.types';
import { ContractEncodedAbi, parseToBigInt } from '@alien-worlds/aw-history';

export class AbisMongoMapper extends MongoMapper<
  ContractEncodedAbi,
  ContractEncodedAbiMongoModel
> {
  constructor() {
    super();
    this.mappingFromEntity.set('blockNumber', {
      key: 'block_number',
      mapper: (value: bigint) => MongoDB.Long.fromBigInt(value),
    });
    this.mappingFromEntity.set('contract', {
      key: 'contract',
      mapper: value => value,
    });
    this.mappingFromEntity.set('hex', {
      key: 'hex',
      mapper: value => value,
    });
  }

  public toEntity(model: ContractEncodedAbiMongoModel): ContractEncodedAbi {
    const { hex, contract, block_number } = model;

    return new ContractEncodedAbi(parseToBigInt(block_number), contract, hex);
  }
}
