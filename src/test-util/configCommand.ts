import { createCommand } from '../create-cli'

export const configCommand = createCommand({
  name: 'config',
  description: 'config command',
  config: { a: 2 },
  async run() {
    return this.config
  },
})