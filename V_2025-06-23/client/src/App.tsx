import './App.css'
import PingServer from './components/PingServer'
import PdfToServerConverter from './components/PdfToServer'
import StateCenter from './components/StateCenter'
import Display from './pages/Display'

function App() {

  return (
    <>
      <StateCenter>
        <Display />
      </StateCenter>
    </>
  )
}

export default App
