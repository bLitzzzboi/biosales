import React, { useState, useEffect } from "react";
import { usePolicysContext } from "../hooks/usePolicysContext";
import { useAuthContext } from "../hooks/useAuthContext";
import PolicyDetails from "../components/PolicyDetails";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { format } from "date-fns"; // Add date-fns for date formatting

const Policys = () => {
  const { policys, dispatch } = usePolicysContext();
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("today"); // New state for filter type
  const [selectedDate, setSelectedDate] = useState(new Date()); // New state for selected date

  const [policy_name, setPolicy_name] = useState("");
  const [multiplier, setMultiplier] = useState("");

  const [fetched_users, setFetchedUsers] = useState([]);
  const [ImgURL, setImgURL] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [formData, setFormData] = useState({
    policy_name: "",
    multiplier: "",

  });
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const navigate = useNavigate();

  const handleEditClick = (policy) => {
    setSelectedPolicy(policy);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const policy = {
        policy_name,
        multiplier,
    };

    try {
      const response = await fetch("/api/policys", {
        method: "POST",
        body: JSON.stringify(policy),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to submit policy:", response.status);
        const errorData = await response.json();
        setError(errorData.error);
        setEmptyFields(errorData.emptyFields || []);
      } else {
        const json = await response.json();
        setPolicy_name("");
        setMultiplier("");

        setError(null);
        setEmptyFields([]);
        dispatch({ type: "CREATE_POLICY", payload: json });
        setIsModalOpen(false);
        setImgURL("");
      }
    } catch (error) {
      console.error("Error submitting policy:", error.message);
      setError("Failed to submit policy. Please try again.");
    }
  };

  useEffect(() => {
    const fetchPolicys = async () => {
      try {
        const response = await fetch("/api/policys", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_POLICYS", payload: json });
        } else {
          console.error("Failed to fetch policys:", response.status);
        }
      } catch (error) {
        console.error("Error fetching policys:", error.message);
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
      fetchPolicys();
      fetchWorkouts();
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Filter farmer meetings based on the selected filter type and date
  const filteredPolicys = policys.filter((meeting) => {
    const meetingDate = new Date(meeting.createdAt);
    if (filterType === "today") {
      return meetingDate.toDateString() === new Date().toDateString();
    }
    if (filterType === 'all') {
      return true;
    }
    if (filterType === "date") {
      return (
        meetingDate.toDateString() === new Date(selectedDate).toDateString()
      );
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
        <h3>Policies</h3>

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
          Add Policy
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
          onClick={() => setFilterType("all")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            border: "none",
            backgroundColor: filterType === "all" ? "#C0E9BB" : "#ccc",
            color: "#012F4F",
            cursor: "pointer",
            marginRight: "10px",
            width: "100px",
            border: filterType === "all" ? "1px solid #012F4F" : "none",
          }}
        >
          All
        </button>
        
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
      <div>
        {filterType === "date" && (
          <input
            type="date"
            onChange={(e) => setSelectedDate(e.target.value)}
            value={format(new Date(selectedDate), "yyyy-MM-dd")}
            style={{
              // marginLeft: "10px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "200px",
              borderRadius: "25px",
              border: "1px solid grey",
            }}
          />
        )}
      </div>
      {filteredPolicys &&
        filteredPolicys.map((policy) => (
          <PolicyDetails
            key={policy._id}
            policy={policy}
          />
        ))}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{selectedPolicy? "Edit Policy" : "Add New Policy"}</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: "10px" }}>
              <label>Policy Name:</label>
              <input
                type="text"
                onChange={(e) => setPolicy_name(e.target.value)}
                value={policy_name}
                className={emptyFields.includes("policy_name") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Multiplier:</label>
              <input
                type="number"
                onChange={(e) => setMultiplier(e.target.value)}
                value={multiplier}
                className={emptyFields.includes("multiplier") ? "error" : ""}
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

export default Policys;
