import { EosBlockchainServiceImpl, EosRpcSourceImpl } from '@alien-worlds/eos';
import { BlockchainConfig, BlockchainService } from '@alien-worlds/api-history-tools';

export class BlockchainServiceCreator {
  public static create(config: BlockchainConfig): BlockchainService {
    return new EosBlockchainServiceImpl(new EosRpcSourceImpl(config.endpoint));
  }
}
