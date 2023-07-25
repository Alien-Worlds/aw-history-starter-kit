import {
  ApiConfig,
  ApiDependencies,
  Container,
  DatabaseConfigBuilder,
  Failure,
  Result,
  Route,
} from '@alien-worlds/api-history-tools';
import { buildMongoConfig } from '@alien-worlds/storage-mongodb';
import { ExpressApi } from './express.api';

export class DefaultApiDependencies implements ApiDependencies {
  public databaseConfigBuilder: DatabaseConfigBuilder = buildMongoConfig;
  public setupIoc: (config: ApiConfig, container: Container) => Promise<void>;
  public routesProvider: (container: Container) => Route[];
  public api: ExpressApi;
  public ioc: Container;

  public async initialize(
    setupIoc: (config: ApiConfig, container: Container) => Promise<void>,
    routesProvider: (container: Container) => Route[]
  ): Promise<Result> {
    try {
      this.api = new ExpressApi();
      this.ioc = new Container();
      this.setupIoc = setupIoc;
      this.routesProvider = routesProvider;

      return Result.withoutContent();
    } catch (error) {
      return Result.withFailure(Failure.fromError(error));
    }
  }
}
