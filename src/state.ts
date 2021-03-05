import chalk from 'chalk'
import { basename } from 'path'
import { findKey } from 'type-plus'
import type { cli } from './cli'
import { Context } from './context'
import { AppInfo } from './loadAppInfo'
import type { Command } from './types'

export namespace state {
  export type Result<C = any> = {
    name: string,
    version?: string,
    description?: string,
    configName?: string,
    config?: C,
    commands: Command[]
  }
}

export function state(
  { ui, getAppPath, loadAppInfo, process, log }: Context,
  options?: cli.Options): state.Result<any> {
  if (options && (options as any).name) return {
    ...options,
    commands: []
  } as any
  const stack = new Error().stack!
  const appPath = getAppPath(stack)
  const appInfo = loadAppInfo(appPath)
  if (appInfo) {
    const name = getCliName(appPath, appInfo)
    if (name) {
      log.debug(`package name: ${name}`)
      log.debug(`version: ${appInfo.version}`)
      log.debug(`description: ${appInfo.description}`)
      return {
        name,
        version: appInfo.version,
        description: appInfo.description,
        configName: options?.configName,
        commands: []
      }
    }
  }
  ui.error(`Unable to locate a ${chalk.yellow('package.json')} for application:
    ${chalk.cyan(appPath)}

    please specify the name of the application manually.`)
  process.exit(1)
  return {} as any
}

function getCliName(appPath: string, { name, bin, dir }: AppInfo): string | undefined {
  if (!bin) return name || basename(dir)

  if (typeof bin === 'string') {
    return appPath.endsWith(bin) ? name : undefined
  }
  return findKey(bin, (key) => appPath.endsWith(bin[key]))
}