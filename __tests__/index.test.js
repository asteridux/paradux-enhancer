import { paraduxEnhancer } from '../index';

// lightweight redux alternative with identical API
import alterdux from 'alterdux'
import utils from 'utils'

describe('Core functionality test', () => {

  it('should return a store with an enhanced API', () => {
    const store = alterdux.createStore(state => state, {}, paraduxEnhancer)

    utils.checkKeys(store, ['addReducer', 'removeReducer'])
  })

})
