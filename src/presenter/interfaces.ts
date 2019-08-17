import { CliCommand } from '../cli-command';

export interface Display {
  debug(...args: any[]): void,
  info(...args: any[]): void,
  warn(...args: any[]): void,
  error(...args: any[]): void,
}

export enum DisplayLevel {
  Silent = 0,
  Normal = 30,
  Verbose = 40
}

// istanbul ignore next
export class ConsoleDisplay implements Display {
  debug(...args: any[]): void {
    console.log(...args)
  }
  info(...args: any[]): void {
    console.info(...args)
  }
  warn(...args: any[]): void {
    console.warn(...args)
  }
  error(...args: any[]): void {
    console.error(...args)
  }
}

export interface PresenterFactory {
  createCliPresenter(options: PresenterOption): LogPresenter & HelpPresenter & VersionPresenter,
  createCommandPresenter(options: PresenterOption): LogPresenter & HelpPresenter & Inquirer,
}
import inquirer = require('inquirer')

export interface CommandModel {
  name: string,
  description?: string,
  commands?: CommandModel[],
  arguments?: CliCommand.Argument[],
  alias?: string[],
  options?: CliCommand.Options,
  parent?: { name: string },
}

export interface LogPresenter {
  displayLevel: DisplayLevel,
  /**
   * Set display level.
   * @deprecated use displayLevel directly
   */
  setDisplayLevel(displayLevel: DisplayLevel): void,
  info(...args: any[]): void,
  warn(...args: any[]): void,
  error(...args: any[]): void,
  debug(...args: any[]): void,
}

export interface HelpPresenter {
  showHelp(command: CommandModel): void,
}
export interface VersionPresenter {
  showVersion(version: string): void,
}

export interface PresenterOption {
  name: string,
}

export interface Inquirer {
  prompt(questions: inquirer.Question[]): Promise<inquirer.Answers>,
}
