import {
  ApiConfig,
  ApiDependencies,
  DatabaseConfigBuilder,
  Failure,
  Result,
} from '@alien-worlds/api-history-tools';
import { MongoConfig, buildMongoConfig } from '@alien-worlds/storage-mongodb';
import { ExpressApi } from './express.api';

export class DefaultApiDependencies implements ApiDependencies {
  public databaseConfigBuilder: DatabaseConfigBuilder = buildMongoConfig;
  public api: ExpressApi;

  public async initialize(config: ApiConfig<MongoConfig>): Promise<Result> {
    try {
      this.api = new ExpressApi();
      this.api.setup(config);

      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
