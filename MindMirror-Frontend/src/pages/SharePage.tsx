// pages/SharePage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Card } from "../components/Card";

export function SharePage() {
    const { shareHash } = useParams();
    const [content, setContent] = useState([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSharedContent = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/v1/brain/${shareHash}`);
                setContent(res.data.content);
                setUsername(res.data.user);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load shared content", error);
                setLoading(false);
            }
        };

        fetchSharedContent();
    }, [shareHash]);

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-4 min-h-screen bg-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Shared Brain of {username}</h2>
            <div className="flex flex-wrap gap-4">
                {content.map(({ type, title, link, content, createdAt }, index) => (
                    <Card
                        _id={index.toString()}
                        key={index}
                        type={type}
                        title={title}
                        link={link}
                        createdAt={createdAt}
                        content={content}
                        onDelete={() => console.log("You Can not delete")}
                    />
                ))}
            </div>
        </div>
    );
}
