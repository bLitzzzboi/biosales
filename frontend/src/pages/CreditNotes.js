import React, { useState, useEffect } from "react";
import { useCreditNotesContext } from "../hooks/useCreditNotesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import CreditNoteDetails from "../components/CreditNoteDetails";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // Add date-fns for date formatting

const CreditNotes = () => {
  const { creditnotes, dispatch } = useCreditNotesContext();
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dealer_id, setDealer_id] = useState("");
  const [policy, setPolicy] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [fetched_users, setFetchedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const [formData, setFormData] = useState({
    dealer_id: "",
    policy: "",
    amount: "",
    description: "",
  });

  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
  const [filterType, setFilterType] = useState("today"); // New state for filter type
  const [selectedDate, setSelectedDate] = useState(new Date()); // New state for selected date

  const navigate = useNavigate();

  const handleEditClick = (creditnote) => {
    setSelectedCreditNote(creditnote);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const creditnote = {
      dealer_id,
      policy,
      amount,
      description,
    };

    let cash_returned_dealer = parseFloat(amount); // Parse entered amount as a float
    console.log('CASH RETURNED:', cash_returned_dealer);

    try {
      // Fetch the current cash_returned value for the dealer
      const dealerResponse = await fetch(`/api/dealers/${dealer_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!dealerResponse.ok) {
        console.error("Failed to fetch dealer:", dealerResponse.status);
        const errorData = await dealerResponse.json();
        setError(errorData.error);
        return;
      }

      const dealerData = await dealerResponse.json();
      const updatedCashReturned = dealerData.cash_returned + cash_returned_dealer;

      // Prepare modifiedData with updated cash_returned
      const modifiedData = {
        cash_returned: updatedCashReturned,
      };

      const response = await fetch("/api/creditnotes", {
        method: "POST",
        body: JSON.stringify(creditnote),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to submit credit note:", response.status);
        const errorData = await response.json();
        setError(errorData.error);
        setEmptyFields(errorData.emptyFields || []);
      } else {
        // Update the dealer's cash_returned value
        handleEditDealer(modifiedData);

        const json = await response.json();

        // Clear form fields
        setDealer_id("");
        setPolicy("");
        setAmount("");
        setDescription("");

        setError(null);
        setEmptyFields([]);
        dispatch({ type: "CREATE_CREDITNOTE", payload: json });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error submitting credit note:", error.message);
      setError("Failed to submit credit note. Please try again.");
    }
  };

  const handleEditDealer = async (modifiedData) => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(`/api/dealers/${dealer_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(modifiedData),
      });

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "UPDATE_DEALER", payload: json });
        console.log("Dealer updated");
      }
    } catch (error) {
      console.error("Error updating dealer:", error.message);
    }
  };

  useEffect(() => {
    console.log("CREDIT NOTES OPENED");
    const fetchCreditNotes = async () => {
      try {
        const response = await fetch("/api/creditnotes/admin", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_CREDITNOTES", payload: json });
        } else {
          console.error("Failed to fetch credit notes:", response.status);
        }
      } catch (error) {
        console.error("Error fetching credit notes:", error.message);
      }
    };

    const fetchDealers = async () => {
      try {
        const response = await fetch("/api/dealers/admin", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_DEALERS", payload: json });
          setFetchedUsers(json);
        } else {
          console.error("Failed to fetch workouts:", response.status);
        }
      } catch (error) {
        console.error("Error fetching workouts:", error.message);
      }
    };

    if (user) {
      fetchCreditNotes();
      fetchDealers();
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const filteredCreditNotes = creditnotes.filter((creditnote) => {
    const creditnoteDate = new Date(creditnote.createdAt);
    if (filterType === "today") {
      return creditnoteDate.toDateString() === new Date().toDateString();
    }
    if (filterType === "date") {
      return creditnoteDate.toDateString() === new Date(selectedDate).toDateString();
    }
    return true;
  });

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
        <h3>Credit Notes</h3>

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
          Add CN
        </button>
      </div>
      <div>
        <button
          onClick={() => setFilterType("today")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            border: "none",
            backgroundColor: filterType === "today" ? "#C0E9BB" : "#ccc",
            color: "#012F4F",
            cursor: "pointer",
            marginRight: "10px",
            width: "100px",
            border: filterType === "today" ? "1px solid #012F4F" : "none",
          }}
        >
          Today
        </button>
        <button
          onClick={() => setFilterType("date")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            border: "none",
            backgroundColor: filterType === "date" ? "#C0E9BB" : "#ccc",
            color: "#012F4F",
            cursor: "pointer",
            width: "100px",
            border: filterType === "date" ? "1px solid #012F4F" : "none",
          }}
        >
          Date
        </button>
      </div>
      {filterType === "date" && (
        <input
          type="date"
          onChange={(e) => setSelectedDate(e.target.value)}
          value={format(new Date(selectedDate), "yyyy-MM-dd")}
          style={{
            padding: "10px",
            borderRadius: "5px",
            width: "200px",
            borderRadius: "25px",
            border: "1px solid grey",
          }}
        />
      )}
      {filteredCreditNotes &&
        filteredCreditNotes.map((creditnote) => (
          <CreditNoteDetails key={creditnote._id} creditnote={creditnote} />
        ))}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{selectedCreditNote ? "Edit CN" : "Add New CN"}</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label>Dealer:</label>
              <select
                name="dealer_id"
                onChange={(e) => setDealer_id(e.target.value)}
                value={dealer_id}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  minHeight: "40px",
                }}
              >
                <option value="">Select Dealer</option>
                {fetched_users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.business_name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Policy:</label>
              <input
                type="text"
                onChange={(e) => setPolicy(e.target.value)}
                value={policy}
                className={emptyFields.includes("policy") ? "error" : ""}
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
              <label>Description:</label>
              <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className={emptyFields.includes("description") ? "error" : ""}
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

export default CreditNotes;
