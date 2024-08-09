import { useState } from 'react';
import { useOrdersContext } from '../hooks/useOrdersContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../pages/Modal'; // Import your Modal component
import { useEffect } from 'react';
import ImagePreview from "../pages/ImagePreview";
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';

const OrderDetails = ({ order }) => {
  const { dispatch } = useOrdersContext();
  // fetching workouts
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...order });
  const [currentOrder, setCurrentOrder] = useState({ ...order });
  const [loading, setLoading] = useState(false);
  const [fetched_users, setFetchedUsers] = useState([]);
  const [fetched_products, setFetchedProducts] = useState([]);
  const [details_pdf, setDetails_pdf] = useState('');

  const Loader = () => {
    return <div className="spinner"></div>;
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
            formData.details_pdf = url;
            alert('Upload successful!');
        } catch (error) {
            console.error('Error uploading file:', error.message);
            setLoading(false); // End loading in case of error
            alert('Error uploading file. Please try again.');
        }
    }
};

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/orders/' + order._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_ORDER', payload: json });
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

    const response = await fetch('/api/orders/' + order._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_ORDER', payload: json });
      setCurrentOrder(json);
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

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_PRODUCTS", payload: json });
          setFetchedProducts(json);
        } else {
          console.error("Failed to fetch products:", response.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    if (user) {
      fetchWorkouts();
      fetchProducts();

    }
  }, [dispatch, user]);

  const getSalesOfficerName = (id) => {
    const salesOfficer = fetched_users.find(user => user._id === id);
    return salesOfficer ? salesOfficer.full_name : <Loader />;
  };

  const getProductName = (id) => {
    const product = fetched_products.find(product => product._id === id);
    return product ? product.name : <Loader />;
  };
  
  const ItemTile = ({ item }) => (
    <div style={tileStyle}>
      <p><strong>Product:</strong> {getProductName(item.productId)}</p>
      <p><strong>Quantity:</strong> {item.quantity}</p>
      <p><strong>Price:</strong> Rs {item.price}</p>
    </div>
  );

  // Styles for the tiles
  const tileStyle = {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    margin: '5px',
    width: '200px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  return (
    <div className="workout-details" onClick={handleEditClick} style={{ cursor: 'pointer' }}>
      <h4>{getSalesOfficerName(currentOrder.sales_officer)}</h4> 

      <div
        className="workout-detail-header"
        style={{ display: "flex", justifyContent: "space-between", paddingRight: "14vh" }}
      >
        <p><strong>Dealer: </strong>{currentOrder.dealer}</p>
        <p style={{ paddingBottom: "1vh" }}><strong>Status:</strong>{currentOrder.status}</p>


      </div>

      <div
        className="workout-detail-header"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "23.7vh" }}
      >
        <p><strong>Policy: </strong>{currentOrder.policy}</p>
        <p style={{ paddingBottom: "1vh" }}><strong>Amount:</strong>{currentOrder.amount}</p>
      </div>

      <p style={{ paddingTop: "1.5vh" }}><strong>Created At: </strong>{new Date(currentOrder.createdAt).toLocaleString()}</p>
      <span  style={{backgroundColor:"#C0E9BB", color:"#012F4F"}} className="material-symbols-outlined" onClick={handleClick}>delete</span>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Order</h2>
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
              <label>Items:</label>
            </div>

            <div className="item-tiles" style={{ display: 'flex', flexWrap: 'wrap',marginBottom: "10px" }}>
        {currentOrder.items.map(item => (
          <ItemTile key={item.productId} item={item} />
        ))}
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
                type="text"
                name="amount"
                onChange={handleChange}
                value={formData.amount}
              />
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
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Bilty Invoice:</label>
                <input
                type={"text"}
                    name="bilty_invoice"
                    onChange={handleChange}
                    value={formData.bilty_invoice}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Bilty Receipt:</label>
                <input
                type={"text"}
                    name="bilty_receipt"
                    onChange={handleChange}
                    value={formData.bilty_receipt}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Truck Number:</label>
                <input
                type={"text"}

                    name="truck_number"
                    onChange={handleChange}
                    value={formData.truck_number}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Truck Name:</label>
                <input
                type={"text"}
                
                    name="truck_name"
                    onChange={handleChange}
                    value={formData.truck_name}
                />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Truck Contact No.:</label>
                <input
                type={"text"}
                    name="truck_contact_no"
                    onChange={handleChange}
                    value={formData.truck_contact_no}
                />
            </div>

            <div style={{ marginBottom: "13px" }}>
            <ImagePreview url={details_pdf}>
              View Details PDF
            </ImagePreview>
            </div>

            <div style={{ marginBottom: "10px" }}>
            <label htmlFor="details_pdf" style={{
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
                        Choose Details PDF
                        <input type="file" id="details_pdf" name="details_pdf" onChange={(e) => handleUpload(e, setDetails_pdf)} style={{ display: 'none', }} />
                    </label>
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

export default OrderDetails;
