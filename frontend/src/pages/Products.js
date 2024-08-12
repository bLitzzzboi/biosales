import React, { useState, useEffect } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import ProductDetails from "../components/ProductDetails";
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';
import firebase from "firebase/compat/app";
import 'firebase/compat/storage';

const Products = () => {
  const { products, dispatch } = useProductsContext();
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const [active_ingredient, setActive_ingredient] = useState('');
  // const [formulation, setFormulation] = useState('');
  // const [crops, setCrops] = useState('');
  // const [pests, setPests] = useState('');
  // const [dosage, setDosage] = useState('');
  const [packs_in_carton, setPacks_in_carton] = useState('');
  const [name, setName] = useState('');
  const [price_per_pack, setPrice_per_pack] = useState('');
  const [price_per_carton, setPrice_per_carton] = useState('');
  const [ImgURL, setImgURL] = useState('');

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    load: "",
    reps: "",
    area: "",
    full_name: "",
    cnic: "",
    designation: "",
    contact_no: "",
    vehicle_number: "",
    vehicle_make: "",
    vehicle_model: "",
    sales: "",
    cash_returned: "",

    // active_ingredient: "",
    // formulation: "",
    // crops: "",
    // pests: "",
    // dosage: "",
    packs_in_carton: "",
    name: "",
    price_per_pack: "",
    price_per_carton: ""
  });

  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Populate form fields with selected product data
    // setActive_ingredient(product.active_ingredient);
    // setFormulation(product.formulation);
    // setCrops(product.crops);
    // setPests(product.pests);
    // setDosage(product.dosage);
    setPacks_in_carton(product.packs_in_carton);
    setName(product.name);
    setPrice_per_pack(product.price_per_pack);
    setPrice_per_carton(product.price_per_carton);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const product = {
      // active_ingredient,
      // formulation,
      // crops,
      // pests,
      // dosage,
      packs_in_carton,
      name,
      price_per_pack,
      price_per_carton
    };

    try {
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
        console.error('Failed to submit product:', response.status);
        const errorData = await response.json();
        setError(errorData.error);
        setEmptyFields(errorData.emptyFields || []);
      } else {
        const json = await response.json();

        if (selectedProduct) {
          dispatch({ type: 'UPDATE_PRODUCT', payload: json });
        } else {
          dispatch({ type: 'CREATE_PRODUCT', payload: json });
        }

        // Clear form fields
        // setActive_ingredient('');
        // setFormulation('');
        // setCrops('');
        // setPests('');
        // setDosage('');
        setPacks_in_carton('');
        setName('');
        setPrice_per_pack('');
        setPrice_per_carton('');

        setError(null);
        setEmptyFields([]);
        setIsModalOpen(false);
        setImgURL('');
      }
    } catch (error) {
      console.error('Error submitting product:', error.message);
      setError('Failed to submit product. Please try again.');
    }
  };

  // const handleUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const storageRef = firebase.storage().ref();
  //     const folderPath = 'product_images'; // Path to the specific folder
  //     const fileRef = storageRef.child(`${folderPath}/${file.name}`);

  //     fileRef.put(file).then(() => {
  //       console.log('Uploaded a file');
  //       fileRef.getDownloadURL().then((url) => {
  //         console.log(url);
  //         setImgURL(url);
  //         setActive_ingredient(url);
  //       });
  //     });
  //   }
  // };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Ensure products is always an array before filtering
  const filteredProducts = (products || []).filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="workouts" style={{ width: "100vh", marginLeft: "50vh" }}>
      <div
        className="workouts-header"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#012F4F", }}
      >
        <h3>Products</h3>
        <div 
        className="workout-detail-header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
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
            <ProductDetails key={product._id} product={product} />
          ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          <form onSubmit={handleSubmit}>
            {/* <div style={{ marginBottom: "10px" }}>
              <label>Active Ingredient:</label>
              <input
                type="text"
                onChange={(e) => setActive_ingredient(e.target.value)}
                value={active_ingredient}
                className={emptyFields.includes('active_ingredient') ? 'error' : ''}
              />
            </div> */}
            {/* <div style={{ marginBottom: "10px" }}>
              <label>Formulation:</label>
              <input
                type="text"
                onChange={(e) => setFormulation(e.target.value)}
                value={formulation}
                className={emptyFields.includes('formulation') ? 'error' : ''}
              />
            </div> */}
            {/* <div style={{ marginBottom: "10px" }}>
              <label>Crops:</label>
              <input
                type="text"
                onChange={(e) => setCrops(e.target.value)}
                value={crops}
                className={emptyFields.includes('crops') ? 'error' : ''}
              />
            </div> */}
            {/* <div style={{ marginBottom: "10px" }}>
              <label>Pests:</label>
              <input
                type="text"
                onChange={(e) => setPests(e.target.value)}
                value={pests}
                className={emptyFields.includes('pests') ? 'error' : ''}
              />
            </div> */}
            {/* <div style={{ marginBottom: "10px" }}>
              <label>Dosage:</label>
              <input
                type="text"
                onChange={(e) => setDosage(e.target.value)}
                value={dosage}
                className={emptyFields.includes('dosage') ? 'error' : ''}
              />
            </div> */}
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
              <label>Name:</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={emptyFields.includes('name') ? 'error' : ''}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Price Per Pack:</label>
              <input
                type="number"
                onChange={(e) => setPrice_per_pack(e.target.value)}
                value={price_per_pack}
                className={emptyFields.includes('price_per_pack') ? 'error' : ''}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Price per Carton:</label>
              <input
                type="number"
                onChange={(e) => setPrice_per_carton(e.target.value)}
                value={price_per_carton}
                className={emptyFields.includes('price_per_carton') ? 'error' : ''}
              />
            </div>
            <button type="submit" style={{ padding: "10px 20px", borderRadius: "25px", border: "none", backgroundColor: "#007bff", color: "white", cursor: "pointer" }}>
              Submit
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
