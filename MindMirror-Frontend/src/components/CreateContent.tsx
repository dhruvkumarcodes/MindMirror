import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";



export function CreateContent({ open, onClose }) {

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
                            <Input placeholder={"Title"} />
                            <Input placeholder={"Link"} />
                        </div>
                        <div className="flex justify-center">
                            <Button variant="primary" text="submit"></Button>
                        </div>
                    </span>
                </div>
            </div>
            }
        </div>
    );
}

function Input({ onChange, placeholder }: { onChange: () => void }) {
    return <div>
        <input placeholder={placeholder} className="px-4 py-2 border m-2 rounded" type={"text"} onChange={onChange} />
    </div>
}