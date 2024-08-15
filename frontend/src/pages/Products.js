import React, { useState, useEffect, useCallback } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import ProductDetails from "../components/ProductDetails";
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';
import { useInView } from 'react-intersection-observer';

const Products = () => {
  const { products, dispatch } = useProductsContext();
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [packs_in_carton, setPacks_in_carton] = useState('');
  const [name, setName] = useState('');
  const [price_per_pack, setPrice_per_pack] = useState('');
  const [price_per_carton, setPrice_per_carton] = useState('');
  const [ImgURL, setImgURL] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [productVariations, setProductVariations] = useState([]);
  const [percentage, setPercentage] = useState('');
  const [packSize, setPackSize] = useState('');
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setPacks_in_carton(product.packs_in_carton);
    setName(product.name);
    setPrice_per_pack(product.price_per_pack);
    setPrice_per_carton(product.price_per_carton);

    if (product.variations) {
      setProductVariations(product.variations);
    }
  };

  const handleAddVariation = () => {
    if (percentage && packSize) {
      setProductVariations(prev => [...prev, { percentage, pack_size: packSize, packs_in_carton: '', price_per_pack: '', price_per_carton: '' }]);
      setPercentage('');
      setPackSize('');
    }
  };

  const handleVariationChange = (index, field, value) => {
    const updatedVariations = [...productVariations];
    updatedVariations[index][field] = value;
    setProductVariations(updatedVariations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in');
      return;
    }
    try {
      const promises = productVariations.map(async (variation) => {
        const product = {
          name: `${name} ${variation.percentage} ${variation.pack_size}`,
          packs_in_carton: variation.packs_in_carton,
          price_per_pack: variation.price_per_pack,
          price_per_carton: variation.price_per_carton
        };

        const method = selectedProduct ? 'PUT' : 'POST';
        const url = selectedProduct ? `/api/products/${selectedProduct._id}` : '/api/products';
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
        }
      });

      await Promise.all(promises);

      setName('');
      setPacks_in_carton('');
      setPrice_per_pack('');
      setPrice_per_carton('');
      setImgURL('');
      setProductVariations([]);
      setError(null);
      setEmptyFields([]);
      setIsModalOpen(false);

    } catch (error) {
      console.error('Error submitting product:', error.message);
      setError('Failed to submit product. Please try again.');
    }
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
              <label>Policy Name:</label>
              <input
                type="text"
                onChange={(e) => setPercentage(e.target.value)}
                value={percentage}
                placeholder="e.g., 36%, SCD, etc."
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Pack Size:</label>
              <input
                type="text"
                onChange={(e) => setPackSize(e.target.value)}
                value={packSize}
                placeholder="e.g., 200ml"
              />
              <button type="button" onClick={handleAddVariation}>
                Add Variation
              </button>
            </div>
            {productVariations.map((variation, index) => (
              <div key={index} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "10px" }}>
                <h4>{`${name} ${variation.percentage} ${variation.pack_size}`}</h4>
                <div style={{ marginBottom: "10px" }}>
                  <label>Packs in Carton:</label>
                  <input
                    type="text"
                    onChange={(e) => handleVariationChange(index, 'packs_in_carton', e.target.value)}
                    value={variation.packs_in_carton}
                    className={emptyFields.includes('packs_in_carton') ? 'error' : ''} />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label>Price Per Pack:</label>
                  <input
                    type="number"
                    onChange={(e) => handleVariationChange(index, 'price_per_pack', e.target.value)}
                    value={variation.price_per_pack}
                    className={emptyFields.includes('price_per_pack') ? 'error' : ''} />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label>Price per Carton:</label>
                  <input
                    type="number"
                    onChange={(e) => handleVariationChange(index, 'price_per_carton', e.target.value)}
                    value={variation.price_per_carton}
                    className={emptyFields.includes('price_per_carton') ? 'error' : ''} />
                </div>
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
