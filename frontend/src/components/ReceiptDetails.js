import { useState } from 'react';
import { useReceiptsContext } from '../hooks/useReceiptsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../pages/Modal'; // Import your Modal component
import { useEffect } from 'react';
import ImagePreview from "../pages/ImagePreview";
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';

const ReceiptDetails = ({ receipt }) => {
  const { dispatch } = useReceiptsContext();
  // fetching workouts
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...receipt });
  const [currentReceipt, setCurrentReceipt] = useState({ ...receipt });
  const [loading, setLoading] = useState(false);
  const [fetched_users, setFetchedUsers] = useState([]);
  const [depositslip_img, setDepositslipImg] = useState(receipt.depositslip_img);

  const Loader = () => {
    return <div className="spinner"></div>;
  };

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/receipts/' + receipt._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_RECEIPT', payload: json });
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('/api/receipts/' + receipt._id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });
  
      const json = await response.json();
  
      if (formData.status === 'Verified') {
        console.log('Verified');
  
        const currentSalesResponse = await fetch(`/api/workouts/${formData.sales_officer}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
        });
  
        const currentSalesData = await currentSalesResponse.json();
        const my_sales = currentSalesData.cash_returned;
        console.log(my_sales);
  
        const toUpdate = {
          cash_returned: formData.amount + my_sales,
        };
  
        const updateCashResponse = await fetch(`/api/workouts/${formData.sales_officer}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(toUpdate)
        });
  
        const updateCashJson = await updateCashResponse.json();
  
        if (updateCashResponse.ok) {
          console.log('Cash Updated');
        } else {
          console.error('Failed to update cash:', updateCashJson);
        }
      }
  
      if (response.ok) {
        dispatch({ type: 'UPDATE_RECEIPT', payload: json });
        setCurrentReceipt(json);
      } else {
        console.error('Failed to update receipt:', json);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
    }
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
      <h4>{getSalesOfficerName(currentReceipt.sales_officer)}</h4> 

      <div
        className="workout-detail-header"
        style={{ display: "flex", justifyContent: "space-between", paddingRight: "14vh" }}
      >
        <p><strong>Deposit Slip No: </strong>{currentReceipt.deposit_slip_no}</p>
        <p style={{ paddingBottom: "1vh" }}><strong>Status:</strong>{currentReceipt.status}</p>


      </div>

      <div
        className="workout-detail-header"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "14vh" }}
      >
        <p><strong>Dealer: </strong>{currentReceipt.dealer}</p>
        <p style={{ paddingBottom: "1vh" }}><strong>Amount Rs: </strong>{currentReceipt.amount}</p>
      </div>

      <p style={{ paddingTop: "1vh" }}><strong>Bank: </strong>{currentReceipt.bank}</p>
      <p style={{ paddingTop: "1.5vh" }}><strong>Created At: </strong>{new Date(currentReceipt.createdAt).toLocaleString()}</p>
      <span style={{backgroundColor:"#C0E9BB", color:"#012F4F"}} className="material-symbols-outlined" onClick={handleClick}>delete</span>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Receipt</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
        <label htmlFor="depositslip_img" style={{
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
                        Choose Deposit Slip Image
                        <input type="file" id="depositslip_img" name="DepositSlip" onChange={(e) => handleUpload(e, setDepositslipImg)} style={{ display: 'none', }} />
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
              <label>Status:</label>
              <select
                name="status"
                onChange={handleChange}
                value={formData.status}
                style={{width: "100%", padding: "10px", borderRadius: "5px", minHeight: "40px"}}

              >
                <option value="">Select Status</option>
                <option value="Verified">Verified</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Dealer:</label>
              <input
                type="text"
                name="dealer"
                onChange={handleChange}
                value={formData.dealer}
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
              <label>Bank:</label>
              <input
                type="text"
                name="bank"
                onChange={handleChange}
                value={formData.bank}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Deposit Slip No:</label>
              <input
                type="text"
                name="deposit_slip_no"
                onChange={handleChange}
                value={formData.deposit_slip_no}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Deposit Slip Image:</label>
              <input
                type="text"
                name="depositslip_img"
                onChange={handleChange}
                value={formData.depositslip_img}
              />
            </div>

            <div style={{ marginBottom: "13px" }}>
            <ImagePreview url={depositslip_img}>
              View Deposit Slip Image
            </ImagePreview>
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

export default ReceiptDetails;
