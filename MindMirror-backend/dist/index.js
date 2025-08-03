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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const zod_1 = require("zod");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const extra_1 = require("./extra");
const cors_1 = __importDefault(require("cors"));
const geminichat_1 = __importDefault(require("./geminichat"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const userSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
app.post('/api/v1/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error });
    }
    const { username, password } = result.data;
    try {
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.UserModel.create({ username, password: hashedPassword });
        res.json({ message: "User signed up" });
    }
    catch (err) {
        res.status(500).json({ error: "error in sign up" });
    }
}));
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingUser = yield db_1.UserModel.findOne({ username });
    if (!existingUser) {
        return res.status(401).json({ error: "Invalid username" });
    }
    const isMatch = yield bcrypt_1.default.compare(password, existingUser.password);
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
    }
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, config_1.JWT_PASSWORD);
        res.json({ token });
    }
    else {
        res.status(401).json({ error: "Invalid username or password" });
    }
}));
app.post('/api/v1/content', middleware_1.userMiddleware, (req, res) => {
    const { title, link, type, content } = req.body;
    db_1.ContentModel.create({
        title,
        link,
        type,
        content,
        //@ts-ignore
        userId: req.userId,
        tags: [],
    });
    res.json({ message: "Content created" });
});
app.get('/api/v1/content', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({ content });
}));
app.delete('/api/v1/brain/:id', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log("Delete request for ID:", id);
    //@ts-ignore
    console.log("Authenticated user ID:", req.userId);
    try {
        const result = yield db_1.ContentModel.findOneAndDelete({
            _id: id,
            //@ts-ignore
            userId: req.userId
        });
        if (!result) {
            return res.status(404).json({ error: "Content not found" });
        }
        res.json({ message: "Content deleted" });
    }
    catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ error: "Error deleting content" });
    }
}));
app.post('/api/v1/brain/share', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_1.LinkModel.findOne({
            //@ts-ignore
            userId: req.userId,
        });
        if (existingLink) {
            return res.json({ hash: existingLink.hash });
        }
        try {
            const hash = (0, extra_1.random)(10);
            yield db_1.LinkModel.create({
                //@ts-ignore
                userId: req.userId,
                hash: hash
            });
            res.json({
                hash: hash,
            });
        }
        catch (error) {
            res.status(500).json({ error: "Error creating share link" });
            return;
        }
    }
    else {
        yield db_1.LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId,
        });
        res.json({
            message: "Share link deleted",
        });
    }
}));
app.get('/api/v1/brain/:shareLink', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link) {
        return res.status(404).json({ error: "Share link not found" });
        return;
    }
    const content = yield db_1.ContentModel.find({
        //@ts-ignore
        userId: link.userId
    });
    const user = yield db_1.UserModel.findOne({
        //@ts-ignore
        _id: link.userId
    });
    if (!content || !user) {
        return res.status(404).json({ error: "Content or user not found" });
        return;
    }
    res.json({
        user: user.username,
        content: content
    });
}));
app.post('/api/v1/boom', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }
    try {
        const boomReply = yield (0, geminichat_1.default)(prompt);
        res.json({ reply: boomReply });
    }
    catch (error) {
        console.error("Error generating Gemini response:", error);
        res.status(500).json({ error: "Failed to get response from BOOM" });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
