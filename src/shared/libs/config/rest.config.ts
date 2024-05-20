import { config } from 'dotenv';
import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';
import { RestScheme, configRestScheme } from './rest.scheme.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';

@injectable()
export class RestConfig implements Config<RestScheme> {
  private readonly config: RestScheme;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configRestScheme.load({});
    configRestScheme.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestScheme.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestScheme>(key: T): RestScheme[T] {
    return this.config[key];
  }
}
