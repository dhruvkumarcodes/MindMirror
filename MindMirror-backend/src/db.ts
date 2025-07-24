import mongoose, { model, Schema } from 'mongoose';
import { required } from 'zod/v4/core/util.cjs';
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.DB_URI!);
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: { type: String },
    link: { type: String },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },

});
export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },

});
export const LinkModel = model("Links", LinkSchema);
