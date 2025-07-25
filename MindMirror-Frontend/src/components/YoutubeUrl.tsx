export const getYouTubeEmbedUrl = (link: string): string | null => {
    try {
        const url = new URL(link);

        if (url.hostname === "youtu.be") {
            return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
        }

        if (url.hostname.includes("youtube.com")) {
            const videoId = url.searchParams.get("v");
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }

        return null;
    } catch {
        return null;
    }
};