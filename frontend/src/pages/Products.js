import React, { useState, useEffect } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import ProductDetails from "../components/ProductDetails";
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const Products = () => {
  const { products, dispatch } = useProductsContext();
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [packs_in_carton, setPacks_in_carton] = useState('');
  const [policies, setPolicies] = useState([]);
  const [packSizes, setPackSizes] = useState([]);
  const [policyName, setPolicyName] = useState('');
  const [policyMultiplier, setPolicyMultiplier] = useState('');
  const [packSize, setPackSize] = useState('');
  const [pricePerPack, setPricePerPack] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddPolicy = () => {
    if (policyName && policyMultiplier) {
      setPolicies(prev => [...prev, { name: policyName, multiplier: policyMultiplier }]);
      setPolicyName('');
      setPolicyMultiplier('');
    }
  };

  const handleAddPackSize = () => {
    if (packSize && pricePerPack) {
      setPackSizes(prev => [...prev, { size: packSize, price_per_pack: pricePerPack }]);
      setPackSize('');
      setPricePerPack('');
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setName(product.name);
    setPacks_in_carton(product.packs_in_carton);
    setPolicies(product.policies || []);
    setPackSizes(product.pack_sizes || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in');
      return;
    }

    const product = {
      name,
      packs_in_carton,
      policies,
      pack_sizes: packSizes
    };

    const method = selectedProduct ? 'PUT' : 'POST';
    const url = selectedProduct ? `/api/products/${selectedProduct._id}` : '/api/products';
    try {
      const response = await fetch(url, {
        method,
        body: JSON.stringify(product),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        setEmptyFields(errorData.emptyFields || []);
      } else {
        const json = await response.json();
        dispatch({ type: selectedProduct ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT', payload: json });
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting product:', error.message);
      setError('Failed to submit product. Please try again.');
    }
  };

  const resetForm = () => {
    setName('');
    setPacks_in_carton('');
    setPolicies([]);
    setPackSizes([]);
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_PRODUCTS", payload: json });
        } else {
          console.error("Failed to fetch products:", response.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [dispatch, user]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = (products || []).filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="workouts" style={{ width: "100vh", marginLeft: "50vh" }}>
      <div className="workouts-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#012F4F" }}>
        <h3>Products</h3>
        <div className="workout-detail-header" style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            type="text"
            placeholder="Search Product"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginRight: "20px", width: "20vh", borderRadius: "25px", border: "1px solid grey" }}
          />
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: "#C0E9BB",
              color: "white",
              cursor: "pointer",
              height: "40px",
              marginTop: "6px",
              color: "#012F4F",
              fontWeight: "bold",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {filteredProducts &&
          filteredProducts.map((product) => (
            <LazyProductDetails key={product._id} product={product} />
          ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => resetForm()}>
        <h2>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label>Product Name:</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={emptyFields.includes('name') ? 'error' : ''}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Packs in Carton:</label>
              <input
                type="text"
                onChange={(e) => setPacks_in_carton(e.target.value)}
                value={packs_in_carton}
                className={emptyFields.includes('packs_in_carton') ? 'error' : ''}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <h4>Policies</h4>
              <label>Policy Name:</label>
              <input
                type="text"
                onChange={(e) => setPolicyName(e.target.value)}
                value={policyName}
                placeholder="e.g., Retail, Wholesale"
              />
              <label>Multiplier:</label>
              <input
                type="number"
                step="0.01"
                onChange={(e) => setPolicyMultiplier(e.target.value)}
                value={policyMultiplier}
                placeholder="e.g., 1.2"
              />
              <button type="button" onClick={handleAddPolicy}>
                Add Policy
              </button>
            </div>
            {policies.map((policy, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <strong>{policy.name}:</strong> Multiplier = {policy.multiplier}
              </div>
            ))}
            <div style={{ marginBottom: "10px" }}>
              <h4>Pack Sizes</h4>
              <label>Pack Size:</label>
              <input
                type="text"
                onChange={(e) => setPackSize(e.target.value)}
                value={packSize}
                placeholder="e.g., 200ml"
              />
              <label>Price Per Pack:</label>
              <input
                type="number"
                onChange={(e) => setPricePerPack(e.target.value)}
                value={pricePerPack}
                placeholder="e.g., 10.00"
              />
              <button type="button" onClick={handleAddPackSize}>
                Add Pack Size
              </button>
            </div>
            {packSizes.map((pack, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <strong>Size:</strong> {pack.size} - <strong>Price Per Pack:</strong> ${pack.price_per_pack}
              </div>
            ))}
            <button type="submit" style={{ padding: "10px 20px", borderRadius: "25px", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}>
              Submit
            </button>
          </form>
       

        </div>
      </Modal>
    </div>
  );
};

const LazyProductDetails = ({ product }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView ? <ProductDetails product={product} /> : null}
    </div>
  );
};

export default Products;
