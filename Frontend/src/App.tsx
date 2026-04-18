import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

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
            <Dashboard/>
          </PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>           
  )
}

export default App;
