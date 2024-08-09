import React, { useState, useEffect } from "react";
import { useFarmerMeetingsContext } from "../hooks/useFarmerMeetingsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import FarmerMeetingDetails from "../components/FarmerMeetingDetails";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { format } from "date-fns"; // Add date-fns for date formatting

const FarmerMeetings = () => {
  const { farmermeetings, dispatch } = useFarmerMeetingsContext();
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("today"); // New state for filter type
  const [selectedDate, setSelectedDate] = useState(new Date()); // New state for selected date
  const [sales_officer, setSales_officer] = useState("");
  const [farmer_name, setFarmer_name] = useState("");
  const [area_of_land, setArea_of_land] = useState("");
  const [address, setAddress] = useState("");
  const [contact_no, setContact_no] = useState("");
  const [participant_no, setParticipant_no] = useState("");
  const [total_expense, setTotal_expense] = useState("");
  const [fetched_users, setFetchedUsers] = useState([]);
  const [ImgURL, setImgURL] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [formData, setFormData] = useState({
    sales_officer: "",
    farmer_name: "",
    area_of_land: "",
    address: "",
    contact_no: "",
    participant_no: "",
    total_expense: "",
  });
  const [selectedFarmerMeeting, setSelectedFarmerMeeting] = useState(null);

  const navigate = useNavigate();

  const handleEditClick = (farmermeeting) => {
    setSelectedFarmerMeeting(farmermeeting);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const farmermeeting = {
      sales_officer,
      farmer_name,
      area_of_land,
      address,
      contact_no,
      participant_no,
      total_expense,
    };

    try {
      const response = await fetch("/api/farmermeetings", {
        method: "POST",
        body: JSON.stringify(farmermeeting),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to submit farmer meeting:", response.status);
        const errorData = await response.json();
        setError(errorData.error);
        setEmptyFields(errorData.emptyFields || []);
      } else {
        const json = await response.json();
        setSales_officer("");
        setFarmer_name("");
        setArea_of_land("");
        setAddress("");
        setContact_no("");
        setParticipant_no("");
        setTotal_expense("");
        setError(null);
        setEmptyFields([]);
        dispatch({ type: "CREATE_FARMER_MEETING", payload: json });
        setIsModalOpen(false);
        setImgURL("");
      }
    } catch (error) {
      console.error("Error submitting farmer meeting:", error.message);
      setError("Failed to submit farmer meeting. Please try again.");
    }
  };

  useEffect(() => {
    const fetchFarmerMeetings = async () => {
      try {
        const response = await fetch("/api/farmermeetings", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_FARMER_MEETINGS", payload: json });
        } else {
          console.error("Failed to fetch farmer meetings:", response.status);
        }
      } catch (error) {
        console.error("Error fetching farmer meetings:", error.message);
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
      fetchFarmerMeetings();
      fetchWorkouts();
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Filter farmer meetings based on the selected filter type and date
  const filteredFarmerMeetings = farmermeetings.filter((meeting) => {
    const meetingDate = new Date(meeting.createdAt);
    if (filterType === "today") {
      return meetingDate.toDateString() === new Date().toDateString();
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
        <h3>Farmer Meetings</h3>

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
          Add Meeting
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
      {filteredFarmerMeetings &&
        filteredFarmerMeetings.map((farmermeeting) => (
          <FarmerMeetingDetails
            key={farmermeeting._id}
            farmermeeting={farmermeeting}
          />
        ))}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{selectedFarmerMeeting ? "Edit Meeting" : "Add New Meeting"}</h2>
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
              <label>Farmer Name:</label>
              <input
                type="text"
                onChange={(e) => setFarmer_name(e.target.value)}
                value={farmer_name}
                className={emptyFields.includes("farmer_name") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Area of Land:</label>
              <input
                type="text"
                onChange={(e) => setArea_of_land(e.target.value)}
                value={area_of_land}
                className={emptyFields.includes("area_of_land") ? "error" : ""}
              />
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
            <div style={{ marginBottom: "10px" }}>
              <label>Participant No:</label>
              <input
                type="text"
                onChange={(e) => setParticipant_no(e.target.value)}
                value={participant_no}
                className={
                  emptyFields.includes("participant_no") ? "error" : ""
                }
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Total Expense:</label>
              <input
                type="text"
                onChange={(e) => setTotal_expense(e.target.value)}
                value={total_expense}
                className={emptyFields.includes("total_expense") ? "error" : ""}
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

export default FarmerMeetings;
