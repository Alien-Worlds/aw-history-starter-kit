import express, { Express } from 'express';

import { Api, log } from '@alien-worlds/api-history-tools';
export class ExpressApi extends Api<Express> {
  constructor() {
    super();
    this.app = express();
  }

  public async start() {
    const {
      config: { port },
    } = this;
    this.app.listen(port, () => {
      log(`Server is running at http://localhost:${port}`);
    });
  }
}
