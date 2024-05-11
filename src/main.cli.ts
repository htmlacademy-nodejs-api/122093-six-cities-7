#!/usr/bin/env node
import { CLIApplication } from './cli/index.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommandsDynamically();
}

bootstrap();
