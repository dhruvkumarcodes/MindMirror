import { useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import Input from "./Input";
import axios from "axios";
import { BACKEND_URL } from "../config";



export function CreateTextContent({ open, onClose }) {
    const [title, setTitle] = useState("");
    const [content, setText] = useState("");
    const [type, setType] = useState("text");
    async function addContent() {
        await axios.post(`${BACKEND_URL}/api/v1/content`, {
            title,
            content: content,
            type
        }, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then(() => {
            alert("Content added successfully");
            onClose();
        }).catch(() => {
            alert("Error adding content");
        }
        )
    }
    return (
        <div className="">
            {open && <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 bg-opacity-60 flex justify-center">
                <div className="flex flex-col justify-center">
                    <span className="bg-white opacity-full p-4 rounded">
                        <div className="flex justify-end">
                            <div onClick={onClose} className="cursor-pointer">
                                <CrossIcon />
                            </div>
                        </div>
                        <div>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={"Title"} />
                            <Input value={content} onChange={(e) => setText(e.target.value)} placeholder={"Content"} />
                        </div>
                        <div>

                            <div className="flex justify-between items-center m-2">
                                <h1 className="font-semibold">Type:</h1>
                                <Button size="sm" text="Text" variant={type === "text" ? "primary" : "secondary"} onClick={() => setType("text")} />
                                <Button size="sm" text="TextFile" variant={type === "textfile" ? "primary" : "secondary"} onClick={() => setType("textfile")} />

                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button size="md" onClick={addContent} variant="primary" text="submit"></Button>
                        </div>
                    </span>
                </div>
            </div>
            }
        </div>
    );
}

