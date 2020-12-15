import type { cli } from './cli'

export function getBottomCommand({ description }: Pick<cli.Builder<any>, 'description'>) {
  return {
    name: '',
    description,
    options: {
      boolean: {
        'help': {
          description: 'Print help message',
          alias: ['h'],
        },
        'version': {
          description: 'Print the CLI version',
          alias: ['v'],
        },
        'verbose': {
          description: 'Turn on verbose logging',
          alias: ['V'],
        },
        'silent': {
          description: 'Turn off logging',
        },
        'debug-cli': {
          description: 'Display clibuilder debug messages',
        },
      }
    },
    run() {
      this.ui.showHelp()
    }
  } as cli.Command
}
