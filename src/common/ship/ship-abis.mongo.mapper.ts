import { Mapper, PropertyMapping, ShipAbi } from '@alien-worlds/api-history-tools';
import { ShipAbiMongoModel } from './ship-abis.mongo.types';

export class ShipAbisMongoMapper implements Mapper<ShipAbi, ShipAbiMongoModel> {
  public toEntity(model: ShipAbiMongoModel): ShipAbi {
    const { abi, version, last_modified_timestamp } = model;
    return new ShipAbi(abi, version, last_modified_timestamp);
  }

  public fromEntity(entity: ShipAbi): ShipAbiMongoModel {
    const { abi, version, lastModifiedTimestamp } = entity;

    return {
      abi,
      version,
      last_modified_timestamp: lastModifiedTimestamp,
    };
  }

  getEntityKeyMapping(key: string): PropertyMapping {
    throw new Error('Method not implemented.');
  }
}
