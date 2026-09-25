import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ContactList from './pages/ContactList';
import ContactForm from './pages/ContactForm';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/ajouter" element={<ContactForm />} />
        <Route path="/modifier/:id" element={<ContactForm />} />
      </Routes>
    </>
  );
}
