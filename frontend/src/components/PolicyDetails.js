import { useState } from 'react';
import { usePolicysContext } from '../hooks/usePolicysContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../pages/Modal'; // Import your Modal component
import { useEffect } from 'react';

const PolicyDetails = ({ policy }) => {
  const { dispatch } = usePolicysContext();
  // fetching workouts
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...policy });
  const [currentPolicy, setCurrentPolicy] = useState({ ...policy });
  const [loading, setLoading] = useState(false);
  const [fetched_users, setFetchedUsers] = useState([]);

  const Loader = () => {
    return <div className="spinner"></div>;
  };

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/policys/' + policy._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_POLICY', payload: json });
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

    const response = await fetch('/api/policys/' + policy._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_POLICY', payload: json });
      setCurrentPolicy(json);
    }

    setLoading(false);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/workouts", {
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

  // const getSalesOfficerName = (id) => {
  //   const salesOfficer = fetched_users.find(user => user._id === id);
  //   return salesOfficer ? salesOfficer.full_name : <Loader />;
  // };

  return (
    <div className="workout-details" onClick={handleEditClick} style={{ cursor: 'pointer' }}>
      <h4>{currentPolicy.policy_name}</h4> 

      <div
        className="workout-detail-header"
        style={{ display: "flex", justifyContent: "space-between", paddingRight: "14vh" }}
      >
        <p><strong>Multiplier: </strong>{currentPolicy.multiplier}</p>

      </div>

      <div
        className="workout-detail-header"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "23.7vh" }}
      >
        {/* <p style={{ paddingBottom: "1vh" }}><strong>Amount:</strong>{currentReceipt.amount}</p> */}
      </div>

      <p style={{ paddingTop: "1.5vh" }}><strong>Created At: </strong>{new Date(currentPolicy.createdAt).toLocaleString()}</p>
      <span  style={{backgroundColor:"#C0E9BB", color:"#012F4F"}} className="material-symbols-outlined" onClick={handleClick}>delete</span>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Policy</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: "10px" }}>
              <label>Policy Name:</label>
              <input
                type="text"
                name="policy_name"
                onChange={handleChange}
                value={formData.policy_name}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Multiplier:</label>
              <input
                type="text"
                name="multiplier"
                onChange={handleChange}
                value={formData.multiplier}
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

export default PolicyDetails;
