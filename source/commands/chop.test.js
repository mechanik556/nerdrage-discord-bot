import chop from './chop'

describe('!chop', () => {
  beforeEach(() => {
    chop.old_randomChop = chop.randomChop
    chop.randomChop = jest.fn(() => 'rock')
  })
  afterEach(() => {
    chop.randomChop = chop.old_randomChop
    delete chop.old_randomChop
  })

  it('throws random on blank/omitted type', () => {
    chop.handler('!chop')
    expect(chop.randomChop).toHaveBeenCalledTimes(2) // 1 for mine, 1 for theirs
  })

  it('throws random on unrecognized type', () => {
    chop.handler('!chop foo')
    expect(chop.randomChop).toHaveBeenCalledTimes(2) // 1 for mine, 1 for theirs
  })

  it('accepts short OR long versions of type', () => {
    expect(chop.handler('!chop b')).toContain('Your #bomb')
    expect(chop.randomChop).toHaveBeenCalledTimes(1) // theirs

    jest.clearAllMocks()
    expect(chop.handler('!chop bomb')).toContain('Your #bomb')
    expect(chop.randomChop).toHaveBeenCalledTimes(1) // theirs

    jest.clearAllMocks()
    chop.handler('!chop bombfoo')
    expect(chop.randomChop).toHaveBeenCalledTimes(2) // `bombfoo` is unrecognized
  })
})
