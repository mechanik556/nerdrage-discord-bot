const VALID = ['bomb', 'paper', 'rock', 'scissors']
const EMOJIS = {
  bomb:     '💣',
  paper:    '✋🏼',
  rock:     '👊🏼',
  scissors: '✌️🏼',
}

const SCENARIOS = {
  bomb:     { paper: 'win', rock: 'win', scissors: '[lose]' },
  paper:    { bomb: '[lose]', rock: 'win', scissors: '[lose]' },
  rock:     { bomb: '[lose]', paper: '[lose]', scissors: 'win' },
  scissors: { bomb: 'win', paper: 'win', rock: '[lose]' },
}

export const SHORTHAND = {
  '✋🏼':  'paper',
  '✌️🏼': 'scissors',
  '👊🏼': 'rock',
  '💣':   'bomb',
  b:      'bomb',
  p:      'paper',
  r:      'rock',
  s:      'scissors',
}

export const chop = (yours, theirs) => ({
  result:     yours === theirs ? '#draw' : SCENARIOS[yours][theirs],
  theirEmoji: EMOJIS[theirs],
  theirs,
  yourEmoji:  EMOJIS[yours],
  yours,
})

export const randomChop = () => VALID[Math.floor(Math.random() * 3) + 1]

export const formatMessage = ({ yourEmoji, theirEmoji, result }) => [
  '```css\n',
  `Your ${yourEmoji} vs. their ${theirEmoji} = you ${result}!`,
  '\n```',
].filter(Boolean).join('')

export default {
  name:  '!chop',
  regex: /!chop(?:\s+|$)(?<which>r(?:ock)?|p(?:aper)?|s(?:cissors)?|b(?:omb)?|.*?)(?:\W|$)/gi,
  handler(command) {
    this.regex.lastIndex = 0
    const parts = this.regex.exec(command)
    if (!parts) return undefined

    const which = SHORTHAND[parts.groups.which] || parts.groups.which || randomChop()

    if (!SCENARIOS[which]) {
      return [
        '```css\n',
        `I thought you were trying to throw chops... what's a '${which}'?`,
        '\n```',
      ].join('')
    }

    return formatMessage(chop(which, randomChop()))
  },
}
