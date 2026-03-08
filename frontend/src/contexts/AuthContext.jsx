import axios from "axios";
import { Children, createContext, use, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";

// This creates a global container.
// Think of it like a global storage:
// AuthContext
//    ↓
// Stores
//    ↓
// userData
// login()
// register()
export const AuthContext = createContext({});

const client = axios.create({
    baseURL : "http://localhost:8000/api/v1/users"
    //instead of writing full url everytime . axios add this baseURl and we can simply write /login
    //                                                                                       /register
})


//This component wraps the entire React app.
export const AuthProvider = ({children}) =>{

    //This reads any existing context values.
    const authContext = useContext(AuthContext);

    // Stores logged-in user information.
    // Example after login:
    // userData = {
    //  username : "Pruthviraj"
    // }
    const [userData , setUserData] = useState(authContext);

    const router = useNavigate();


    //This function sends register request to backend.
    const handleRegister = async(name , username , password) =>{
        try{
            let request = await client.post("/register" , {
                name : name,
                username : username,
                password : password
            })

            if(request.status === httpStatus.CREATED){
               return  request.data.message;
            }
        }catch(err){
            throw err;
        }
    }

    const handleLogin  = async (username , password)=>{
        try{
            let request = await client.post("/login" ,{
                username : username,
                password : password
            });
            
            if(request.status === httpStatus.OK){
                localStorage.setItem("token" , request.data.token)
                router("/home")
            }
        }catch(err){
            throw err;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }


   
    //Data Object Provided to Context . This object is shared globally.
    const data = {
        userData , setUserData ,handleRegister ,getHistoryOfUser,addToUserHistory, handleLogin
    }

    return(
        <AuthContext.Provider value={data}>
        {children}
        </AuthContext.Provider>
    )
}