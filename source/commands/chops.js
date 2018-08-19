import chop, { SHORTHAND } from './chop'

export default {
  name: '!chops',
  regex: /!chops(?:\s?(r(?:ock)?|p(?:aper)?|s(?:cissors)?|b(?:omb)?)(?:\s+|$))*/gi,
  handler(command) {
    this.regex.lastIndex = 0
    const match = this.regex.exec(command)
    if (!match) return undefined
    if (match[1] === undefined) match[0] += ` ${chop.randomChop()}`

    return match[0]
      .replace(/!chops\s*/g, '')
      .match(/(r(?:ock)?|p(?:aper)?|s(?:cissors)?|b(?:omb)?)/gi)
      .map(yours => SHORTHAND[yours] || yours || null)
      .filter(Boolean)
      .map(yours => chop.formatMessage(chop.chop(yours, chop.randomChop())))
      .join('')
  },
}
