#!/usr/bin/env node
import { CLIApplication } from './cli/index.js';
import 'reflect-metadata';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommandsDynamically();
}

bootstrap();
