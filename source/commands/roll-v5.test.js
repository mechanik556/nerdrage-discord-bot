import v5 from './roll-v5'

describe('!roll-v5', () => {
  describe('interpret', () => {
    it('calculates criticals', () => {
      expect(v5.interpret([10])).toMatchSnapshot()
      expect(v5.interpret([10, 10])).toMatchSnapshot()
    })

    it('calculates bestial failure', () => {
      expect(v5.interpret([1, 1], { hunger: 2 })).toMatchSnapshot()
      expect(v5.interpret([1, 1], { hunger: 1 })).toMatchSnapshot()
      expect(v5.interpret([1, 1], { hunger: 0 })).toMatchSnapshot()
    })

    it('calculates messy critical', () => {
      expect(v5.interpret([10, 10], { hunger: 2 })).toMatchSnapshot()
      expect(v5.interpret([10, 10], { hunger: 1 })).toMatchSnapshot()
      expect(v5.interpret([10, 10], { hunger: 0 })).toMatchSnapshot()
    })
  })

  describe('formatMessage', () => {
    it('displays correctly in each scenario', () => {
      expect(v5.formatMessage(v5.interpret([4, 10, 8, 10, 6], { hunger: 2 }))).toMatchSnapshot()
      expect(v5.formatMessage(v5.interpret([10, 10, 4, 6, 8], { hunger: 2 }))).toMatchSnapshot()
      expect(v5.formatMessage(v5.interpret([4, 10, 8, 10, 6]))).toMatchSnapshot()
      expect(v5.formatMessage(v5.interpret([9, 4, 6, 8], { hunger: 2 }))).toMatchSnapshot()
      expect(v5.formatMessage(v5.interpret([9, 4, 6, 8]))).toMatchSnapshot()
      expect(v5.formatMessage(v5.interpret([5, 3], { hunger: 1 }))).toMatchSnapshot()
      expect(v5.formatMessage(v5.interpret([5, 3]))).toMatchSnapshot()
      expect(v5.formatMessage(v5.interpret([2, 1], { hunger: 1 }))).toMatchSnapshot()
      expect(v5.formatMessage(v5.interpret([2, 1]))).toMatchSnapshot()
      expect(v5.formatMessage(v5.interpret([1, 1], { hunger: 2 }))).toMatchSnapshot()
    })
  })
})
