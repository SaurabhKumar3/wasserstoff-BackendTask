import { useEffect, useState } from "react";
import axios from "axios";
import { set } from "mongoose";
import Component from "./Components";
function Signin(){
    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const handlesubmit=async(e)=>{
        e.preventDefault();
        try{
            if (!username || !password) {
                console.log("Username and password are required");
                return;
              }
            console.log(username,password);
            const response=await axios.post('http://localhost:5000/signin',{
                username,
                password
            })
            console.log("Signin successful:", response.data);
            if(response.data.role==='admin'){
                setIsAdmin(true);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    if (isAdmin) {
        return <Component />;
      }
    
    return <form onClick={handlesubmit}>
        <input type="text" placeholder="Email" value={username} onChange={(e)=>setusername(e.target.value)}/>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setpassword(e.target.value)}/>
        <button type="submit">Signin</button>
    </form>
}
export default Signin;