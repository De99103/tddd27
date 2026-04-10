import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode }from "jwt-decode";

export default function Landing() {
    return (
     <>
        <GoogleLogin  
        onSuccess={(Credentialresponse) => {
            console.log(jwtDecode(Credentialresponse.credential));
        }}
         
        onError={() => console.log("Login failed")}/>

      </>
    );
}
