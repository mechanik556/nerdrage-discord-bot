import Guilded from 'guilded.js'
import chalk from 'chalk'
import { argv } from 'yargs'

import chop from './commands/chop'
import chops from './commands/chops'
import roll from './commands/roll'
import rollv5 from './commands/roll-v5'

const client = new Guilded.Client()

const commands = [
  chop,
  chops,
  roll,
  rollv5,
]

client.on('ready', () => {
  console.log(`Logged in as ${LOGIN_NAME}!`)
})

client.on('message', (msg) => {
  commands.forEach((cmd) => {

    // Guilded messages have many lines... iterate through all lines of the message
    msg.content.forEach((line) => {
      const matches = line.text.match(cmd.regex)
      if (matches !== null) {
        const replies = matches.map(match => cmd.handler(match)).filter(Boolean)
        if (replies.length) msg.reply(replies.join(''), "Die Roll Results")
      }
    })
  })
})

// Currently Guilded doesn't have token support.  We must login as an account for our bot.
/*const TOKEN = process.env.TOKEN || argv.token

if (TOKEN) {
  client.login(TOKEN).catch((reason) => {
    console.log(reason)
  })
} else {
  console.error(`
    ${chalk.red('You must specify a valid token. Try again with:')}
     >> ${chalk.green('yarn start --token=')}${chalk.yellow('YOUR_TOKEN_HERE')}
  `)
}
*/

const LOGIN_NAME = process.env.NERDRAGE_LOGIN_NAME || argv.login
const LOGIN_PASSWORD = process.env.NERDRAGE_LOGIN_PASSWORD || argv.password
if (LOGIN_NAME && LOGIN_PASSWORD) {
  client.login(LOGIN_NAME, LOGIN_PASSWORD)
} else {
  console.error(`
    ${chalk.red('You must specify valid Guilded login credentials. Try again with:')}
     >> ${chalk.green('yarn start --login=')}${chalk.yellow('YOUR_LOGIN_NAME_HERE')} ${chalk.green('--password=')}${chalk.yellow('YOUR_PASSWORD_HERE')}
  `)
}
