import { useState } from 'react';
import { useFarmerMeetingsContext } from '../hooks/useFarmerMeetingsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../pages/Modal'; // Import your Modal component
import { useEffect } from 'react';

const FarmerMeetingDetails = ({ farmermeeting }) => {
  const { dispatch } = useFarmerMeetingsContext();
  // fetching workouts
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...farmermeeting });
  const [currentFarmerMeeting, setCurrentFarmerMeeting] = useState({ ...farmermeeting });
  const [loading, setLoading] = useState(false);
  const [fetched_users, setFetchedUsers] = useState([]);

  const Loader = () => {
    return <div className="spinner"></div>;
  };

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/farmermeetings/' + farmermeeting._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_FARMER_MEETING', payload: json });
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

    const response = await fetch('/api/farmermeetings/' + farmermeeting._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_FARMER_MEETING', payload: json });
      setCurrentFarmerMeeting(json);
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
      <h4>{getSalesOfficerName(currentFarmerMeeting.sales_officer)}</h4> 

      <div
        className="workout-detail-header"
        style={{ display: "flex", justifyContent: "space-between", paddingRight: "14vh" }}
      >
        <p><strong>Host Farmer: </strong>{currentFarmerMeeting.farmer_name}</p>
        <p style={{ paddingBottom: "1vh" }}><strong>Total Expense Rs:</strong>{currentFarmerMeeting.total_expense}</p>


      </div>

      <div
        className="workout-detail-header"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "23.7vh" }}
      >
        <p><strong>Land Area: </strong>{currentFarmerMeeting.area_of_land}</p>
        {/* <p style={{ paddingBottom: "1vh" }}><strong>Amount:</strong>{currentReceipt.amount}</p> */}
      </div>

      <p style={{ paddingTop: "1vh" }}><strong>Participants: </strong>{currentFarmerMeeting.participant_no}</p>
      <p style={{ paddingTop: "1.5vh" }}><strong>Created At: </strong>{new Date(currentFarmerMeeting.createdAt).toLocaleString()}</p>
      <span  style={{backgroundColor:"#C0E9BB", color:"#012F4F"}} className="material-symbols-outlined" onClick={handleClick}>delete</span>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Farmer Meeting</h2>
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
              <label>Farmer Name:</label>
              <input
                type="text"
                name="farmer_name"
                onChange={handleChange}
                value={formData.farmer_name}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Area of Land:</label>
              <input
                type="text"
                name="area_of_land"
                onChange={handleChange}
                value={formData.area_of_land}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Address:</label>
              <input
                type="text"
                name="address"
                onChange={handleChange}
                value={formData.address}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Contact No:</label>
              <input
                type="text"
                name="contact_no"
                onChange={handleChange}
                value={formData.contact_no}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Participant No:</label>
                <input

                    type="text"
                    name="participant_no"
                    onChange={handleChange}
                    value={formData.participant_no}
                />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Total Expense:</label>
                <input
                type={"text"}
                    name="total_expense"
                    onChange={handleChange}
                    value={formData.total_expense}
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

export default FarmerMeetingDetails;
