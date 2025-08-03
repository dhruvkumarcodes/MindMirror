"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const geminiResponse = (command) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const API_KEY = process.env.GEMINI_API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
        const prompt = `Your name is BOOM — a smart, friendly, and efficient virtual assistant created by Dhruv. You live inside a web application and are here to help users with everyday tasks, questions, and ideas.
Be friendly!!! Be Concise and Stick to important information.

only respond with JSON objects, nothing else.
now your userTnput- ${command}
`;
        const result = yield axios_1.default.post(`${API_URL}?key=${API_KEY}`, {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        });
        return result.data.candidates[0].content.parts[0].text;
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = geminiResponse;
