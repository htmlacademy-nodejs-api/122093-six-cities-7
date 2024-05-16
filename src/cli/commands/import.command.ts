import chalk from 'chalk';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';
import { Offer } from '../../shared/types/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  private onImportedOffer(offer: Offer): void {
    console.info(offer);
  }

  private onCompleteImport(count: number): void {
    console.info(`${count} rows imported`);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filePath] = parameters;
    const fileReader = new TSVFileReader(filePath.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {
      console.error(chalk.bold.red(`Can't import data from file: ${filePath}`));
      console.error(chalk.bold.red(`Details: ${getErrorMessage(error)}`));
    }
  }
}
