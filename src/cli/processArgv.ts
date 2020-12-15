import yargs from 'yargs-parser'
import type { cli } from './cli'

export function processArgv(commands: cli.Command[], argv: string[]) {
  const yargsOptions = toYargsOption(commands)
  const args = yargs(argv, yargsOptions)
  args._.shift()

  const command = findMatchingCommand(commands, { ...args, _: ['', ...args._.slice(1)] })
  return { command, args }
}

function toYargsOption(commands: cli.Command[]) {
  return commands.reduce(
    (options, cmd) => addOptions(options, cmd.options),
    { alias: {}, default: {} } as Record<string, any>)
}

function addOptions(options: Record<string, any>, cmdOptions: cli.Command.Options | undefined) {
  fillOptions(options, cmdOptions, 'boolean')
  fillOptions(options, cmdOptions, 'string')
  fillOptions(options, cmdOptions, 'number')
  return options
}

function fillOptions(result: Record<string, any>, options: cli.Command.Options | undefined, typeName: keyof cli.Command.Options) {
  if (options?.[typeName]) {
    const values = options[typeName]!
    result[typeName] = Object.keys(values)
    result[typeName].forEach((k: string) => {
      const v = values[k]
      if (v.alias) {
        result.alias[k] = v.alias
      }
      if (v.default) {
        result.default[k] = v.default
      }
    })
  }
}

function findMatchingCommand(commands: cli.Command[], args: yargs.Arguments) {
  // sort the commands so that the named commands come first
  commands = commands.sort((a, b) => a.name > b.name ? 1 : 0)
  const command = commands.find(cmd => cmd.name === args._[0] || cmd.name === '')!

  // todo: drill down to sub-commands


  return command
}
