import { useState } from 'react';
import { useVisitsContext } from '../hooks/useVisitsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../pages/Modal'; // Import your Modal component
import { useEffect } from 'react';

const VisitDetails = ({ visit }) => {
  const { dispatch } = useVisitsContext();
  // fetching workouts
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...visit });
  const [currentVisit, setCurrentVisit] = useState({ ...visit });
  const [loading, setLoading] = useState(false);
  const [fetched_users, setFetchedUsers] = useState([]);

  const Loader = () => {
    return <div className="spinner"></div>;
  };

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/visits/' + visit._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_VISIT', payload: json });
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user){
      return;
    }

    setLoading(true);

    const response = await fetch('/api/visits/' + visit._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_VISIT', payload: json });
      setCurrentVisit(json);
    }

    setLoading(false);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/workouts/admin", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_WORKOUTS", payload: json });
          setFetchedUsers(json);
        } else {
          console.error("Failed to fetch workouts:", response.status);
        }
      } catch (error) {
        console.error("Error fetching workouts:", error.message);
      }
    };

    if (user) {
      fetchWorkouts();

    }
  }, [dispatch, user]);

  const getSalesOfficerName = (id) => {
    const salesOfficer = fetched_users.find(user => user._id === id);
    return salesOfficer ? salesOfficer.full_name : <Loader />;
  };

  return (
    <div className="workout-details" onClick={handleEditClick} style={{ cursor: 'pointer' }}>
      <h4>{getSalesOfficerName(currentVisit.sales_officer)}</h4> 

      <div
        className="workout-detail-header"
        style={{ display: "flex", justifyContent: "space-between", paddingRight: "14vh" }}
      >
        <p><strong>Area: </strong>{currentVisit.area}</p>
        <p style={{ paddingRight: "8vh", paddingBottom: "1vh" }}><strong>Km Done:</strong>{currentVisit.km_done}</p>


      </div>

      <p style={{ paddingTop: "1.5vh" }}><strong>Created At: </strong>{new Date(currentVisit.createdAt).toLocaleString()}</p>
      <span  style={{backgroundColor:"#C0E9BB", color:"#012F4F"}} className="material-symbols-outlined" onClick={handleClick}>delete</span>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Daily Visit</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
          <label>Sales Officer:</label>
            <select
            name="sales_officer"
            onChange={handleChange}
            value={formData.sales_officer}
            style={{width: "100%", padding: "10px", borderRadius: "5px", minHeight: "40px"}}
          >
             <option value="">Select Sales Officer</option>
              {fetched_users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.full_name}
          </option>
            ))}
            </select>
          </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Area:</label>
              <input
                type="text"
                name="area"
                onChange={handleChange}
                value={formData.area}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                onChange={handleChange}
                value={formData.description}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Km Done:</label>
              <input
                type="number"
                name="km_done"
                onChange={handleChange}
                value={formData.km_done}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                onChange={handleChange}
                value={formData.location}
              />
            </div>

            <button type="submit" style={{ padding: "10px 20px", borderRadius: "25px", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}>
              {loading ? <span className="spinner"></span> : null}
              {loading ? 'Submitting...' : 'Submit'}
            </button>

          </form>
        </div>
      </Modal>
    </div>
  );
};

export default VisitDetails;
