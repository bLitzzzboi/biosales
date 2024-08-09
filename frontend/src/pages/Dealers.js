import React, { useState, useEffect } from "react";
import { useDealersContext } from "../hooks/useDealersContext";
import { useAuthContext } from "../hooks/useAuthContext";
import DealerDetails from "../components/DealerDetails";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import ImagePreview from "./ImagePreview";

const Dealers = () => {
  const { dealers, dispatch } = useDealersContext();
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [sales_officer, setSales_officer] = useState("");
  const [business_name, setBusiness_name] = useState("");
  const [personal_name, setPersonal_name] = useState("");
  const [cnic_front_img, setCnic_front_img] = useState("");
  const [cnic_back_img, setCnic_back_img] = useState("");
  const [licence_img, setLicence_img] = useState("");
  const [address, setAddress] = useState("");
  const [contact_no, setContact_no] = useState("");
  const [fetched_users, setFetchedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [formData, setFormData] = useState({
    sales_officer: "",
    business_name: "",
    personal_name: "",
    cnic_front_img: "",
    cnic_back_img: "",
    licence_img: "",
    address: "",
    contact_no: "",
  });

  const navigate = useNavigate();
  const [selectedDealer, setSelectedDealer] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const dealer = {
      sales_officer,
      business_name,
      personal_name,
      cnic_front_img,
      cnic_back_img,
      licence_img,
      address,
      contact_no,
    };

    try {
      const response = await fetch("/api/dealers", {
        method: "POST",
        body: JSON.stringify(dealer),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        setEmptyFields(errorData.emptyFields || []);
      } else {
        const json = await response.json();

        // Clear form fields
        setSales_officer("");
        setBusiness_name("");
        setPersonal_name("");
        setCnic_front_img("");
        setCnic_back_img("");
        setLicence_img("");
        setAddress("");
        setContact_no("");

        setError(null);
        setEmptyFields([]);
        dispatch({ type: "CREATE_DEALER", payload: json });
        setIsModalOpen(false);
      }
    } catch (error) {
      setError("Failed to submit dealer. Please try again.");
    }
  };

  const handleUpload = async (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = firebase.storage().ref();
      const folderPath = `${event.target.name}_Images`; // Path to the specific folder
      const fileRef = storageRef.child(`${folderPath}/${file.name}`);

      try {
        await fileRef.put(file);
        const url = await fileRef.getDownloadURL();
        setImage(url);
      } catch (error) {
        console.error("Error uploading file:", error.message);
      }
    }
  };

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await fetch("/api/dealers", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_DEALERS", payload: json });
        } else {
          console.error("Failed to fetch dealers:", response.status);
        }
      } catch (error) {
        console.error("Error fetching dealers:", error.message);
      }
    };

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
      fetchDealers();
      fetchWorkouts();
    }
  }, [dispatch, user]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDealers = (dealers || []).filter((dealer) =>
    dealer.business_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="workouts" style={{ width: "100vh", marginLeft: "50vh" }}>
      <div
        className="workouts-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#012F4F",
        }}
      >
        <h3>Dealers</h3>

        <div
          className="workout-detail-header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <input
            type="text"
            placeholder="Search Dealer"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              marginRight: "20px",
              width: "20vh",
              borderRadius: "25px",
              border: "1px solid grey",
            }}
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
            Add Dealer
          </button>
        </div>
      </div>
      {filteredDealers &&
        filteredDealers.map((dealer) => (
          <DealerDetails key={dealer._id} dealer={dealer} />
        ))}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{selectedDealer ? "Edit Dealer" : "Add New Dealer"}</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          <label
            htmlFor="cnic_front_img"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              border: "2px solid #000",
              borderRadius: "20px",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
              textAlign: "center",
              fontFamily: "Arial, sans-serif",
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "14px",
            }}
          >
            Choose CNIC Front Image
            <input
              type="file"
              id="cnic_front_img"
              name="CNIC_Front"
              onChange={(e) => handleUpload(e, setCnic_front_img)}
              style={{ display: "none" }}
            />
          </label>

          <label
            htmlFor="cnic_back_img"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              border: "2px solid #000",
              borderRadius: "20px",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
              textAlign: "center",
              fontFamily: "Arial, sans-serif",
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "14px",
            }}
          >
            Choose CNIC Back Image
            <input
              type="file"
              id="cnic_back_img"
              name="CNIC_Back"
              onChange={(e) => handleUpload(e, setCnic_back_img)}
              style={{ display: "none" }}
            />
          </label>

          <label
            htmlFor="licence_img"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              border: "2px solid #000",
              borderRadius: "20px",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
              textAlign: "center",
              fontFamily: "Arial, sans-serif",
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "14px",
            }}
          >
            Choose Licence Image
            <input
              type="file"
              id="licence_img"
              name="Licence"
              onChange={(e) => handleUpload(e, setLicence_img)}
              style={{ display: "none" }}
            />
          </label>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label>Sales Officer:</label>
              <select
                name="sales_officer"
                onChange={(e) => setSales_officer(e.target.value)}
                value={sales_officer}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  minHeight: "40px",
                }}
              >
                <option value="">Select Sales Officer</option>
                {fetched_users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.full_name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div style={{ marginBottom: "10px" }}>
              <label>Status:</label>
              <select
                onChange={(e) => setStatus(e.target.value)}
                value={status}
                className={emptyFields.includes('status') ? 'error' : ''}
                style={{width: "100%", padding: "10px", borderRadius: "5px", minHeight: "40px"}}

              >
                <option value="">Select Status</option>
                <option value="Verified">Verified</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div> */}
            <div style={{ marginBottom: "10px" }}>
              <label>Business Name:</label>
              <input
                type="text"
                onChange={(e) => setBusiness_name(e.target.value)}
                value={business_name}
                className={emptyFields.includes("business_name") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Personal Name:</label>
              <input
                type="text"
                onChange={(e) => setPersonal_name(e.target.value)}
                value={personal_name}
                className={emptyFields.includes("personal_name") ? "error" : ""}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>CNIC Front Image:</label>
              <input
                type="text"
                onChange={(e) => setCnic_front_img(e.target.value)}
                value={cnic_front_img}
                className={
                  emptyFields.includes("cnic_front_img") ? "error" : ""
                }
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
                onChange={(e) => setCnic_back_img(e.target.value)}
                value={cnic_back_img}
                className={emptyFields.includes("cnic_back_img") ? "error" : ""}
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
                onChange={(e) => setLicence_img(e.target.value)}
                value={licence_img}
                className={emptyFields.includes("licence_img") ? "error" : ""}
              />
            </div>

            <div style={{ marginBottom: "13px" }}>
              <ImagePreview url={licence_img}>View Licence Image</ImagePreview>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Address:</label>
              <input
                type="text"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                className={emptyFields.includes("address") ? "error" : ""}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Contact No:</label>
              <input
                type="text"
                onChange={(e) => setContact_no(e.target.value)}
                value={contact_no}
                className={emptyFields.includes("contact_no") ? "error" : ""}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#007bff",
                color: "white",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Dealers;
