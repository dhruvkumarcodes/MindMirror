
import { useEffect, useState } from 'react'
import '../App.css'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CreateContent } from '../components/CreateContent'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Sidebar } from '../components/Sidebar'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { CreateTextContent } from '../components/CreateTextContent'
import { Boom } from '../components/Boom'

type ContentType = {
  _id: string;
  type: "video" | "tweet" | "text" | "textfile";
  link: string;
  createdAt: string;
  content: string;
  title: string;
};

export function DashBoard() {
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState<ContentType[]>([]);
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        });
        setContent(response.data.content);
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    };
    fetchContent();
    const intervalId = setInterval(fetchContent, 10000);
    return () => clearInterval(intervalId);
  }, [])
  const handleDelete = async (id: string) => {
    try {

      await axios.delete(`${BACKEND_URL}/api/v1/brain/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        }
      });
      setContent(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error("Failed to delete content", error);
    }
  };
  return (
    <div>
      <Sidebar />
      <div className='p-4 ml-72 min-h-screen bg-gray-100 border-2'>
        <CreateContent open={modalOpen} onClose={() => {
          setModalOpen(false);
        }} />
        <CreateTextContent open={textModalOpen} onClose={() => {
          setTextModalOpen(false);
        }} />
        <div className='flex justify-end gap-2'>
          <Button onClick={() => { setTextModalOpen(true) }} variant="primary" text="Add Document" size="md" startIcon={<PlusIcon size="lg" />}></Button>
          <Button onClick={() => { setModalOpen(true) }} variant="primary" text="Add content" size="md" startIcon={<PlusIcon size="lg" />}></Button>
          <Button onClick={async () => {
            try {
              const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                share: true,
              }, {
                headers: {
                  "Authorization": localStorage.getItem("token")
                }
              });

              const shareHash = response.data.hash;

              // Dynamically get current domain (works on local + production)
              const shareUrl = `${window.location.origin}/share/${shareHash}`;

              // Show and copy to clipboard
              await navigator.clipboard.writeText(shareUrl);
              alert(`Shareable link copied:\n${shareUrl}`);
            } catch (err) {
              console.error("Error generating share URL:", err);
              alert("Failed to generate share URL.");
            }
          }} variant="secondary" text="Share Brain" size="md" startIcon={<ShareIcon size="lg" />}></Button>
        </div>
        <div className="flex flex-wrap">
          {content.map(({ _id, type, link, title, createdAt, content }) =>
            <Card
              key={_id}
              _id={_id}
              type={type}
              content={content}
              createdAt={createdAt}
              title={title}
              link={link}
              onDelete={handleDelete}
            />
          )}
        </div>
        {/* VA */}
        <div className="fixed bottom-5 right-5  ">
          <Boom />
        </div>
      </div>
    </div>
  )
}

export default DashBoard;

