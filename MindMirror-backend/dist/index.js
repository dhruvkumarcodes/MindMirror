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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
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
    const { title, link } = req.body;
    db_1.ContentModel.create({
        title,
        link,
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
app.delete('/api/v1/brain/content', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield db_1.ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    });
}));
app.post('/api/v1/brain/share', middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        yield db_1.LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: (0, extra_1.random)(10)
        });
    }
    else {
        yield db_1.LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId,
        });
    }
    res.json({
        message: share ? "Share link created" : "Share link deleted"
    });
}));
app.get('/api/v1/brain/:shareLink', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = db_1.LinkModel.findOne({ hash });
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
        userid: link.userId
    });
    if (!content || !user) {
        return res.status(404).json({ error: "Content or user not found" });
        return;
    }
    res.json({
        user: user.username,
        contemt: content
    });
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
