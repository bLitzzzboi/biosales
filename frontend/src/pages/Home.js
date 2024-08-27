import { useEffect, useState } from 'react';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProductsContext } from '../hooks/useProductsContext';



// components
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';
import Receipts from './Receipts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Users from './Users';
import Orders from './Orders';
import Products from './Products';
import Farmer_Meetings from './Farmer_Meetings';
import Daily_Visits from './Daily_Visits';
import Workouts from './Workouts';
import Dealers from './Dealers';
import Policys from './Policys';
import CreditNotes from './CreditNotes';
// import './Home.css';

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { products, dispatch_prod } = useProductsContext();
  const { user } = useAuthContext();
  const [activePage, setActivePage] = useState('workouts'); // State to track active page

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('/api/workouts', {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: 'SET_WORKOUTS', payload: json });
        } else {
          // Handle error scenarios
          console.error('Failed to fetch workouts:', response.status);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch_prod({ type: 'SET_PRODUCTS', payload: json });
        } else {
          // Handle error scenarios
          console.error('Failed to fetch products:', response.status);
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };


    if (user) {
      fetchWorkouts();
      fetchProducts();
    }
  }, [dispatch, user, dispatch_prod]);

  const handlePageChange = (pageName) => {
    setActivePage(pageName); // Update active page based on sidebar click
  };

  return (
    <div className="home">
      {/* Sidebar component */}
      <Sidebar activePage={activePage} onPageChange={handlePageChange} />

      {/* Main content area */}
      <div className="content">
        {activePage === 'workouts' && (
          <Workouts />
        )}

        {/* {activePage === 'addWorkout' && (
          <WorkoutForm />
        )} */}

        {activePage === 'users' && (
          <Users />
        )}

        {activePage === 'receipts' && (
          <Receipts />
        )}

        {activePage === 'orders' && (
          <Orders />
        )}

        {activePage === 'products' && (
          <Products />
        )}

        {activePage === 'Farmer_Meetings' && (
          <Farmer_Meetings />
        )}

        {activePage === 'Daily_Visits' && (
          <Daily_Visits />
        )}

        {activePage === 'Dealers' && (
          <Dealers />
        )}
         {activePage === 'Policys' && (
          <Policys />
        )}
         {activePage === 'CreditNotes' && (
          <CreditNotes />
        )}


        {/* Add more pages as needed */}
      </div>
    </div>
  );
};

export default Home;
