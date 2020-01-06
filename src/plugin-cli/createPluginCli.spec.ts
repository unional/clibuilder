import { createPluginCli, PluginCli2 } from '.'
import { createCliArgv, InMemoryPresenter, generateDisplayedMessage } from '../test-util'
import { PartialPick, JSONTypes, assertType } from 'type-plus'
import { Cli2 } from '../cli/types'

test('use "{name}-plugin" as keyword to look for plugins', async () => {
  const [cli] = createPluginCliTest({
    name: 'clibuilder',
    version: '1.0.0',
    context: { cwd: 'fixtures/one-plugin' },
  })
  const actual = await cli.parse(createCliArgv('cli', 'one', 'echo', 'bird'))
  expect(actual).toEqual('bird')
})

test('use custom keyword to look for plugins', async () => {
  const [cli] = createPluginCliTest({
    name: 'clibuilder',
    version: '1.0.0',
    keyword: 'x-file',
    context: { cwd: 'fixtures/alt-keyword-plugin' },
  })
  const actual = await cli.parse(createCliArgv('cli', 'x', 'echo'))
  expect(actual).toEqual('echo invoked')
})

test('pluginCli can specify its own commands', async () => {
  const [cli, argv] = createPluginCliTest({
    name: 'defaultCommands',
    version: '1.0.0',
    commands: [{
      name: 'local', description: '',
      run() { return this.name }
    }],
  }, 'local')

  const actual = await cli.parse(argv)
  expect(actual).toBe('local')
})

test('can define default config', async () => {
  const [cli, argv] = createPluginCliTest({
    name: 'defaultCommands',
    version: '1.0.0',
    config: { a: 1 },
    commands: [{
      name: 'get-config-a',
      description: '',
      run() {
        assertType.isNumber(this.config.a)
        return this.config.a
      }
    }],
  }, 'get-config-a')

  const actual = await cli.parse(argv)

  expect(actual).toBe(1)
})

test('is runnable with ui', async () => {
  const [cli, argv, ui] = createPluginCliTest({
    name: 'cli',
    version: '1.0.0',
    run() {
      this.ui.info('hello world')
    }
  })
  await cli.parse(argv)

  const message = generateDisplayedMessage(ui.display.infoLogs)
  expect(message).toBe('hello world')
})

function createPluginCliTest<
  Config extends Record<string, JSONTypes> | undefined,
  Context extends Partial<Cli2.BuildInContext> & Record<string | symbol, any>,
  N1 extends string,
  N2 extends string,
  N3 extends string,
  N4 extends string
>(
  options: PartialPick<PluginCli2.ConstructOptions<Config, Context, N1, N2, N3, N4>, 'name' | 'version'>,
  ...args: string[]
) {
  const ui = new InMemoryPresenter()
  const mergedOptions = {
    name: 'cli',
    version: '1.0.0',
    ...options,
    context: { ui, ...options.context } as Context & { ui: InMemoryPresenter },
  }
  return [createPluginCli(mergedOptions), createCliArgv(mergedOptions.name, ...args), mergedOptions.context!.ui] as const
}
