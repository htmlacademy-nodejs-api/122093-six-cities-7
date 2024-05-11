import { readdir } from 'node:fs/promises';
import { CommandParser } from './command-parser.js';
import { Command } from './commands/command.interface.js';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) {}

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public async registerCommandsDynamically(): Promise<void> {
    interface CommandModule {
      [key: string]: new () => Command;
    }
    const currentModulePath = fileURLToPath(import.meta.url);
    const currentModuleDirectory = dirname(currentModulePath);
    const directory = join(currentModuleDirectory, 'commands');

    try {
      const files = await readdir(directory);
      const commandFiles = files.filter((file) => file.endsWith(`command${extname(file)}`));
      for (const file of commandFiles) {
        const filePath = join(directory, file);
        const className = `${basename(file, `.command${extname(file)}`)
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join('')}Command`;
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const commandModule: CommandModule = await import(pathToFileURL(filePath).href);
        const CommandClass = commandModule[className];
        const instance = new CommandClass();
        this.commands[instance.getName()] = instance;
      }
    } catch (error) {
      console.error(`Error reading or importing files from directory: ${directory}`, error);
    }
    this.processCommand(process.argv);
  }

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): Command | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(`The default command (${this.defaultCommand}) is not registered.`);
    }
    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
