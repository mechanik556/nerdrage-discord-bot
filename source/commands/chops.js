import {
  chop, formatMessage, randomChop, SHORTHAND,
} from './chop'

export default {
  name:  '!chops',
  regex: /!chops\s+(?:\s?(r(?:ock)?|p(?:aper)?|s(?:cissors)?|b(?:omb)?)\s?)+/gi,
  handler(command) {
    this.regex.lastIndex = 0
    const match = this.regex.exec(command)
    if (!match) return undefined

    return match[0]
      .replace(/!chops /g, '')
      .match(/(r(?:ock)?|p(?:aper)?|s(?:cissors)?|b(?:omb)?)/gi)
      .map(yours => SHORTHAND[yours] || yours || null)
      .filter(Boolean)
      .map(yours => formatMessage(chop(yours, randomChop())))
      .join('')
  },
}
