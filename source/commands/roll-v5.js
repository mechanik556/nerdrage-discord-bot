import dice from './roll'
import wrapOutput from '../utilities/wrapOutput'

const help = wrapOutput(`
[!roll-v5 Help]

Alias: [ !v5dice ]

Usage: !roll-v5 [#]h[#]
  The first [#] is the total number of dice
  The second [#] is your current hunger rating

[Example:] !roll-v5 5h2
- This will roll 5d10's, 2 of which are Hunger dice

If you omit the [h2], the roll assumes your hunger is 0

[Example:] !roll-v5 4
- This will roll 4d10's, none of which are Hunger dice
`)

export default {
  name: '!roll-v5',
  regex: /!(roll-v5|v5dice)\s*(?<count>\d*)(h(?<hunger>\d+))?/gi,
  aliases: ['!v5dice'],
  desc: 'Dice-Roller for Vampire: the Masquerade, 5th Edition',
  help,

  handler(command) {
    this.regex.lastIndex = 0
    const parts = this.regex.exec(command)
    if (!parts) return undefined

    const settings = {
      count: parseInt(parts.groups.count, 10) || 1,
      hunger: parseInt(parts.groups.hunger, 10) || 0,
    }
    const dieRolls = [...new Array(settings.count)].map(() => dice.roll(10))

    return this.formatMessage(this.interpret(dieRolls, settings))
  },

  formatMessage(results) {
    let emoji = '👎🏼'
    let resultName = 'Failure'

    if (results.isMessyCritical) {
      emoji = '😬'
      resultName = '[Messy Critical]'
    } else if (results.isCritical) {
      emoji = '👊🏼'
      resultName = 'Critical Success'
    } else if (results.isSuccess) {
      emoji = '👍🏼'
      resultName = 'Success'
    } else if (results.isBestialFailure) {
      emoji = '😈'
      resultName = '[Bestial Failure]'
    }

    return wrapOutput([
      `${emoji} ${resultName} (`,
      `${results.successes} total successes`,
      results.isCritical && `, ${results.criticality} crits`,
      results.isBestialFailure > 0 && `, ${results.bestiality} bestiality`,
      ')\n   ',
      `#normal: ${this.renderNumberArray(results.normalDice)}`,
      results.hungerDice.length > 0 && ` | [hunger]: ${this.renderNumberArray(results.hungerDice)}`,
    ].filter(Boolean).join(''))
  },

  interpret(dieRolls, { hunger = 0 } = {}) {
    const allDice = [...dieRolls]

    const successes = allDice.filter(n => n >= 6).length
      + (Math.floor(allDice.filter(n => n === 10).length / 2) * 2)

    const isSuccess = successes >= 1
    const criticality = allDice.filter(n => n === 10).length
    const isCritical = Boolean(criticality >= 2)

    const normalDice = [...allDice]
    const hungerDice = [...new Array(hunger)].map(() => normalDice.pop()).filter(Boolean)

    const messiness = !isCritical ? 0 : hungerDice.filter(n => n === 10).length
    const isMessyCritical = Boolean(isCritical && messiness >= 1)

    const bestiality = hungerDice.filter(n => n === 1).length
    const isBestialFailure = Boolean(!isSuccess && bestiality >= 1)

    return {
      allDice,
      bestiality,
      criticality,
      hungerDice,
      isBestialFailure,
      isCritical,
      isMessyCritical,
      isSuccess,
      messiness,
      normalDice,
      successes,
    }
  },

  renderNumberArray: array => (array.length
    ? array.sort((a, b) => (a - b)).reverse()
      .map(n => (n === 10 ? '[10]' : n)).join(', ')
    : 'none'),
}
