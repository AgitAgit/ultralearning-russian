import './App.css'
import PingServer from './components/PingServer'
import PdfToServerConverter from './components/PdfToServer'
import StateCenter from './components/StateCenter'

import LoginPage from './pages/LoginPage'
import Login from './components/Login'

function App() {

  return (
    <>
      <StateCenter>
        {/* <PingServer></PingServer> */}
        <br></br>
        {/* <PdfToServerConverter></PdfToServerConverter> */}
        {/* <LoginPage /> */}
        <Login/>
      </StateCenter>
    </>
  )
}

export default App
