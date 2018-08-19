const VALID = ['bomb', 'paper', 'rock', 'scissors']
const EMOJIS = {
  bomb: '💣',
  paper: '✋🏼',
  rock: '👊🏼',
  scissors: '✌️🏼',
}

const SCENARIOS = {
  bomb: { paper: 'win', rock: 'win', scissors: '[lose]' },
  paper: { bomb: '[lose]', rock: 'win', scissors: '[lose]' },
  rock: { bomb: '[lose]', paper: '[lose]', scissors: 'win' },
  scissors: { bomb: 'win', paper: 'win', rock: '[lose]' },
}

export const SHORTHAND = {
  '✋🏼': 'paper',
  '✌️🏼': 'scissors',
  '👊🏼': 'rock',
  '💣': 'bomb',
  b: 'bomb',
  p: 'paper',
  r: 'rock',
  s: 'scissors',
}

export default {
  name: '!chop',
  regex: /!chop(?:\s+|$)(?<which>r(?:ock)?|p(?:aper)?|s(?:cissors)?|b(?:omb)?|.*?)(?:\W|$)/gi,
  handler(command) {
    this.regex.lastIndex = 0
    const parts = this.regex.exec(command)
    if (!parts) return undefined

    let which = (SHORTHAND[parts.groups.which] || parts.groups.which).toLowerCase()
    if (!SCENARIOS[which]) which = this.randomChop()

    return this.formatMessage(this.chop(which, this.randomChop()))
  },

  chop: (yours, theirs) => ({
    result: yours === theirs ? '#draw' : SCENARIOS[yours][theirs],
    theirEmoji: EMOJIS[theirs],
    theirs,
    yourEmoji: EMOJIS[yours],
    yours,
  }),

  formatMessage: ({
    yours, yourEmoji, theirs, theirEmoji, result,
  }) => [
    '```css\n',
    `Your #${yours} ${yourEmoji} vs. their #${theirs} ${theirEmoji} = you ${result}!`,
    '\n```',
  ].filter(Boolean).join(''),

  randomChop: () => VALID[Math.floor(Math.random() * 3) + 1],
}
