import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
// Registro eliminado para mantener solo un administrador configurado
import Products from './pages/Products';
import Contact from './pages/Contact';
import AdminContactMessages from './pages/AdminContactMessages';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/login" element={<Login />} />
            {/* Ruta de registro eliminada para mantener solo un administrador configurado */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/contact-messages" element={<AdminContactMessages />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
