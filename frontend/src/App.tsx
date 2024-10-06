import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Portfolio from './pages/Portfolio';
import Stocks from './pages/Stocks';  
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';  
import { AuthProvider } from './contexts/AuthContext';
import UserDetails from './pages/UserDetails';
import { getWalletBalance } from './services/wallet';
import InactivityTimer from './components/InactivityTimer';

const App = () => {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // Fetch the wallet balance when the app starts
  useEffect(() => {
    const fetchBalance = async () => {
      if (walletBalance === null) {
        try {
          const balance = await getWalletBalance();
          setWalletBalance(balance);
        } catch (err) {
          console.error('Failed to fetch wallet balance', err);
        }
      }
    };

    fetchBalance();
  }, [walletBalance]);

  // Function to update wallet balance after login or register
  const refreshWalletBalance = async () => {
    try {
      const balance = await getWalletBalance();
      setWalletBalance(balance);
    } catch (err) {
      console.error('Failed to fetch wallet balance after login/registration', err);
    }
  };

  return (
    <AuthProvider>
      <Router>
      <InactivityTimer />
        <Routes>
           {/* Public routes */}
           <Route path="/login" element={<Login refreshWalletBalance={refreshWalletBalance} />} /> {/* Pass refresh function */}
          <Route path="/register" element={<Register refreshWalletBalance={refreshWalletBalance} />} /> {/* Pass refresh function */}

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={
              <>
                <Navbar walletBalance={walletBalance} /> {/* Pass walletBalance */}
                <Portfolio />
              </>
            } />
            <Route path="/stocks" element={
              <>
                <Navbar walletBalance={walletBalance} /> {/* Pass walletBalance */}
                <Stocks />
              </>
            } />
            <Route path="/user-details" element={
              <>
                <Navbar walletBalance={walletBalance} /> {/* Pass walletBalance */}
                <UserDetails walletBalance={walletBalance} setWalletBalance={setWalletBalance} /> {/* Pass wallet state */}
              </>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
