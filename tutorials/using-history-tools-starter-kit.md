# Using History Tools Starter Kit

[Back to Readme](../README.md)

## Overview

The History Tools Starter Kit provides an efficient implementation of history tools, ready to use with `MongoDB` and `eosjs`. This tutorial will guide you through the process of setting up your environment and getting started with the kit.

## Step 1: Set Up MongoDB

Begin by setting up your MongoDB database. This can be done locally or using Docker. For this tutorial, we'll be using a local setup. Ensure that your database is exposed on localhost, using port like `27077`.

## Step 2: Create New TypeScript npm Project

Create a new TypeScript npm project. One of your dependencies should be the History Tools Starter Kit, which is `"@alien-worlds/history-tools-starter-kit"`. Your `package.json` should contain the following scripts:

```json
{
  "scripts": {
    "broadcast": "node build/broadcast/index.js",
    "boot": "node build/bootstrap/index.js",
    "reader": "node build/reader/index.js",
    "filter": "node build/filter/index.js",
    "processor": "node build/processor/index.js",
    "clean": "rm -rf ./build",
    "build": "yarn clean && tsc -b"
  },
  ...
  "dependencies": {
    "@alien-worlds/history-tools-starter-kit": "^0.0.1"
  }
}
```

## Step 3: Provide Configuration Variables

Next, provide the required configuration variables. This can be done either by setting environment variables or by creating a `.env` file. A description of all the required variables can be found [here](./config-vars.md).

```bash
# example of the basic .env
BLOCKCHAIN_ENDPOINT='http:// ...'
BLOCKCHAIN_CHAIN_ID=''
HYPERION_URL=''
SCANNER_SCAN_KEY='test'
BLOCK_READER_ENDPOINTS='ws:// ...'
API_PORT=8080
START_BLOCK=238580000
END_BLOCK=238581000
MODE='default'
BROADCAST_PORT=9000
BROADCAST_HOST='localhost'
MONGO_HOSTS='localhost'
MONGO_PORTS='27017'
MONGO_DB_NAME='your_history_tools'
```

## Step 4: Specify Contracts

You will need to provide a JSON file that specifies the contracts and any specific actions or deltas that you want to read from the blockchain. Here is an example:

```json
{
  "traces": [
    {
      "contract": ["dao.worlds"],
      "action": ["*"],
      "processor": "DaoWorldsTraceProcessor"
    }
  ],
  "deltas": [
    {
      "code": ["dao.worlds"],
      "scope": ["*"],
      "table": ["*"],
      "processor": "DaoWorldsDeltaProcessor"
    }
  ]
}
```

In the above example, `*` is a wildcard, meaning all available values in the field (like `action` or `scope`) will be included. If you want to specify certain labels, list them in these arrays. The `processor` field specifies the processor that should be executed when the history tools filter meets the requirements defined in the rest of the fields.

## Step 5: Create Folders for Each Process

Next, create a folder for each history tools process (`broadcast`, `bootstrap`, `filter`, `reader`, `processor`). Each of these should have an `index.ts` file within.

#### 5.1 Bootstraps

In the `bootstrap`

directory, create an `index.ts` file and add the following content:

```typescript
import { startBootstrap, DefaultBootstrapDependencies } from '@alien-worlds/history-tools-starter-kit';
import path from 'path';

startBootstrap(
  process.argv,
  new DefaultBootstrapDependencies(),
  path.join(__dirname, '../../your.featured.json')
);
```

#### 5.2 Broadcasting

In the `broadcast` directory, create an `index.ts` file and add the following content:

```typescript
import { startBroadcast } from '@alien-worlds/history-tools-starter-kit';

startBroadcast();
```

#### 5.3 Reader

In the `reader` directory, create an `index.ts` file and add the following content:

```typescript
import { startReader, DefaultReaderDependencies } from '@alien-worlds/history-tools-starter-kit';

startReader(process.argv, new DefaultReaderDependencies());
```

#### 5.4 Filter

In the `filter` directory, create an `index.ts` file and add the following content:

```typescript
import { startFilter, DefaultFilterDependencies } from '@alien-worlds/history-tools-starter-kit';
import path from 'path';

startFilter(
  process.argv,
  new DefaultFilterDependencies(),
  path.join(__dirname, '../../your.featured.json')
);
```

#### 5.5 Processor

In the `processor` directory, create an `index.ts` file and add the following content:

```typescript
import { startProcessor, DefaultProcessorDependencies } from '@alien-worlds/history-tools-starter-kit';
import path from 'path';

startProcessor(
  process.argv,
  new DefaultProcessorDependencies(),
  path.join(__dirname, './processors'),
  path.join(__dirname, '../../your.featured.json')
);
```


## Step 6: Create Processors Folder

Finally, create a `processors` folder where you will store all of the processor files. The contents of this folder should be exported in `index.ts`, and each processor should be exported default.

```typescript
// ./processors/index.ts
export * from './dao-worlds.trace-processor';
export * from './dao-worlds.delta-processor';
...

// ./processors/dao-worlds.trace-processor.ts
import { ActionTraceProcessor, ProcessorTaskModel } from '@alien-worlds/history-tools-starter-kit';

export class DaoWorldsTraceProcessor extends ActionTraceProcessor {
  public async run(model: ProcessorTaskModel): Promise<void> {
    try {
      //... all of your operations
      this.resolve();
    } catch (error) {
      this.reject(error);
    }
  }
}

// ./processors/dao-worlds.delta-processor.ts
import { DeltaProcessor, ProcessorTaskModel } from '@alien-worlds/history-tools-starter-kit';

export class DaoWorldsDeltaProcessor extends DeltaProcessor {
  public async run(model: ProcessorTaskModel): Promise<void> {
    try {
      //... all of your operations
      this.resolve();
    } catch (error) {
      this.reject(error);
    }
  }
}
```

And there you have it! This setup should get you started with the History Tools Starter Kit. If you have any issues or need further clarification, feel free to reach out for assistance.
