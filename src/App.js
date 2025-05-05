import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Contact from './pages/Contact';
import AdminContactMessages from './pages/AdminContactMessages';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/contact-messages" element={<AdminContactMessages />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
