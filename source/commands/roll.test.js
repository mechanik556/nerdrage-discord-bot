import roll from './roll'

describe('!roll', () => {
  describe('interpret', () => {
    it('computes successes if given a difficulty', () => {
      expect(roll.interpret({ raw: [5, 6, 7], difficulty: 6 }).successes).toBe(2)
      expect(roll.interpret({ raw: [5, 6, 7] }).successes).toBe(undefined)
      expect(roll.interpret({ raw: [5, 6, 10], difficulty: 6, explosions: [8] }).successes).toBe(3)
    })

    it('counts ones', () => {
      expect(roll.interpret({ raw: [5, 6, 10], explosions: [2] }).ones).toBe(0)
      expect(roll.interpret({ raw: [1, 2, 3] }).ones).toBe(1)
      expect(roll.interpret({ raw: [1, 5, 1], explosions: [1] }).ones).toBe(3)
    })

    it('counts maxes', () => {
      expect(roll.interpret({ raw: [5, 6, 7], sides: 10 }).maxes).toBe(0)
      expect(roll.interpret({ raw: [6, 4, 6], sides: 6 }).maxes).toBe(2)
      // sides defaults to d10s
      expect(roll.interpret({ raw: [10, 9, 4] }).maxes).toBe(1)
      expect(roll.interpret({ raw: [10, 9, 4], explosions: [10] }).maxes).toBe(2)
    })

    it('computes sums', () => {
      expect(roll.interpret({ raw: [5, 6, 7] }).sum).toBe(18)
      expect(roll.interpret({ raw: [1, 3, 5, 7] }).sum).toBe(16)
    })
  })

  describe('explode', () => {
    beforeEach(() => {
      roll.old_roll = roll.roll
      let times = 2
      roll.roll = jest.fn(() => (times-- >= 0 ? 10 : 5)) // eslint-disable-line no-plusplus
    })
    afterEach(() => {
      roll.roll = roll.old_roll
      delete roll.old_roll
    })

    it('returns [] if explode is not set', () => {
      expect(roll.explode([10, 10, 10], {})).toEqual([])
      expect(roll.roll).toHaveBeenCalledTimes(0)
    })
    it('explodes only once if explodeAt = !', () => {
      expect(roll.explode([10], { explode: '!', explodeAt: 10 })).toEqual([10])
    })
    it('explodes repeatedly if explodeAt = !!', () => {
      expect(roll.explode([10], { explode: '!!', explodeAt: 10 })).toEqual([10, 10, 10, 5])
    })
  })

  describe('handler', () => {
    const mockRolls = (rolls) => {
      let index = 0
      return jest.fn(() => rolls[index++]) // eslint-disable-line no-plusplus
    }

    beforeEach(() => {
      jest.clearAllMocks()

      roll.old_roll = roll.roll
      roll.old_interpret = roll.interpret

      roll.roll = mockRolls([5, 6, 1, 9, 10, 8, 7])
      roll.interpret = jest.fn((...args) => roll.old_interpret(...args))
    })
    afterEach(() => {
      roll.roll = roll.old_roll
      delete roll.old_roll

      roll.interpret = roll.old_interpret
      delete roll.old_interpret
    })

    it('parses count', () => {
      roll.handler('!roll 5')
      expect(roll.roll).toHaveBeenCalledTimes(5)

      jest.clearAllMocks()
      roll.handler('!roll 3d8')
      expect(roll.roll).toHaveBeenCalledTimes(3)
    })

    it('parses sides', () => {
      roll.handler('!roll 5d6')

      expect(roll.roll).toHaveBeenCalledTimes(5)
      roll.roll.mock.calls.forEach((_, index) => {
        expect(roll.roll).toHaveBeenNthCalledWith(index + 1, 6)
      })
    })

    it('defaults sides to 10', () => {
      roll.handler('!roll 3')

      expect(roll.roll).toHaveBeenCalledTimes(3)
      roll.roll.mock.calls.forEach((_, index) => {
        expect(roll.roll).toHaveBeenNthCalledWith(index + 1, 10)
      })
    })

    it('parses difficulty', () => {
      roll.handler('!roll 5@8')
      expect(roll.roll).toHaveBeenCalledTimes(5)
      expect(roll.interpret.mock.calls[0][0].difficulty).toEqual(8)

      jest.clearAllMocks()

      roll.handler('!roll 4d6@5')
      expect(roll.roll).toHaveBeenCalledTimes(4)
      expect(roll.interpret.mock.calls[0][0].sides).toEqual(6)
      expect(roll.interpret.mock.calls[0][0].difficulty).toEqual(5)
    })

    it('parses explode & explodeAt', () => {
      roll.roll = mockRolls([5, 6, 7, 8, 6])

      roll.handler('!roll 5!9')
      expect(roll.roll).toHaveBeenCalledTimes(5)
      expect(roll.interpret.mock.calls[0][0].explode).toEqual('!')
      expect(roll.interpret.mock.calls[0][0].explodeAt).toEqual(9)

      jest.clearAllMocks()

      roll.handler('!roll 2d10@8!!10')
      expect(roll.roll).toHaveBeenCalledTimes(2)
      expect(roll.interpret.mock.calls[0][0].count).toEqual(2)
      expect(roll.interpret.mock.calls[0][0].difficulty).toEqual(8)
      expect(roll.interpret.mock.calls[0][0].explode).toEqual('!!')
      expect(roll.interpret.mock.calls[0][0].explodeAt).toEqual(10)
      expect(roll.interpret.mock.calls[0][0].sides).toEqual(10)

      jest.clearAllMocks()

      roll.handler('!roll 5d8!!')
      expect(roll.roll).toHaveBeenCalledTimes(5)
      expect(roll.interpret.mock.calls[0][0].explode).toEqual('!!')
      expect(roll.interpret.mock.calls[0][0].explodeAt).toEqual(8)
      expect(roll.interpret.mock.calls[0][0].sides).toEqual(8)
    })
  })

  describe('formatMessage', () => {
    const mockRolls = (rolls) => {
      let index = 0
      return jest.fn(() => rolls[index++]) // eslint-disable-line no-plusplus
    }

    beforeEach(() => {
      jest.clearAllMocks()
      roll.old_roll = roll.roll
    })
    afterEach(() => {
      roll.roll = roll.old_roll
      delete roll.old_roll
    })

    it('displays correctly in each scenario', () => {
      roll.roll = mockRolls([1, 8, 5, 6])
      expect(roll.handler('!roll 4')).toMatchSnapshot()

      roll.roll = mockRolls([4, 8, 4, 5])
      expect(roll.handler('!roll 4d8')).toMatchSnapshot()

      roll.roll = mockRolls([9, 10, 10, 8, 6, 7, 5])
      expect(roll.handler('!roll 7d10')).toMatchSnapshot()

      roll.roll = mockRolls([1, 8, 5, 7, 9, 10, 8, 6, 4, 10])
      expect(roll.handler('!roll 9d10!')).toMatchSnapshot()
      expect(roll.roll).toHaveBeenCalledTimes(10)

      roll.roll = mockRolls([5, 10, 10, 6, 9, 10, 8, 8])
      expect(roll.handler('!roll 5d10!!')).toMatchSnapshot()
      expect(roll.roll).toHaveBeenCalledTimes(8)
    })
  })
})
