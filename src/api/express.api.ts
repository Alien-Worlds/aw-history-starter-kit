import { Api, log } from '@alien-worlds/aw-history';
import express, { Express } from 'express';

export class ExpressApi extends Api<Express> {
  constructor() {
    super();
    this.app = express();
  }

  public async start() {
    const {
      config: { host, port },
    } = this;

    this.app.listen(port, () => {
      log(`Server is running at http://${host}:${port}`);
    });
  }
}
