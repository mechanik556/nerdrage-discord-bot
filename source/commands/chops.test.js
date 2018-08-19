import chop from './chop'
import chops from './chops'

describe('!chops', () => {
  beforeEach(() => {
    chop.old_randomChop = chop.randomChop
    chop.randomChop = jest.fn(() => 'rock')
  })
  afterEach(() => {
    chop.randomChop = chop.old_randomChop
    delete chop.old_randomChop
  })

  it('throws 1 random on blank/omitted type', () => {
    chops.handler('!chops')
    expect(chop.randomChop).toHaveBeenCalledTimes(2) // 1 for mine, 1 for theirs
  })

  it('throws random on unrecognized type', () => {
    chops.handler('!chops foo')
    expect(chop.randomChop).toHaveBeenCalledTimes(2) // 1 for mine, 1 for theirs
  })

  it('accepts short OR long versions of type', () => {
    const result = chops.handler('!chops r p s b rock paper scissors bomb').replace(/\n/g, ' ')
    expect(chop.randomChop).toHaveBeenCalledTimes(8) // theirs
    expect(result).toMatch(/(Your #rock.*){2,2}/gm)
    expect(result).toMatch(/(Your #paper.*){2,2}/gm)
    expect(result).toMatch(/(Your #scissors.*){2,2}/gm)
    expect(result).toMatch(/(Your #bomb.*){2,2}/gm)
  })
})
