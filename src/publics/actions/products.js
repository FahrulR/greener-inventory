import Axios from 'axios'
import { URL } from '../../config'

// const token = window.localStorage.getItem("token")

export const getProducts = (page =1, sortby=null, search=null, limit=null) => {
    let url = `${URL}/products?page=${page}`
    if(sortby !== null)
        url += `&sortby=${sortby}`
    if(search !== null)
        url += `&search=${search}`

    return {
        type: 'GET_PRODUCTS',
        payload: Axios.get(url)
    }
}

// export const getProducts = () => {
//   return {
//       type: 'GET_PRODUCTS',
//       payload: Axios.get(`${URL}/products?limit=100`)
//   }
// }



export const getProductById = (productid) => {
    return {
        type: 'GET_PRODUCT_BY_ID',
        payload: Axios.get(`${URL}/products/${productid}`)
    }
}


export const addProductQTY = (productid) => {
    return {
        type: 'ADD_PRODUCT_QTY',
        payload: Axios.patch(`${URL}/products/${productid}/add=1`)
    }
}

export const reduceProductQTY = (productid) => {
    return {
        type: 'REDUCE_PRODUCT_QTY',
        payload: Axios.patch(`${URL}/products/${productid}/reduce=1`)
    }
}


export const addProduct = (data) => {
    return {
        type: 'ADD_PRODUCT',
        payload: Axios.post('${URL}/products', data, {
            headers:{
                Authorization: token
            }
        })
    }
}

export const deleteProduct = (productid) => {
    return {
        type: 'DELETE_PRODUCT',
        payload: Axios.delete(`${URL}/products/${productid}`)
    }
}

export const editProduct = (productid, data) => {
    return{
        type: 'EDIT_PRODUCT',
        payload: Axios.patch(`${URL}/${productid}`, data, {
            headers:{
                Authorization: token
            }
        })
    }
}

