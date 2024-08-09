import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
// import { ProductsContextProvider } from './context/ProductContext';


// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Users from './pages/Users'
import Receipts from './pages/Receipts'
import Orders from './pages/Orders'
import Products from './pages/Products'
import FarmerMeetings from './pages/Farmer_Meetings'
import DailyVisits from './pages/Daily_Visits'
import Dealers from './pages/Dealers'
import Policys from './pages/Policys';


function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
            <Route 
            path='/users'
            element={user ? <Users /> : <Navigate to="/login" />}
            component={Users}
            />
            <Route
            path='/receipts'
            element={user ? <Receipts /> : <Navigate to="/login" />}            
            component={Receipts}
            />
            <Route
            path='/orders'
            element={user ? <Orders /> : <Navigate to="/login" />}
            component={Orders}
            />
            <Route
            
            path='/products'
            element={user ? <Products /> : <Navigate to="/login" />}            
            component={Products}
            />
            <Route
            path='/Farmer_Meetings'
            element={user ? <FarmerMeetings /> : <Navigate to="/login" />}            
            component={Farmer_Meetings}
            />
            <Route
            path='/Daily_Visits'
            element={user ? <DailyVisits /> : <Navigate to="/login" />}
            />
            <Route
            path='/Dealers'
            element={user ? <Dealers /> : <Navigate to="/login" />}            
            component={Dealers}
            />
            <Route
            path='/Policys'
            element={user ? <Policys /> : <Navigate to="/login" />}            
            component={Policys}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
