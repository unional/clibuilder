import { CliCommand } from '../cli-command'

export const echoCommand: CliCommand = {
  name: 'echo',
  arguments: [{
    name: 'args',
    description: 'any argument(s)',
    multiple: true
  }],
  description: 'Echoing input arguments',
  run(_args, argv) {
    this.ui.info(...argv)
  }
}
