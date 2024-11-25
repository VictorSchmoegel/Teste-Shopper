import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Form from './components/form/Form'
import History from './components/history/History'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Form />} />
        <Route path='/history' element={<History />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
