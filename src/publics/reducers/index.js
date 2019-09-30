import {combineReducers} from 'redux'

import products from './products'
import category from './category'
import users from './users'

const rootReducers = combineReducers({
    users,
    category,
    products
})

export default rootReducers