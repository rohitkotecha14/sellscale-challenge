import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Portfolio from './pages/Portfolio';
import Stocks from './pages/Stocks';  // Import the Stocks page
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';  // Import the ProtectedRoute
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={
              <>
                <Navbar /> {/* Navbar is part of the protected layout */}
                <Portfolio />
              </>
            } />
            <Route path="/stocks" element={
              <>
                <Navbar /> {/* Navbar is part of the protected layout */}
                <Stocks />
              </>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
