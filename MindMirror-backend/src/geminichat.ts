
import axios from "axios";

const geminiResponse = async (command: string) => {
    try {
        const API_KEY = process.env.GEMINI_API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
        const prompt = `Your name is BOOM — a smart, friendly, and efficient virtual assistant created by Dhruv. You live inside a web application and are here to help users with everyday tasks, questions, and ideas.
Be friendly!!! Be Concise and Stick to important information.

only respond with JSON objects, nothing else.
now your userTnput- ${command}
`
        const result = await axios.post(`${API_URL}?key=${API_KEY}`, {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        })
        return result.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.log(error);
    }
}

export default geminiResponse;
