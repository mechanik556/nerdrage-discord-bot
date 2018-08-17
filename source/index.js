import Discord from 'discord.js'
import chalk from 'chalk'
import { argv } from 'yargs'

import roll from './commands/roll'

const client = new Discord.Client()

const commands = [
  roll,
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

if (argv.token) {
  client.login(argv.token)
} else {
  console.error(`
    ${chalk.red('You must specify a valid token. Try again with:')}
     >> ${chalk.green('yarn start --token=')}${chalk.yellow('YOUR_TOKEN_HERE')}
  `)
}
