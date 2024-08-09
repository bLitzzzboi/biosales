import { useState } from 'react';
import { useDealersContext } from '../hooks/useDealersContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../pages/Modal'; // Import your Modal component
import { useEffect } from 'react';
import ImagePreview from "../pages/ImagePreview";
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';



const DealerDetails = ({ dealer }) => {
  const { dispatch } = useDealersContext();
  // fetching workouts
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...dealer });
  const [currentDealer, setCurrentDealer] = useState({ ...dealer });
  const [loading, setLoading] = useState(false);
  const [fetched_users, setFetchedUsers] = useState([]);
  const [cnic_front_img, setCnic_front_img] = useState(dealer.cnic_front_img);
  const [cnic_back_img, setCnic_back_img] = useState(dealer.cnic_back_img);
  const [licence_img, setLicence_img] = useState(dealer.licence_img);


  const Loader = () => {
    return <div className="spinner"></div>;
  };

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/dealers/' + dealer._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_DEALER', payload: json });
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
        const storageRef = firebase.storage().ref();
        const folderPath = `${event.target.name}_Images`; // Path to the specific folder
        const fileRef = storageRef.child(`${folderPath}/${file.name}`);
        
        setLoading(true); // Start loading

        try {
            await fileRef.put(file);
            const url = await fileRef.getDownloadURL();
            setImage(url);
            setLoading(false); // End loading
            alert('Upload successful!');
        } catch (error) {
            console.error('Error uploading file:', error.message);
            setLoading(false); // End loading in case of error
            alert('Error uploading file. Please try again.');
        }
    }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user){
      return;
    }

    setLoading(true);

    const response = await fetch('/api/dealers/' + dealer._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_DEALER', payload: json });
      setCurrentDealer(json);
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

  const getSalesOfficerName = (id) => {
    const salesOfficer = fetched_users.find(user => user._id === id);
    return salesOfficer ? salesOfficer.full_name : <Loader />;
  };

  return (
    <div className="workout-details" onClick={handleEditClick} style={{ cursor: 'pointer' }}>
      <h4>{currentDealer.business_name}</h4> 

      <div
        className="workout-detail-header"
        style={{ display: "flex", justifyContent: "space-between", paddingRight: "14vh" }}
      >
        <p><strong>Sales Officer: </strong>{getSalesOfficerName(currentDealer.sales_officer)}</p>
        {/* <p style={{ paddingRight: "8vh", paddingBottom: "1vh" }}><strong>Status:</strong>{currentReceipt.status}</p> */}


      </div>

      <div
        className="workout-detail-header"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "23.7vh" }}
      >
        <p style={{paddingTop:"1vh"}}><strong>Address: </strong>{currentDealer.address}</p>
        {/* <p style={{ paddingBottom: "1vh" }}><strong>Amount:</strong>{currentReceipt.amount}</p> */}
      </div>

      <p style={{ paddingTop: "1vh" }}><strong>Personal Name: </strong>{currentDealer.personal_name}</p>
      <p style={{ paddingTop: "1.5vh" }}><strong>Created At: </strong>{new Date(currentDealer.createdAt).toLocaleString()}</p>
      <span style={{backgroundColor:"#C0E9BB", color:"#012F4F"}}  className="material-symbols-outlined" onClick={handleClick}>delete</span>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Dealer</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          
        <label htmlFor="cnic_front_img" style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        border: '2px solid #000',
                        borderRadius: '20px',
                        backgroundColor: '#f0f0f0',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: "14px",
                    }}>
                        Choose CNIC Front Image
                        <input type="file" id="cnic_front_img" name="CNIC_Front" onChange={(e) => handleUpload(e, setCnic_front_img)} style={{ display: 'none', }} />
                    </label>

                    <label htmlFor="cnic_back_img" style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        border: '2px solid #000',
                        borderRadius: '20px',
                        backgroundColor: '#f0f0f0',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: "14px",
                    }}>
                        Choose CNIC Back Image
                        <input type="file" id="cnic_back_img" name="CNIC_Back" onChange={(e) => handleUpload(e, setCnic_back_img)} style={{ display: 'none', }} />
                    </label>

                    <label htmlFor="licence_img" style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        border: '2px solid #000',
                        borderRadius: '20px',
                        backgroundColor: '#f0f0f0',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: "14px",
                    }}>
                        Choose Licence Image
                        <input type="file" id="licence_img" name="Licence" onChange={(e) => handleUpload(e, setLicence_img)} style={{ display: 'none', }} />
                    </label>

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
              <label>Business Name:</label>
              <input
                type="text"
                name="business_name"
                onChange={handleChange}
                value={formData.business_name}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Personal Name:</label>
              <input
                type="text"
                name="personal_name"
                onChange={handleChange}
                value={formData.personal_name}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>CNIC Front Image:</label>
              <input
                type="text"
                name="cnic_front_img"
                onChange={handleChange}
                value={formData.cnic_front_img}
              />
            </div>

            <div style={{ marginBottom: "13px" }}>
            <ImagePreview url={cnic_front_img}>
              View CNIC Front Image
            </ImagePreview>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>CNIC Back Image:</label>
              <input
                type="text"
                name="cnic_back_img"
                onChange={handleChange}
                value={formData.cnic_back_img}
              />
            </div>

            <div style={{ marginBottom: "13px" }}>
            <ImagePreview url={cnic_back_img}>
              View CNIC Back Image
            </ImagePreview>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Licence Image:</label>
              <input
                type="text"
                name="licence_img"
                onChange={handleChange}
                value={formData.licence_img}
              />
            </div>

            <div style={{ marginBottom: "13px" }}>
            <ImagePreview url={licence_img}>
              View Licence Image
            </ImagePreview>
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

export default DealerDetails;
