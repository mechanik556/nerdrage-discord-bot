import wrapOutput from '../utilities/wrapOutput'

export default {
  name: '!roll',
  aliases: ['!dice'],
  regex: /!(?:dice)\s*(?<count>\d*)(d(?<sides>\d+))?(@(?<difficulty>\d+))?((?<explode>!+)(?<explodeAt>\d+)?)?/gi,
  handler(command) {
    this.regex.lastIndex = 0
    const parts = this.regex.exec(command)
    if (!parts) return undefined

    const settings = {
      count: parseInt(parts.groups.count, 10) || 1,
      sides: parseInt(parts.groups.sides, 10) || 10,
      difficulty: parseInt(parts.groups.difficulty, 10) || undefined,
      explode: parts.groups.explode || '',
      explodeAt: parseInt(parts.groups.explodeAt, 10) || undefined,
    }
    if (!settings.difficulty) settings.difficulty = Math.round(settings.sides * 0.8)
    if (settings.explode && settings.explodeAt === undefined) {
      settings.explodeAt = settings.sides
    }

    const raw = [...new Array(settings.count)].map(() => this.roll(settings.sides))

    return this.formatMessage(this.interpret({
      raw,
      explosions: this.explode(raw, settings),
      ...settings,
    }))
  },

  explode(rolls, { explode = '', explodeAt, sides = 10 } = {}) {
    if (!explode) return []

    const explosions = rolls.filter(roll => roll >= explodeAt).map(() => this.roll(sides))

    if (explode === '!!' && explosions.length) {
      return [...explosions, ...this.explode(explosions, { explodeAt, explode, sides })]
    }

    return explosions
  },

  formatMessage({ count, difficulty, explosions, ones, maxes, raw, sides, successes }) {
    return wrapOutput([
      `You rolled ${count}d${sides}'s -> 🎲[${this.renderNumberArray(raw)}] + 💥[${this.renderNumberArray(explosions)}]`,
      ` -> [${successes}] x #successes { @ ${difficulty} difficulty }`,
      ` -> [${ones}] x #ones`,
      ` -> [${maxes}] x #${sides}s`,
    ].filter(Boolean).join('\n'))
  },

  interpret: ({
    count,
    difficulty,
    explode = '',
    explosions = [],
    raw = [],
    sides = 10,
  }) => {
    const rolls = [...raw, ...explosions]
    return {
      count: count || raw.length,
      difficulty,
      explode,
      explosions,
      maxes: rolls.filter(r => r === sides).length,
      ones: rolls.filter(r => r === 1).length,
      raw,
      rolls,
      sides,
      successes: difficulty !== undefined
        ? rolls.filter(r => r >= difficulty).length
        : undefined,
      sum: rolls.reduce((sum, roll) => sum + roll, 0),
    }
  },

  renderNumberArray: array => (array.length
    ? array.sort((a, b) => (a - b)).reverse().join(', ')
    : 'none'
  ),

  roll: (sides = 6) => Math.floor(Math.random() * sides) + 1,
}
