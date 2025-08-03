import { useState } from "react";
import { Button } from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";


export function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    async function signin() {
        if (!username || !password) {
            alert("Username and Password are required");
            return;
        }

        try {
            const response = await axios.post(BACKEND_URL + "/api/v1/signin", {

                username,
                password

            })
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            navigate("/dashboard");
        } catch (error) {
            alert("Error signing up due to backend ");
        }

    }
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <div className="text-purple-600 font-bold flex justify-between ">
                <div>MindMirror</div>
                SignIn
            </div>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            <div className="flex justify-center p-2">
                <Button size="md" onClick={signin} variant="primary" text="SignIn" />
            </div>
            <div className="flex">
                <div>Don't have an Account?</div>
                <div className="ml-1 text-blue-500 cursor-pointer"><Link to="/signup">SignUp</Link></div>
            </div>

        </div>
    </div>
}