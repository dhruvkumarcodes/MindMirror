
import { useState } from 'react'
import '../App.css'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CreateContent } from '../components/CreateContent'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Sidebar } from '../components/Sidebar'


export function DashBoard() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div>
      <Sidebar />
      <div className='p-4 ml-72 min-h-screen bg-gray-100 border-2'>
        <CreateContent open={modalOpen} onClose={() => {
          setModalOpen(false);
        }} />

        <div className='flex justify-end'>
          <Button onClick={() => { setModalOpen(true) }} variant="primary" text="Add content" size="md" startIcon={<PlusIcon size="lg" />}></Button>
          <Button variant="secondary" text="Share Brain" size="md" startIcon={<ShareIcon size="lg" />}></Button>
        </div>
        <div className="flex">
          <Card type="tweet" link="https://x.com/narendramodi/status/1948401072080375871" title="firstTweet" />
          <Card type="video" link="https://youtu.be/rxKcepXQgU4?si=DgW-2pAbMm9y0Lyf" title="firstvideo" />
        </div>
      </div>
    </div>
  )
}

export default DashBoard;

