import { useState } from 'react';
import { useProductsContext } from '../hooks/useProductsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../pages/Modal'; // Import your Modal component

const ProductDetails = ({ product }) => {
  const { dispatch } = useProductsContext();
  const { user } = useAuthContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...product });
  const [currentProduct, setCurrentProduct] = useState({ ...product });
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/products/' + product._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_PRODUCT', payload: json });
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

    const response = await fetch('/api/products/' + product._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: json });
      setCurrentProduct(json);
    }

    setLoading(false);
    setIsEditModalOpen(false);
  };

  return (
    <div className="workout-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      
      <div className="workout-details" onClick={handleEditClick} style={{ cursor: 'pointer', textAlign: 'center', 
            border: '1px solid #ddd', padding: '16px', borderRadius: '8px', width:'25vh', height:'20vh'}}>
          {/* <img src={currentProduct.active_ingredient} alt="Description of Image" style={{ width: 'auto', paddingTop:'3vh', height: '10vh',transform: 'scale(1.5)' }} /> */}
        <h4 style={{paddingTop: '5vh'}}>{currentProduct.name}</h4>
        <p><strong>Price Per Pack (Rs): </strong>{currentProduct.price_per_pack}</p>
        <p style={{ paddingTop: '1.5vh' }}><strong>Created At: </strong>{new Date(currentProduct.createdAt).toLocaleString()}</p>
        <span  style={{backgroundColor:"#C0E9BB", color:"#012F4F"}} className="material-symbols-outlined" onClick={handleClick}>delete</span>

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <h2>Edit Product</h2>
          <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
            <form onSubmit={handleSubmit}>
              {/* <div style={{ marginBottom: '10px' }}>
                <label>Active Ingredient:</label>
                <input
                  type="text"
                  name="active_ingredient"
                  onChange={handleChange}
                  value={formData.active_ingredient}
                />
              </div> */}

              {/* <div style={{ marginBottom: '10px' }}>
                <label>Formulation:</label>
                <input
                  type="text"
                  name="formulation"
                  onChange={handleChange}
                  value={formData.formulation}
                />
              </div> */}

              {/* <div style={{ marginBottom: '10px' }}>
                <label>Crops:</label>
                <input
                  type="text"
                  name="crops"
                  onChange={handleChange}
                  value={formData.crops}
                />
              </div> */}

              {/* <div style={{ marginBottom: '10px' }}>
                <label>Pests:</label>
                <input
                  type="text"
                  name="pests"
                  onChange={handleChange}
                  value={formData.pests}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label>Dosage:</label>
                <input
                  type="text"
                  name="dosage"
                  onChange={handleChange}
                  value={formData.dosage}
                />
              </div> */}

              <div style={{ marginBottom: '10px' }}>
                <label>Packs in Carton:</label>
                <input
                  type="text"
                  name="packs_in_carton"
                  onChange={handleChange}
                  value={formData.packs_in_carton}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label>Price Per Pack:</label>
                <input
                  type="number"
                  name="price_per_pack"
                  onChange={handleChange}
                  value={formData.price_per_pack}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label>Price Per Carton:</label>
                <input
                  type="number"
                  name="price_per_carton"
                  onChange={handleChange}
                  value={formData.price_per_carton}
                />
              </div>

              <button type="submit" style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
                {loading ? <span className="spinner"></span> : null}
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProductDetails;
