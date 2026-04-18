import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';

// route protection
const PrivateRoute = ({children}: {children: React.ReactNode}) =>{
  const {user, loading} = useAuth();
  if(loading){
    return <div>Loading...</div>
  }
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute>
            <div className="p-8">
                <h1 className="text-3xl font-bold">Welcome to the Dashboard!</h1>
            </div>
          </PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>           
  )
}

export default App;
