const regex = /!v5dice\s*(?<count>\d*)(d(?<sides>\d+))?(h(?<hunger>\d+))?/gi

export const rollDie = sides => Math.floor(Math.random() * sides) + 1

export function interpret(dieRolls, { hunger = 0 } = {}) {
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
}

const renderNumberArray = array => (array.length
  ? array.sort().reverse().map(n => (n === 10 ? '[10]' : n)).join(', ')
  : 'none')

export function formatMessage(results) {
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

  return [
    '```css\n',
    `${emoji} ${resultName} (`,
    `${results.successes} total successes`,
    results.isCritical && `, ${results.criticality} crits`,
    results.isBestialFailure > 0 && `, ${results.bestiality} bestiality`,
    ')\n   ',
    `#normal: ${renderNumberArray(results.normalDice)}`,
    results.hungerDice.length > 0 && ` | [hunger]: ${renderNumberArray(results.hungerDice)}`,
    '\n```',
  ].filter(Boolean).join('')
}

export default {
  name: 'roll',
  regex,
  handler(command) {
    regex.lastIndex = 0
    const parts = regex.exec(command)
    if (!parts) return undefined

    const settings = {
      count:  parseInt(parts.groups.count, 10) || 1,
      sides:  parseInt(parts.groups.sides, 10) || 10,
      hunger: parseInt(parts.groups.hunger, 10) || 0,
    }
    const dieRolls = [...new Array(settings.count)].map(() => rollDie(10))

    return formatMessage(interpret(dieRolls, settings))
  },
}
