# History Tools Starter Kit

The History Tools Starter Kit is a robust package that implements the components of History Tools with dependencies such as MongoDB and eosjs. This inclusive package contains file dependencies for each process, namely: bootstrap, reader, filter, and processor.

Additionally, it encompasses data layer implementations for common components such as Abis, BlockRangeScanner, BlockState, Ship etc., which are integral to the mentioned above
 processes. The History Tools package contains the logic and domain layer implementation, while this Starter Kit presents the data layer implementation.

Essentially, the History Tools Starter Kit equips you with a ready-to-use framework for leveraging the power of History Tools. While History Tools can be employed with other dependencies, this Starter Kit offers a seamless experience for those seeking to utilize `MongoDB` and `eosjs`. Therefore, if your project necessitates these dependencies, this Starter Kit is your ideal starting point.


## Dependencies

This package is dependent on the following packages:

- [@alien-worlds/aw-history](https://github.com/Alien-Worlds/api-history-tools)
- [@alien-worlds/aw-antelope](https://github.com/Alien-Worlds/eos)
- [@alien-worlds/aw-storage-mongodb](https://github.com/Alien-Worlds/storage-mongodb)

## Table of Contents

- [Installation](#installation)
- [Common Components](#common-components)
- [Processes](#processes)
- [Tutorials](#tutorials)
- [Contributing](#contributing)
- [License](#license)

## Installation

To add History Tools to your project, use the following command with your favorite package manager:

```bash
yarn add @alien-worlds/history-tools-starter-kit
```

## Common Components

In the Common folder you will find all data layer implementations related to MongoDB collections or eosjs tools. This includes mappers for transforming documents to entities and vice versa, service implementations, and various types. These resources are conveniently available for direct use when creating the components for your project.

To further enhance ease-of-use, this package provides `creators` that take the heavy lifting out of creating an instance of each component. The `creators` automate the construction process, resulting in an efficient and streamlined development experience. The specific list of available `creators` :
- `AbisCreator`
- `BlockRangeScanner`
- `BlockReaderCreator`
- `BlockStateCreator`
- `BlockchainServiceCreator`
- `FeaturedContractsCreator`
- `ProcessortaskQueueCreator`
- `ShipAbisCreator`
- `UnprocessedBlockQueueCreator`


The use of these creators is very simple, just call the static create method and provide the expected arguments

```typescript
// An example of creating an instance of the UnprocessedBlockQueue using a dedicated creator
const unprocessedBlockQueue = await UnprocessedBlockQueueCreator.create(
  mongoSource,
  { ...config }
);
```

_More information about individual components can be found in this repository [@alien-worlds/aw-history](https://github.com/Alien-Worlds/api-history-tools)._

## Processes

The remaining folders name correspond to the history tools processes and contain the necessary dependencies files. These files contain Dependencies classes that are initialized within the process or worker loader of the process.

1. **Bootstrap:** Requires `DefaultBootstrapDependencies` passed to the bootstrap command. Dependencies:

   - _`BroadcastClient`_
   - _`Abis`_
   - _`BlockRangeScanner`_
   - _`FeaturedContracts`_
   - _`BlockState`_
   - _`BlockchainService`_

2. **Reader:** Requires `DefaultReaderDependencies` passed to the reader command. Dependencies:

   - _`BroadcastClient`_
   - _`BlockRangeScanner`_

   The second file is `ReaderWorkerLoaderDependencies` which is instantiated in the worker loader and the path to this file is given in `DefaultReaderDependencies`. Dependencies:

   - _`BlockRangeScanner`_
   - _`BlockReader`_
   - _`BlockState`_
   - _`UnprocessedBlockQueue`_

3. **Filter:** Requires `DefaultFilterDependencies` passed to the filter command. Dependencies:

   - _`BroadcastClient`_
   - _`UnprocessedBlockQueue`_

   The second file is `FilterWorkerLoaderDependencies` which is instantiated in the worker loader and the path to this file is given in `DefaultFilterDependencies`. Dependencies:

   - _`ProcessorTaskQueue`_
   - _`Abis`_
   - _`ShipAbis`_
   - _`FeaturedContracts`_
   - _`AntelopeSerializer`_

4. **Processor:** Requires `DefaultProcessorDependencies` passed to the processor command. Dependencies:

   - _`BroadcastClient`_
   - _`ProcessorTaskQueue`_
   - _`Featured<ContractTraceMatchCriteria>`_
   - _`Featured<ContractDeltaMatchCriteria>`_

   The second file is `ProcessorWorkerLoaderDependencies` which is instantiated in the worker loader and the path to this file is given in `DefaultProcessorDependencies`. Dependencies:

   - _`MongoSource`_
   - _`AntelopeSerializer`_


## Tutorials

- [Using History Tools Starter Kit](./tutorials/using-history-tools-starter-kit.md)

## Contributing

We welcome contributions from the community. Before contributing, please read through the existing issues on this repository to prevent duplicate submissions. New feature requests and bug reports can be submitted as an issue. If you would like to contribute code, please open a pull request.

## License

This project is licensed under the terms of the MIT license. For more information, refer to the [LICENSE](./LICENSE) file.
