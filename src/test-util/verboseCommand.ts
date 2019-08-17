import { CliCommand } from '../cli-command'

export const verboseCommand: CliCommand = {
  name: 'verbose',
  alias: ['vb', 'detail'],
  options: {
    boolean: {
      verbose: {
        description: 'print verbose messages',
      },
    },
  },
  run() {
    this.ui.debug('print verbosely')
  },
}
