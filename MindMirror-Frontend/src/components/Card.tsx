import { useEffect } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";

import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { getYouTubeEmbedUrl } from "./YoutubeUrl";


interface CardProps {
    _id: string;
    title: string;
    link: string;
    content: string;
    createdAt: string;
    type?: "video" | "tweet" | "text" | "textfile";
    onDelete: (id: string) => void;
}
export function Card({ _id, title, link, content, type, createdAt, onDelete }: CardProps) {
    const videoEmbedUrl = getYouTubeEmbedUrl(link);
    useEffect(() => {
        if (type === "tweet") {
            // Ensure Twitter widgets script is loaded
            const scriptId = "twitter-wjs";
            if (!document.getElementById(scriptId)) {
                const script = document.createElement("script");
                script.id = scriptId;
                script.src = "https://platform.twitter.com/widgets.js";
                script.async = true;
                document.body.appendChild(script);
            } else {
                //@ts-ignore
                window?.twttr?.widgets?.load();
            }
        }
    }, [type, link]);

    return (
        <div >
            <div className=" bg-white min-w-92 h-[400px] rounded-md border-gray-200  p-8 border flex flex-col m-1">
                <div className="flex justify-between ">
                    <div className="flex items-center text-md font-semibold">
                        <div className="text-gray-500 items-center pr-4">
                            {type === "video" && <YoutubeIcon />}
                            {type === "tweet" && <TwitterIcon />}
                            {type === "text" && <DocumentIcon />}
                        </div>
                        <div className="font-semibold text-lg">

                            {title}
                        </div>

                    </div>

                    <div className="flex">
                        <div className="pr-2 text-gray-500">
                            <a href={link} target="_blank">
                                {type != "text" && <LinkIcon />}
                            </a>
                        </div>

                        <div className="text-gray-500" onClick={() => onDelete(_id)}>
                            <DeleteIcon />
                        </div>
                    </div>
                </div>
                <div className="pt-4 overflow-y-auto flex-1">

                    {type === "video" && videoEmbedUrl && (
                        <iframe
                            className="w-full aspect-video"
                            src={videoEmbedUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    )}


                    {type === "tweet" && <blockquote className="twitter-tweet"><a href={link.replace("x.com", "twitter.com")}></a></blockquote>}

                    {type === "text" && (
                        <div className="font-bold">
                            {content}
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</div>
            </div>

        </div>
    );
}