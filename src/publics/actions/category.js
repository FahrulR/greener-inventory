import Axios from 'axios'
import {URL} from '../../config'

export const getCategory = () => {
    return {
        type: 'GET_CATEGORY',
        payload: Axios.get(`${URL}/category`)
    }
}

export const addCategory = (data) => {
    return {
        type: 'ADD_CATEGORY',
        payload: Axios.post(`${URL}/category`, data)
    }
}

export const deleteCategory = (categoryid) => {
    return {
        type: 'DELETE_CATEGORY',
        payload: Axios.delete(`${URL}/category/${categoryid}`)
    }
}

export const getCategoryById = (categoryid) => {
    return {
        type: 'GET_CATEGORY_BY_ID',
        payload: Axios.get(`${URL}/category/${categoryid}`)
    }
}

export const editCategory = (categoryid, data) => {
    return {
        type: 'EDIT_CATEGORY',
        payload: Axios.patch(`${URL}/category/${categoryid}`, data)
    }
}
