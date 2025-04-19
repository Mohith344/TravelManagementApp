// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePackage from './pages/CreatePackage';
import ViewPackages from './pages/ViewPackages';
import EditPackage from './pages/EditPackage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-package" element={<CreatePackage />} />
          <Route path="/view-packages" element={<ViewPackages />} />
          <Route path="/edit-package/:id" element={<EditPackage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
