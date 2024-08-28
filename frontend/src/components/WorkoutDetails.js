import { useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../pages/Modal'; // Import your Modal component

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...workout });
  const [currentWorkout, setCurrentWorkout] = useState({ ...workout });
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json });
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

    const response = await fetch('/api/workouts/' + workout._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_WORKOUT', payload: json });
      setCurrentWorkout(json);
    }

    setLoading(false);
    setIsEditModalOpen(false);
  };

  return (
    <div className="workout-details" onClick={handleEditClick} style={{ cursor: 'pointer' }}>
      <h4>{currentWorkout.full_name}</h4>

      <div
        className="workout-detail-header"
        style={{ display: "flex", justifyContent: "space-between", paddingRight: "14vh" }}
      >
        <p><strong>Designation: </strong>{currentWorkout.designation}</p>
        <p style={{ paddingBottom: "1vh" }}><strong>Sales Rs: </strong>{currentWorkout.sales}</p>
      </div>

      <div
        className="workout-detail-header"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "14vh" }}
      >
        <p><strong>Contact No: </strong>{currentWorkout.contact_no}</p>
        <p style={{ paddingBottom: "1vh" }}><strong>Cash Returned Rs: </strong>{currentWorkout.cash_returned}</p>
      </div>
      <div
        className="workout-detail-header"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "14vh" }}
      >
      <p style={{ paddingTop: "1vh" }}><strong>Area: </strong>{currentWorkout.area}</p>
      <p style={{ paddingTop: "1vh" }}><strong>Accounts Receivable: </strong>{currentWorkout.sales - currentWorkout.cash_returned}</p>
      </div>
      <p style={{ paddingTop: "1.5vh" }}><strong>Created At: </strong>{new Date(currentWorkout.createdAt).toLocaleString()}</p>
      <span style={{backgroundColor:"#C0E9BB", color:"#012F4F"}} className="material-symbols-outlined" onClick={handleClick}>delete</span>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit User</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          <form onSubmit={handleSubmit}>
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
              <label>Full Name:</label>
              <input
                type="text"
                name="full_name"
                onChange={handleChange}
                value={formData.full_name}
              />
            </div>

            {/* <div style={{ marginBottom: "10px" }}>
              <label>CNIC:</label>
              <input
                type="number"
                name="cnic"
                onChange={handleChange}
                value={formData.cnic}
              />
            </div> */}

            <div style={{ marginBottom: "10px" }}>
              <label>Designation:</label>
              <input
                type="text"
                name="designation"
                onChange={handleChange}
                value={formData.designation}
              />
            </div>
            
            <div style={{ marginBottom: "10px" }}>
              <label>Contact Number:</label>
              <input
                type="text"
                name="contact_no"
                onChange={handleChange}
                value={formData.contact_no}
              />
            </div>

            {/* <div style={{ marginBottom: "10px" }}>
              <label>Vehicle Number:</label>
              <input
                type="text"
                name="vehicle_number"
                onChange={handleChange}
                value={formData.vehicle_number}
              />
            </div> */}

            {/* <div style={{ marginBottom: "10px" }}>
              <label>Vehicle Make:</label>  
              <input
                type="text" 
                name="vehicle_make"
                onChange={handleChange}
                value={formData.vehicle_make}
              />
            </div> */}

            {/* <div style={{ marginBottom: "10px" }}>
              <label>Vehicle Model:</label> 
              <input
                type="text"
                name="vehicle_model"
                onChange={handleChange}
                value={formData.vehicle_model}
              />
            </div> */}

            <div style={{ marginBottom: "10px" }}>
              <label>Sales:</label>
              <input
                type="number"
                name="sales"
                onChange={handleChange}
                value={formData.sales}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Cash Returned:</label>
              <input
                type="number"
                name="cash_returned"
                onChange={handleChange}
                value={formData.cash_returned}
              />
            </div>


            <div style={{ marginBottom: "10px" }}>
              <label>ID: </label>
              <input
                type="text"
                name="id"
                onChange={handleChange}
                value={formData._id}
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

export default WorkoutDetails;
