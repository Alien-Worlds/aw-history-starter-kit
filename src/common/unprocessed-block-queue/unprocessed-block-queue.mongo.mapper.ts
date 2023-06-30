import { Block } from '@alien-worlds/block-reader';
import { MongoDB, MongoMapper } from '@alien-worlds/storage-mongodb';
import { BlockMongoModel } from './unprocessed-block-queue.mongo.types';
import { BlockNumberWithId } from '@alien-worlds/api-history-tools';

export class UnprocessedBlockMongoMapper extends MongoMapper<Block, BlockMongoModel> {
  public toEntity(model: BlockMongoModel): Block {
    const { block, traces, deltas, abi_version } = model;
    let head;
    let thisBlock;
    let prevBlock;
    let lastIrreversible;
    if (model.head) {
      head = BlockNumberWithId.fromJson({
        block_num: model.head.block_num.toString(),
        block_id: model.head.block_id,
      });
    }
    if (model.this_block) {
      thisBlock = BlockNumberWithId.fromJson({
        block_num: model.this_block.block_num.toString(),
        block_id: model.this_block.block_id,
      });
    }
    if (model.prev_block) {
      prevBlock = BlockNumberWithId.fromJson({
        block_num: model.prev_block.block_num.toString(),
        block_id: model.prev_block.block_id,
      });
    }
    if (model.last_irreversible) {
      lastIrreversible = BlockNumberWithId.fromJson({
        block_num: model.last_irreversible.block_num.toString(),
        block_id: model.last_irreversible.block_id,
      });
    }
    return new Block(
      head,
      lastIrreversible,
      prevBlock,
      thisBlock,
      block.buffer,
      traces.buffer,
      deltas.buffer,
      abi_version
    );
  }
  public fromEntity(entity: Block): BlockMongoModel {
    const {
      head,
      thisBlock,
      prevBlock,
      lastIrreversible,
      block,
      traces,
      deltas,
      id,
      abiVersion,
    } = entity;
    const document: BlockMongoModel = {
      head: {
        block_id: head.blockId,
        block_num: MongoDB.Long.fromBigInt(head.blockNumber),
      },
      this_block: {
        block_id: thisBlock.blockId,
        block_num: MongoDB.Long.fromBigInt(thisBlock.blockNumber),
      },
      prev_block: {
        block_id: prevBlock.blockId,
        block_num: MongoDB.Long.fromBigInt(prevBlock.blockNumber),
      },
      last_irreversible: {
        block_id: lastIrreversible.blockId,
        block_num: MongoDB.Long.fromBigInt(lastIrreversible.blockNumber),
      },
      block: new MongoDB.Binary(block),
      traces: new MongoDB.Binary(traces),
      deltas: new MongoDB.Binary(deltas),
    };
    if (abiVersion) {
      document.abi_version = abiVersion;
    }
    if (id) {
      document._id = new MongoDB.ObjectId(id);
    }
    return document;
  }
}
