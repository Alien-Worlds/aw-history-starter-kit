/* eslint-disable @typescript-eslint/no-unused-vars */
import { MongoDB, MongoMapper } from '@alien-worlds/aw-storage-mongodb';
import { ProcessorTaskMongoModel } from './processor-task.mongo.types';
import { ProcessorTask, PropertyMapping, parseToBigInt, removeUndefinedProperties } from '@alien-worlds/aw-history';

export class ProcessorTaskMongoMapper<
  EntityType = ProcessorTask,
  ModelType = ProcessorTaskMongoModel
> extends MongoMapper<ProcessorTask, ProcessorTaskMongoModel> {
  public getEntityKeyMapping(key: string): PropertyMapping {
    throw new Error('Method not implemented.');
  }

  public fromEntity(entity: ProcessorTask): ProcessorTaskMongoModel {
    const {
      id,
      abi,
      shortId,
      label,
      timestamp,
      type,
      mode,
      content,
      hash,
      blockNumber,
      isFork,
      blockTimestamp,
      error,
    } = entity;

    const document: ProcessorTaskMongoModel = {
      abi,
      short_id: shortId,
      label,
      timestamp,
      type,
      mode,
      content: new MongoDB.Binary(content),
      hash,
      block_number: MongoDB.Long.fromBigInt(blockNumber),
      block_timestamp: blockTimestamp,
      is_fork: isFork,
      error,
    };

    if (id) {
      document._id = new MongoDB.ObjectId(id);
    }

    return removeUndefinedProperties<ProcessorTaskMongoModel>(document);
  }

  public toEntity(model: ProcessorTaskMongoModel): ProcessorTask {
    const {
      abi,
      short_id,
      label,
      content,
      timestamp,
      hash,
      type,
      mode,
      _id,
      block_number,
      block_timestamp,
      error,
      is_fork,
    } = model;

    return new ProcessorTask(
      _id ? _id.toString() : '',
      abi,
      short_id,
      label,
      timestamp,
      type,
      mode,
      content.buffer,
      hash,
      parseToBigInt(block_number),
      block_timestamp,
      is_fork,
      error
    );
  }
}
