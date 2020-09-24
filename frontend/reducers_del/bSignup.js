const initialStore = {
    authFlag: false,
    errormsg:"",
    // fname: "",
    // lname: "",
    // email: "",
    // phone: ""
}

export default function(state = initialStore, action) {
    if(action.type === "SIGNUP" && action.statusCode == 200){
        return {
            ...state,
            authFlag :true,
            errormsg : action.payload.errormsg,
            // fname: action.payload.data.fName,
            // lname: action.payload.data.lName,
            // email: action.payload.data.email,
            // phone: action.payload.data.phone
        }
    }
    if(action.type === "SIGNUP" && action.statusCode == 201){
        return {
            ...state,
            authFlag :false,
            errormsg : action.payload.errormsg
        }
    }
    if(action.type === "SIGNUP" && action.statusCode == 202){
        return {
            ...state,
            authFlag :false,
            errormsg : action.payload.errormsg
        }
    }

    return state;
}