import t from 'assert'
import { parseArgv } from './parseArgv'

test(`group option should not set default if passed in`, () => {
  const cmd = {
    name: 'opts',
    options: {
      boolean: {
        a: {
          description: 'a',
          default: true,
          group: 'x',
        },
        b: {
          description: 'b',
          group: 'x',
        },
      },
      string: {
        c: {
          default: 'c',
          description: 'c',
          group: 'x',
        },
      },
      number: {
        d: {
          default: 1,
          description: 'd',
          group: 'x',
        },
      },
    },
    run() { return },
  }

  const argv = ['cli', '-b']
  const actual = parseArgv(cmd, argv)
  t.deepStrictEqual(actual, { _: [], _defaults: [], b: true })
})

test(`group option should not set default if alias of one of the options is passed in`, () => {
  const cmd = {
    name: 'opts',
    options: {
      boolean: {
        a111: {
          description: 'a',
          default: true,
          group: 'x',
        },
        b111: {
          alias: ['b'],
          description: 'b',
          group: 'x',
        },
      },
      string: {
        c111: {
          default: 'c',
          description: 'c',
          group: 'x',
        },
      },
    },
    run() { return },
  }
  const argv = ['cli', '-b']
  const actual = parseArgv(cmd, argv)
  t.deepStrictEqual(actual, { _: [], _defaults: [], b111: true })
})