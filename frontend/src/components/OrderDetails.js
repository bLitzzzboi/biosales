import { useState, useEffect } from 'react';
import { useOrdersContext } from '../hooks/useOrdersContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../pages/Modal';
import ImagePreview from '../pages/ImagePreview';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const OrderDetails = ({ order }) => {
  const { dispatch } = useOrdersContext();
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...order });
  const [currentOrder, setCurrentOrder] = useState({ ...order });
  const [loading, setLoading] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [detailsPdf, setDetailsPdf] = useState('');
  const [dealerName, setDealerName] = useState('');

  const Loader = () => {
    return <div className="spinner"></div>;
  };

  const handleUpload = async (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = firebase.storage().ref();
      const folderPath = `${event.target.name}_Images`;
      const fileRef = storageRef.child(`${folderPath}/${file.name}`);

      setLoading(true);

      try {
        await fileRef.put(file);
        const url = await fileRef.getDownloadURL();
        setImage(url);
        setLoading(false);
        formData.details_pdf = url;
        alert('Upload successful!');
      } catch (error) {
        console.error('Error uploading file:', error.message);
        setLoading(false);
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

    if (!user) {
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

  const handleItemChange = (e, index, field) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: e.target.value };
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    setFormData({ ...formData, items: [...formData.items, { productId: '', quantity: 0, price: 0 }] });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
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

    const fetchDealer = async () => {
      try {
        const response = await fetch(`/api/dealers/${currentOrder.dealer}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          setDealerName(json.business_name);
        } else {
          console.error("Failed to fetch dealer:", response.status);
        }
      } catch (error) {
        console.error("Error fetching dealer:", error.message);
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
      fetchDealer();
    }
  }, [dispatch, user,currentOrder.dealer]);

  const getSalesOfficerName = (id) => {
    const salesOfficer = fetchedUsers.find(user => user._id === id);
    return salesOfficer ? salesOfficer.full_name : <Loader />;
  };

  const getProductName = (id) => {
    const product = fetchedProducts.find(product => product._id === id);
    return product ? product.name : <Loader />;
  };
  

  const EditableItemTile = ({ item, index }) => {
    return (
      <div style={tileStyle}>
        <label>Product:</label>
        <select
          name={`productId-${index}`}
          value={item.productId}
          onChange={(e) => handleItemChange(e, index, 'productId')}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}
        >
          <option value="">Select Product</option>
          {fetchedProducts.map(product => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>

        <label>Quantity:</label>
        <input
          type="number"
          name={`quantity-${index}`}
          value={item.quantity}
          onChange={(e) => handleItemChange(e, index, 'quantity')}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}
        />

        <label>Price:</label>
        <input
          type="number"
          name={`price-${index}`}
          value={item.price}
          onChange={(e) => handleItemChange(e, index, 'price')}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}
        />

        <button onClick={() => handleRemoveItem(index)} style={{ color: 'red', border: 'none', background: 'none' }}>
          Remove Item
        </button>
      </div>
    );
  };

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
        style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '14vh' }}
      >
        <p><strong>Dealer: </strong>{dealerName || <Loader />}</p>
        <p style={{ paddingBottom: '1vh' }}><strong>Status:</strong>{currentOrder.status}</p>
      </div>

      <div
        className="workout-detail-header"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '23.7vh' }}
      >
        <p><strong>Policy: </strong>{currentOrder.policy}</p>
        <p style={{ paddingBottom: '1vh' }}><strong>Amount:</strong>{currentOrder.amount}</p>
      </div>

      <p style={{ paddingTop: '1.5vh' }}><strong>Created At: </strong>{new Date(currentOrder.createdAt).toLocaleString()}</p>
      <span style={{ backgroundColor: '#C0E9BB', color: '#012F4F' }} className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2>Edit Order</h2>
        <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>Sales Officer:</label>
              <select
                name="sales_officer"
                onChange={handleChange}
                value={formData.sales_officer}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}
              >
                <option value="">Select Sales Officer</option>
                {fetchedUsers.map(user => (
                  <option key={user._id} value={user._id}>{user.full_name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Dealer:</label>
              <input
                type="text"
                name="dealer"
                onChange={handleChange}
                value={dealerName}
                style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Policy:</label>
              <input
                type="text"
                name="policy"
                onChange={handleChange}
                value={formData.policy}
                style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                onChange={handleChange}
                value={formData.amount}
                style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Status:</label>
              <input
                type="text"
                name="status"
                onChange={handleChange}
                value={formData.status}
                style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Details PDF:</label>
              <input type="file" name="details_pdf" onChange={(e) => handleUpload(e, setDetailsPdf)} />
              {loading ? <Loader /> : null}
              {detailsPdf && <ImagePreview url={detailsPdf} />}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Items:</label>
            </div>

            <div className="item-tiles" style={{ display: 'flex', flexWrap: 'wrap', marginBottom: "10px" }}>
              {formData.items.map((item, index) => (
                <EditableItemTile
                  key={index}
                  item={item}
                  index={index}
                />
              ))}
            </div>

            <button type="button" onClick={handleAddItem} style={{ marginBottom: '10px' }}>
              Add Item
            </button>

            <button type="submit" style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
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
