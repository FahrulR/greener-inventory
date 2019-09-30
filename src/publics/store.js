import {createStore, applyMiddleware, compose} from 'redux'
import {createLogger} from 'redux-logger'
import Rpm from 'redux-promise-middleware'

import reducer from './reducers/index'

const logger = createLogger()

const store = createStore(
    reducer,
    compose( 
    applyMiddleware(logger, Rpm)
    )
)

export default store