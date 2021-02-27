import { config, createMemoryLogReporter, getLogger, logLevels } from 'standard-log'
import * as z from 'zod'
import { command } from './command'
import { getLogMessage } from './test-utils'
import { ui } from './ui'

describe('showHelp()', () => {
  test('options with single string alias', () => {
    const { ui, reporter } = testUI()
    ui.showHelp('cli', command({
      name: 'cmd',
      options: {
        long: { description: 'description', alias: ['l'] }
      },
      run() { }
    }))
    expect(getLogMessage(reporter)).toEqual(`
Usage: cli cmd [options]

Options:
  [-l|--long]            description
`)
  })
  test('options with hidden alias', () => {
    const { ui, reporter } = testUI()
    ui.showHelp('cli', command({
      name: 'cmd',
      options: {
        long: {
          type: z.optional(z.string()),
          description: 'description',
          alias: [{ alias: 'l', hidden: true }]
        }
      },
      run() { }
    }))
    expect(getLogMessage(reporter)).toEqual(`
Usage: cli cmd [options]

Options:
  [--long]               description
`)
  })
  test('with sub-commands', () => {
    const { ui, reporter } = testUI()
    ui.showHelp('cli', command({
      name: 'cmd',
      commands: [command({
        name: 'sub',
        run() { }
      })]
    }))
    expect(getLogMessage(reporter)).toEqual(`
Usage: cli cmd <command>

Commands:
  sub

cmd <command> -h         Get help for <command>
`)
  })
})

function testUI() {
  const reporter = createMemoryLogReporter({ id: 'mock-reporter' })
  config({
    logLevel: logLevels.all,
    reporters: [reporter],
    mode: 'test'
  })
  const log = getLogger('mock-ui', { level: logLevels.all, writeTo: 'mock-reporter' })
  return { ui: ui(log), reporter }
}

