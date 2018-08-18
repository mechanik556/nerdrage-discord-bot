import Discord from 'discord.js'
import chalk from 'chalk'
import { argv } from 'yargs'

import chop from './commands/chop'
import chops from './commands/chops'
import v5dice from './commands/v5dice'

const client = new Discord.Client()

const commands = [
  chop,
  chops,
  v5dice,
]

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', (msg) => {
  commands.forEach((cmd) => {
    const matches = msg.content.match(cmd.regex)
    if (matches !== null) {
      const replies = matches.map(match => cmd.handler(match)).filter(Boolean)
      if (replies.length) msg.reply(replies.join(''))
    }
  })
})

const TOKEN = process.env.TOKEN || argv.token

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
