import { paraduxEnhancer } from '../index';

// lightweight redux alternative with identical API
import alterdux from 'alterdux'
import skorice from 'skorice';

describe('Core functionality test', () => {

  it('should return a store with an enhanced API', () => {
    const store = alterdux.createStore(state => state, {}, paraduxEnhancer)

    const storeTemplate = {}

    expect(skorice.assertLike(storeTemplate, store)).toBeTruthy()
  })

})
