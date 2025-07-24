
import './App.css'
import { Button } from './components/Button'
import { PlusIcon } from './icons/PlusIcon'

function App() {


  return (
    <>
      <Button startIcon={<PlusIcon size='md' />} variant="primary" text="share" size='lg'></Button>
      <Button variant="secondary" text="add content" size='md'></Button>
    </>
  )
}

export default App
