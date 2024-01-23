import './App.css'
import { BrowserRouter, Routes ,Route } from 'react-router-dom';
import ContactUsForm from './components/ContactUsForm'
import ContactDetails from './components/ContactDetails'

function App() {
  
  return (
  
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ContactUsForm/>} exact />
      <Route path="/details" element={<ContactDetails/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
