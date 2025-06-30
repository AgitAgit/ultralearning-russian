import './App.css'
import PingServer from './components/PingServer'
import PdfToServerConverter from './components/PdfToServer'
import StateCenter from './components/StateCenter'
import Display from './pages/Display'

function App() {

  return (
    <>
      <StateCenter>
        {/* <PingServer></PingServer> */}
        {/* <PdfToServerConverter></PdfToServerConverter> */}
        <Display />
      </StateCenter>
    </>
  )
}

export default App
