import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ContentModel, LinkModel, UserModel } from './db';
import { z } from 'zod';
import { JWT_PASSWORD } from './config';
import { userMiddleware } from './middleware';
import { random } from './extra';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const userSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

app.post('/api/v1/signup', async (req, res) => {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error });
    }

    const { username, password } = result.data;
    try {
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({ username, password: hashedPassword });
        res.json({ message: "User signed up" });
    } catch (err) {
        res.status(500).json({ error: "error in sign up" });
    }
});

app.post('/api/v1/signin', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
        return res.status(401).json({ error: "Invalid username" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
    }

    if (existingUser) {
        const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);
        res.json({ token });
    } else {
        res.status(401).json({ error: "Invalid username or password" });
    }
});

app.post('/api/v1/content', userMiddleware, (req, res) => {
    const { title, link } = req.body;
    ContentModel.create({
        title,
        link,

        //@ts-ignore
        userId: req.userId,
        tags: [],
    });
    res.json({ message: "Content created" });
});


app.get('/api/v1/content', userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({ content });
});

app.delete('/api/v1/brain/content', userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    }
    );
});

app.post('/api/v1/brain/share', userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId,
        });
        if (existingLink) {
            return res.status(400).json({ error: "Share link already exists" });
            return;
        }

        try {

            const hash = random(10);
            await LinkModel.create({
                //@ts-ignore
                userId: req.userId,
                hash: hash
            });
            res.json({
                message: hash,
            });
        } catch (error) {
            res.status(500).json({ error: "Error creating share link" });
            return;
        }
    } else {
        await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId,
        })
        res.json({
            message: "Share link deleted",
        });
    }

});

app.get('/api/v1/brain/:shareLink', async (req, res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({ hash });
    if (!link) {
        return res.status(404).json({ error: "Share link not found" });
        return;
    }
    const content = await ContentModel.find({
        //@ts-ignore
        userId: link.userId
    })
    const user = await UserModel.findOne({
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
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
