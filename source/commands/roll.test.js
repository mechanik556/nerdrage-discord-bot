import roll, { formatMessage, interpret } from './roll'

describe('!roll', () => {
  describe('interpret', () => {
    it('calculates criticals', () => {
      expect(interpret([10])).toMatchSnapshot()
      expect(interpret([10, 10])).toMatchSnapshot()
    })

    it('calculates bestial failure', () => {
      expect(interpret([1, 1], { hunger: 2 })).toMatchSnapshot()
      expect(interpret([1, 1], { hunger: 1 })).toMatchSnapshot()
      expect(interpret([1, 1], { hunger: 0 })).toMatchSnapshot()
    })

    it('calculates messy critical', () => {
      expect(interpret([10, 10], { hunger: 2 })).toMatchSnapshot()
      expect(interpret([10, 10], { hunger: 1 })).toMatchSnapshot()
      expect(interpret([10, 10], { hunger: 0 })).toMatchSnapshot()
    })
  })

  describe('formatMessage', () => {
    it('displays correctly in each scenario', () => {
      expect(formatMessage(interpret([4, 10, 8, 10, 6], { hunger: 2 }))).toMatchSnapshot()
      expect(formatMessage(interpret([10, 10, 4, 6, 8], { hunger: 2 }))).toMatchSnapshot()
      expect(formatMessage(interpret([4, 10, 8, 10, 6]))).toMatchSnapshot()
      expect(formatMessage(interpret([9, 4, 6, 8], { hunger: 2 }))).toMatchSnapshot()
      expect(formatMessage(interpret([9, 4, 6, 8]))).toMatchSnapshot()
      expect(formatMessage(interpret([5, 3], { hunger: 1 }))).toMatchSnapshot()
      expect(formatMessage(interpret([5, 3]))).toMatchSnapshot()
      expect(formatMessage(interpret([2, 1], { hunger: 1 }))).toMatchSnapshot()
      expect(formatMessage(interpret([2, 1]))).toMatchSnapshot()
      expect(formatMessage(interpret([1, 1], { hunger: 2 }))).toMatchSnapshot()
    })
  })
})
