import Axios from 'axios'
import {URL} from '../../config'

export const login = (data) => {
    return{
        type: 'LOGIN',
        payload: Axios.post(`${URL}/users/login`, data)
    }
}

export const register = (data) => {
    return{
        type: 'REGISTER',
        payload: Axios.post(`${URL}/users/register`, data)
    }
}
export const getProfile = (token) => {
    return{
        type: 'GET_PROFILE',
        payload: Axios.get(`${URL}/users/profile`, {
            headers:{
                Authorization: token
            }
        })
    }
}