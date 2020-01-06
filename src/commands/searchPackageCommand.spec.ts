import t from 'assert'
import { createPluginCliTest, generateDisplayedMessage, createCliTest } from '../test-util'
import { searchPackageCommand } from './searchPackageCommand'

test('can only be used by PluginCli', async () => {
  const { cli, argv, ui } = createCliTest({ commands: [searchPackageCommand] }, 'search', 'somekey')
  await cli.parse(argv)

  const message = generateDisplayedMessage(ui.display.errorLogs)
  t.strictEqual(message, 'plugins search command can only be used by PluginCli')
})

test('requires at least one keyword', async () => {
  const { cli, argv, ui } = createPluginCliTest({ commands: [searchPackageCommand] }, 'search')
  await cli.parse(argv)

  const message = generateDisplayedMessage(ui.display.errorLogs)
  t.strictEqual(message, `Missing Argument. Expecting 1 but received 0.`)
})

test('displays no package found if keyword search does not yield any result', async () => {
  const npmSearch = () => { return Promise.resolve([] as string[]) }

  const { cli, argv, ui } = createPluginCliTest({
    name: 'clibuilder',
    context: { _dep: { searchByKeywords: npmSearch }, keyword: '' },
    commands: [searchPackageCommand]
  }, 'search', 'x', 'y')

  await cli.parse(argv)

  const message = generateDisplayedMessage(ui.display.infoLogs)
  t.strictEqual(message, `no packages with keywords: x,y`)
})

test('found one package', async () => {
  const npmSearch = () => { return Promise.resolve(['pkg-x']) }

  const { cli, argv, ui } = createPluginCliTest({
    name: 'clibuilder',
    context: { _dep: { searchByKeywords: npmSearch }, keyword: '' },
    commands: [searchPackageCommand]
  }, 'search', 'x', 'y')
  await cli.parse(argv)

  const message = generateDisplayedMessage(ui.display.infoLogs)
  t.strictEqual(message, `found one package: pkg-x`)
})


test('found multiple packages', async () => {
  const npmSearch = () => { return Promise.resolve(['pkg-x', 'pkg-y']) }

  const { cli, argv, ui } = createPluginCliTest({
    name: 'clibuilder',
    context: { _dep: { searchByKeywords: npmSearch }, keyword: '' },
    commands: [searchPackageCommand]
  }, 'search', 'x', 'y')
  await cli.parse(argv)

  const message = generateDisplayedMessage(ui.display.infoLogs)
  t.strictEqual(message, `found multiple packages:

  pkg-x
  pkg-y`)
})
