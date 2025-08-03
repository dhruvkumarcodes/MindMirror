import { useState } from "react";
import axios from "axios";
import bot from "../assets/ai.webp";
import { BACKEND_URL } from "../config";

export function Boom() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<{ role: string; text: string }[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    function renderHistory() {
        const items: React.ReactElement[] = [];
        for (let i = 0; i < history.length; i++) {
            const msg = history[i];
            items.push(
                <div key={i} className="border p-2 rounded text-sm">
                    <strong>{msg.role === "user" ? "You" : "BOOM"}:</strong> {msg.text}
                </div>
            );
        }
        return items;
    }
    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { role: "user", text: input };
        setHistory((prev) => [...prev, userMessage]);

        setLoading(true);
        setResponse("Thinking...");
        try {
            const res = await axios.post(BACKEND_URL + "/api/v1/boom", { prompt: input });



            const rawReply = res.data.reply || "";
            const cleanedReply = rawReply
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const parsed = JSON.parse(cleanedReply);
            const assistantMessage = { role: "assistant", text: parsed.response };
            setHistory((prev) => [...prev, assistantMessage]);
            setResponse(parsed.response || "No response from BOOM.");
        } catch (err) {
            console.error(err);
            setResponse("Sorry, something went wrong.");
            setHistory((prev) => [
                ...prev,
                { role: "assistant", text: "Oops, something went wrong." },
            ]);
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md max-h-80 w-80 border border-purple-400">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded text-sm "
                >
                    {showHistory ? "Back to Chat" : "View History"}
                </button>
            </div>
            <div className="flex items-center">
                <img src={bot} alt="AI Bot" className="w-20 h-20 object-cover rounded-full mr-4" />
                <div className="font-semibold text-lg">Hello! I’m <span className="text-purple-600">BOOM</span><br />How may I help you?</div>
            </div>
            {showHistory ? (
                <div className="overflow-y-auto h-48 flex-1 space-y-3">
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-sm">No conversation history yet.</p>
                    ) : (
                        <div>{renderHistory()}</div>
                    )}
                </div>) : (
                <><div className="mt-4 text-gray-800 text-sm overflow-auto max-h-32 border p-2 rounded bg-gray-50">
                    {loading ? "Thinking..." : response}
                </div><div className="flex gap-2 mt-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 px-3 py-1 rounded text-sm" />
                        <button
                            onClick={handleSend}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded text-sm"
                        >
                            Send
                        </button>
                    </div></>
            )}
        </div>
    );
}
