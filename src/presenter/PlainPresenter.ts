import { prompt } from 'enquirer'
import padRight from 'pad-right'
import wordwrap from 'wordwrap'
import { CommandModel, ConsoleDisplay, Display, DisplayLevel, HelpPresenter, LogPresenter, PresenterOption, VersionPresenter, PromptPresenter } from './types'
import { Enquirer } from './enquirer-types'

const INDENT = 2
const RIGHT_PADDING = 2
const MIN_LHS_WIDTH = 25
const wrap = wordwrap(80)


export class PlainPresenter implements LogPresenter, HelpPresenter, VersionPresenter, PromptPresenter {
  display: Display = new ConsoleDisplay()
  name: string
  inquire = prompt
  displayLevel: DisplayLevel = DisplayLevel.Normal
  constructor(options: PresenterOption = { name: '' }) {
    this.name = options.name
  }

  showVersion(version: string) {
    this.display.info(version)
  }

  showHelp(command: CommandModel) {
    const msg = generateHelpMessage(command)
    this.display.info(msg)
  }
  setDisplayLevel(displayLevel: DisplayLevel) {
    this.displayLevel = displayLevel
  }
  info(...args: any[]) {
    if (this.displayLevel >= DisplayLevel.Normal)
      this.display.info(...args)
  }
  warn(...args: any[]) {
    if (this.displayLevel >= DisplayLevel.Normal)
      this.display.warn(...args)
  }
  error(...args: any[]) {
    if (this.displayLevel >= DisplayLevel.Normal)
      this.display.error(...args)
  }
  debug(...args: any[]) {
    if (this.displayLevel >= DisplayLevel.Verbose)
      this.display.debug(...args)
  }
  prompt(questions: Enquirer.PromptOptions[]): Promise<Record<string, any>> {
    return this.inquire(questions)
  }
}

function generateHelpMessage(command: CommandModel) {
  const helpSections = [
    generateUsageSection(command),
    generateDescriptionSection(command),
    generateCommandsSection(command),
    generateArgumentsSection(command),
    generateOptionsSection(command),
    generateAliasSection(command),
  ].filter(m => !!m)
  return `
${helpSections.join('\n\n')}
`
}

function generateUsageSection(command: CommandModel) {
  const nameChain = getCommandNameChain(command)
  let message = `Usage: ${nameChain.join(' ')}${command.commands ? ' <command>' : ''}`
  if (command.arguments) message += ' [arguments]'
  if (command.options) message += ' [options]'
  return message
}

function generateDescriptionSection(command: CommandModel) {
  return command.description ? '  ' + command.description : ''
}

function getCommandNameChain(command: CommandModel) {
  const commands = [command]
  while (command.parent) {
    commands.unshift(command.parent)
    command = command.parent
  }
  return commands.map(c => c.name)
}

function generateCommandsSection(command: CommandModel) {
  const commandNames = getCommandsNamesAndAlias(command.commands)
  if (commandNames.length === 0)
    return ''

  return `Commands:
  ${wrap(commandNames.join(', '))}

${padRight(command.name + ' <command> -h', MIN_LHS_WIDTH, ' ')}Get help for <command>`
}

function getCommandsNamesAndAlias(commands: CommandModel[] | undefined) {
  const result: string[] = []
  if (commands) {
    commands.forEach(c => {
      if (c.alias) {
        result.push(`${c.name} (${c.alias.join('|')})`)
      }
      else result.push(c.name)
    })
  }
  return result
}

function generateArgumentsSection(command: CommandModel) {
  if (!command.arguments) {
    return ''
  }

  let message = 'Arguments:\n'
  const entries: string[][] = []
  let maxWidth = 0
  command.arguments.forEach(a => {
    const argStr = a.required ? `<${a.name}>` : `[${a.name}]`
    maxWidth = Math.max(maxWidth, argStr.length)
    entries.push([argStr, a.description || ''])
  })

  const alignedWidth = Math.max(MIN_LHS_WIDTH - INDENT, maxWidth + RIGHT_PADDING)

  if (entries.length > 0) {
    message += entries.map(e => `  ${padRight(e[0], alignedWidth, ' ')}${e[1]}`).join('\n')
  }
  return message
}

function generateOptionsSection(command: CommandModel) {
  if (!command.options) {
    return ''
  }
  let message = 'Options:\n'
  const entries: string[][] = []
  let maxOptionStrWidth = 0
  if (command.options.string) {
    for (const key in command.options.string) {
      const value = command.options.string[key]
      const optionStr = `${formatKeyValue(key, value)}=value`
      maxOptionStrWidth = Math.max(maxOptionStrWidth, optionStr.length)
      const description = value.default ? `${value.description} (default '${value.default}')` : value.description
      entries.push([optionStr, description])
    }
  }
  if (command.options.boolean) {
    for (const key in command.options.boolean) {
      const value = command.options.boolean[key]
      const optionStr = `${formatKeyValue(key, value)}`
      maxOptionStrWidth = Math.max(maxOptionStrWidth, optionStr.length)
      const description = value.default ? `${value.description} (default true)` : value.description
      entries.push([optionStr, description])
    }
  }

  const alignedWidth = Math.max(MIN_LHS_WIDTH - INDENT, maxOptionStrWidth + RIGHT_PADDING)

  if (entries.length > 0) {
    message += entries.map(e => `  ${padRight(e[0], alignedWidth, ' ')}${e[1]}`).join('\n')
  }
  return message
}

function formatKeyValue(key: string, value: any) {
  const values = value.alias ? [...value.alias, key].sort((a, b) => a.length - b.length) : [key]
  return `[${values.map(v => v.length === 1 ? '-' + v : '--' + v).join('|')}]`
}

function generateAliasSection(command: CommandModel) {
  if (!command.alias)
    return ''
  return `Alias:
  ${wrap(command.alias.join(', '))}`
}
