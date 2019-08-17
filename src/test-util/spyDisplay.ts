import { Cli } from '../cli'

import { CompositeDisplay } from './CompositeDisplay'
import { InMemoryDisplay } from './InMemoryDisplay'

export function spyDisplay(cli: Cli<any, any>, cmdName?: string) {
  const memDisplay = new InMemoryDisplay()

  const ui = cmdName ? (cli.commands.find(c => c.name === cmdName) as any).ui : (cli as any).ui

  ui.display = new CompositeDisplay(ui.display, memDisplay)

  return memDisplay
}
