import { useState } from "react";
import { Button } from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";

export function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    async function signup() {
        if (!username || !password) {
            alert("Username and Password are required");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }
        try {
            await axios.post(BACKEND_URL + "/api/v1/signup", {

                username,
                password

            })
            navigate("/signin");
            alert("Signed Up successfully");

        } catch (error) {
            alert("Error signing up due to backend ");
        }

    }
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <div className="text-purple-600 font-bold flex justify-between ">
                <div>MindMirror</div>
                SignUp
            </div>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            <div className="flex justify-center p-2">
                <Button size="md" onClick={signup} variant="primary" text="Sign Up" />
            </div>
            <div className="flex">
                <div>Already have an Account?</div>
                <div className="ml-1 text-blue-500 cursor-pointer"><Link to="/signin">SignIn</Link></div>
            </div>
        </div>
    </div>
}