import React, { useState, useEffect, useCallback } from "react";
import { useReceiptsContext } from "../hooks/useReceiptsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import ReceiptDetails from "../components/ReceiptDetails";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { useInView } from 'react-intersection-observer'; // Import the useInView hook

const Receipts = () => {
  const { receipts, dispatch } = useReceiptsContext();
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sales_officer, setSales_officer] = useState("");
  const [status, setStatus] = useState("");
  const [dealer, setDealer] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [deposit_slip_no, setDeposit_slip_no] = useState("");
  const [fetched_users, setFetchedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [formData, setFormData] = useState({
    sales_officer: "",
    status: "",
    dealer: "",
    amount: "",
    bank: "",
    deposit_slip_no: "",
  });
  const navigate = useNavigate();
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [filter, setFilter] = useState("All");

  const fetchReceipts = useCallback(async () => {
    if (user) {
      try {
        const response = await fetch("/api/receipts/admin", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_RECEIPTS", payload: json });
        } else {
          console.error("Failed to fetch receipts:", response.status);
        }
      } catch (error) {
        console.error("Error fetching receipts:", error.message);
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const handleEditClick = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      setError("You must be logged in");
      return;
    }
  
    const receipt = {
      sales_officer,
      status,
      dealer,
      amount,
      bank,
      deposit_slip_no,
    };
  
    try {
      const response = await fetch(`/api/receipts/${selectedReceipt._id}`, {
        method: "PUT",
        body: JSON.stringify(receipt),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      if (!response.ok) {
        console.error("Failed to update receipt:", response.status);
        const errorData = await response.json();
        setError(errorData.error);
        setEmptyFields(errorData.emptyFields || []);
      } else {
        const updatedReceipt = await response.json();
  
        // Dispatch update action
        dispatch({ type: "UPDATE_RECEIPT", payload: updatedReceipt });
  
        // Clear form fields
        setSales_officer("");
        setStatus("");
        setDealer("");
        setAmount("");
        setBank("");
        setDeposit_slip_no("");
  
        setError(null);
        setEmptyFields([]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating receipt:", error.message);
      setError("Failed to update receipt. Please try again.");
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterClick = (filterValue) => {
    setFilter(filterValue);
  };

  const filteredReceipts =
    (receipts || []).filter((receipt) =>
      filter === "All" ? true : receipt.status === filter
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
        <h3>Receipts</h3>
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
          Add Receipt
        </button>
      </div>
      <div
        className="filter-buttons"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "5px",
          margin: "10px 0",
        }}
      >
        <button
          onClick={() => handleFilterClick("All")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            width: "100px",
            border: filter === "All" ? "1px solid #012F4F" : "none",
            backgroundColor: filter === "All" ? "#C0E9BB" : "#ccc",
            color: filter === "All" ? "#012F4F" : "#black",
            cursor: "pointer",
          }}
        >
          All
        </button>
        <button
          onClick={() => handleFilterClick("Verified")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            width: "100px",
            border: filter === "Verified" ? "1px solid #012F4F" : "none",
            backgroundColor: filter === "Verified" ? "#C0E9BB" : "#ccc",
            color: filter === "Verified" ? "#012F4F" : "black",
            cursor: "pointer",
          }}
        >
          Verified
        </button>
        <button
          onClick={() => handleFilterClick("Unverified")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            width: "100px",
            border: filter === "Unverified" ? "1px solid #012F4F" : "none",
            backgroundColor: filter === "Unverified" ? "#C0E9BB" : "#ccc",
            color: filter === "Unverified" ? "#012F4F" : "black",
            cursor: "pointer",
          }}
        >
          Unverified
        </button>
      </div>
      {filteredReceipts.map((receipt) => (
        <LazyReceiptDetails key={receipt._id} receipt={receipt} />
      ))}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{selectedReceipt ? "Edit Receipt" : "Add New Receipt"}</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
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
            <div style={{ marginBottom: "10px" }}>
              <label>Status:</label>
              <select
                onChange={(e) => setStatus(e.target.value)}
                value={status}
                className={emptyFields.includes("status") ? "error" : ""}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  minHeight: "40px",
                }}
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
                onChange={(e) => setDealer(e.target.value)}
                value={dealer}
                className={emptyFields.includes("dealer") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Amount:</label>
              <input
                type="number"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                className={emptyFields.includes("amount") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Bank:</label>
              <input
                type="text"
                onChange={(e) => setBank(e.target.value)}
                value={bank}
                className={emptyFields.includes("bank") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Deposit Slip No:</label>
              <input
                type="text"
                onChange={(e) => setDeposit_slip_no(e.target.value)}
                value={deposit_slip_no}
                className={
                  emptyFields.includes("deposit_slip_no") ? "error" : ""
                }
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

// Lazy loading for WorkoutDetails
const LazyReceiptDetails = ({ receipt }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView ? <ReceiptDetails receipt={receipt} /> : null}
    </div>
  );
};

export default Receipts;
