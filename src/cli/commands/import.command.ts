import chalk from 'chalk';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filePath] = parameters;
    const fileReader = new TSVFileReader(filePath.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.bold.red(`Can't import data from file: ${filePath}`));
      console.error(chalk.bold.red(`Details: ${err.message}`));
    }
  }
}
