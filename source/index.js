import Discord from 'discord.js'
import chalk from 'chalk'
import { argv } from 'yargs'

const client = new Discord.Client();

const commands = [
  require('./commands/roll').default,
]

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  commands.forEach(cmd => {
    const match = msg.content.match(cmd.regex)
    if (match !== null) {
      match.forEach(params => {
        const response = cmd.handler(params)
        if (response) msg.reply(response)
      })
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

