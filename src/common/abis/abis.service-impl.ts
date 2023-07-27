import { AbiServiceConfig } from '@alien-worlds/aw-antelope';
import { AbiService, ContractEncodedAbi, log, fetch } from '@alien-worlds/aw-history';

export class AbiServiceImpl implements AbiService {
  constructor(private config: AbiServiceConfig) {}
  public async fetchAbis(contract: string): Promise<ContractEncodedAbi[]> {
    try {
      const list: ContractEncodedAbi[] = [];
      const { url, limit, filter } = this.config;

      const res = await fetch(
        `${url}/v2/history/get_actions?account=${contract}&filter=${
          filter || 'eosio:setabi'
        }&limit=${limit || 100}&sort=-1`
      );
      const json = await res.json();
      for (let i = 0; i < json.actions.length; i++) {
        const act = json.actions[i];
        list.push(
          ContractEncodedAbi.create(act.block_num, contract, String(act.act.data.abi))
        );
      }
      return list;
    } catch (error) {
      log(error);
      return [];
    }
  }
}
