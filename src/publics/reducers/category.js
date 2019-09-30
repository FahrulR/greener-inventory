const initState = {
    categoryList:[],
    errMessage:'',
    message:'',
    isLoading:false,
    isRejected:false,
    isFulfilled:false
}

const category = (state = initState, action) => {
    switch(action.type){
        case 'GET_CATEGORY_PENDING':
            return{
                ...state,
                isLoading:true,
                isRejected:false,
                isFulfilled:false
            }
        case 'GET_CATEGORY_REJECTED':
            return{
                ...state,
                isLoading:false,
                isRejected:true,
                errMessage:action.payload.response.data.message
            }
        case 'GET_CATEGORY_FULFILLED':
            return{
                ...state,
                isLoading:false,
                isFulfilled:true,
                categoryList: action.payload.data.data
            }
        case 'ADD_CATEGORY_PENDING':
            return{
                ...state,
                isLoading:true,
                isRejected:false,
                isFulfilled:false
            }
        case 'ADD_CATEGORY_REJECTED':
            return{
                ...state,
                isLoading:false,
                isRejected:true,
                errMessage:action.payload.response.data.message
            }
        case 'ADD_CATEGORY_FULFILLED':
            return{
                ...state,
                isLoading:false,
                isFulfilled:true,
            }
        case 'EDIT_CATEGORY_PENDING':
            return{
                ...state,
                isLoading:true,
                isRejected:false,
                isFulfilled:false
            }
        case 'EDIT_CATEGORY_REJECTED':
            return{
                ...state,
                isLoading:false,
                isRejected:true,
                errMessage:action.payload.response.data.message
            }
        case 'EDIT_CATEGORY_FULFILLED':
            const newCategoryData = action.payload.data.data
            return{
                ...state,
                isLoading:false,
                isFulfilled:true,
                categoryList: state.categoryList.map((category) => {
                    return category.categoryid === newCategoryData.categoryid ? newCategoryData : category
                })
            }
        case 'DELETE_CATEGORY_PENDING':
            return{
                ...state,
                isLoading:true,
                isRejected:false,
                isFulfilled:false
            }
        case 'DELETE_CATEGORY_REJECTED':
            return{
                ...state,
                isLoading:false,
                isRejected:true,
                errMessage:action.payload.response.data.message
            }
        case 'DELETE_CATEGORY_FULFILLED':
            return{
                ...state,
                isLoading:false,
                isFulfilled:true,
                categoryList: state.categoryList.filter((category) => {
                    return category.categoryid !== action.payload.data.data.categoryid
                })
            }
        default:
            return state
    }
}

export default category