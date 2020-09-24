const initialStore = {
    authFlag: false,
    errormsg:"",
    name: "",
    restaurantName: "",
    email: "",
    phone: "",
    zipCode: ""
}

export default function(state = initialStore, action) {
    if(action.type === "OLOGIN" && action.statusCode == 200){
        return {
            ...state,
            authFlag :true,
            errormsg : action.payload.errormsg,
            name: action.payload.data.name,
            restaurantName: action.payload.data.restaurantName,
            email: action.payload.data.email,
            phone: action.payload.data.phone,
            zipCode: action.payload.data.zipCode
        }
    }
    if(action.type === "OLOGIN" && action.statusCode == 201){
        return {
            ...state,
            authFlag :false,
            errormsg : action.payload.errormsg
        }
    }
    if(action.type === "OLOGIN" && action.statusCode == 202){
        return {
            ...state,
            authFlag :false,
            errormsg : action.payload.errormsg
        }
    }

    return state;
}