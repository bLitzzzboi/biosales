import { useState } from 'react';
import { useCreditNotesContext } from '../hooks/useCreditNotesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../pages/Modal'; // Import your Modal component
import { useEffect } from 'react';

const CreditNoteDetails = ({ creditnote }) => {
  const { dispatch } = useCreditNotesContext();
  // fetching workouts
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...creditnote });
  const [currentCreditNote, setCurrentCreditNote] = useState({ ...creditnote });
  const [loading, setLoading] = useState(false);
  const [fetched_users, setFetchedUsers] = useState([]);

  const openLocationInMaps = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location}`;
    window.open(url, '_blank');
  };


  const Loader = () => {
    return <div className="spinner"></div>;
  };

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/creditnotes/' + creditnote._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_CREDITNOTE', payload: json });
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

    const response = await fetch('/api/creditnotes/' + creditnote._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_CREDITNOTE', payload: json });
      setCurrentCreditNote(json);
    }

    setLoading(false);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/dealers/admin", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_DEALERS", payload: json });
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

    return salesOfficer ? salesOfficer.business_name : <Loader />;
  };

  return (
    <div className="workout-details" onClick={handleEditClick} style={{ cursor: 'pointer' }}>
      <h4>{getSalesOfficerName(currentCreditNote.dealer_id)}</h4> 

      <div
        className="workout-detail-header"
        style={{ display: "flex", justifyContent: "space-between", paddingRight: "14vh" }}
      >
        <p><strong>Amount: </strong>{currentCreditNote.amount}</p>
        <p style={{ paddingRight: "8vh", paddingBottom: "1vh" }}><strong>Policy:</strong>{currentCreditNote.policy}</p>


      </div>

      <p style={{ paddingTop: "1.5vh" }}><strong>Created At: </strong>{new Date(currentCreditNote.createdAt).toLocaleString()}</p>
      <span  style={{backgroundColor:"#C0E9BB", color:"#012F4F"}} className="material-symbols-outlined" onClick={handleClick}>delete</span>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Credit Note</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
          <label>Dealer:</label>
            <select
            name="dealer_id"
            onChange={handleChange}
            value={formData.dealer_id}
            style={{width: "100%", padding: "10px", borderRadius: "5px", minHeight: "40px"}}
          >
             <option value="">Select Dealer</option>
              {fetched_users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.business_name}
          </option>
            ))}
            </select>
          </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Policy:</label>
              <input
                type="text"
                name="policy"
                onChange={handleChange}
                value={formData.policy}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                onChange={handleChange}
                value={formData.amount}
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

export default CreditNoteDetails;
