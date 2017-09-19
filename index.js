export function paraduxEnhancer (createStore) {
  return (reducer, initialState, enhancer) => {
    let _reducers = []
    let _registry = {}

    const addReducer = (reducerFunc) => {
      _reducers.push(reducerFunc)

      let unsubscribed = false

      return () => {
        if (!unsubscribed) {
          _reducers = _reducers.filter((reducer) => {
            return reducer !== reducerFunc
          })

          unsubscribed = true

          return true
        }

        return false
      }
    }

    const removeReducer = (reducerFunc) => {
      return deregisterReducer(reducerFunc)
    }

    const deregisterReducer = (reducerFunc, namespace) => {
      return () => {
        let found = false
        _reducers = _reducers.filter((reducer) => {
          if (reducer === reducerFunc) {
            found = true
          }

          return reducer !== reducerFunc
        })

        if (namespace) {
          _registry[namespace] = undefined
        }

        return found
      }
    }

    const registerReducer = (namespace, reducerFunc) => {
      _reducers.push(reducerFunc)

      const deregister = deregisterReducer(namespace, reducer)

      _registry[namespace] = {
        reducerFunc,
        deregister
      }

      return deregister
    }

    const removeReducerByNamespace = (namespace) => {
      if (_registry[namespace]) {
        return _registry[namespace].deregister()
      }

      return false
    }

    const enhancedReducer = (enhancedReducer) => {
      return (state, action) => {
        const newState = _reducers.reduce((tempState, reducerFunc) => {
          return reducerFunc(tempState, action)
        }, reducer(state, action))

        return newState
      }
    }

    const store = createStore(enhancedReducer(reducer), initialState, enhancer)

    return Object.assign({}, store, {
      addReducer,
      removeReducer,
      registerReducer,
      deregisterReducer,
      removeReducerByNamespace,
      _reducers,
      _registry
    })
  }
}
