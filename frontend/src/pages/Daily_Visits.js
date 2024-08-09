import React, { useState, useEffect } from "react";
import { useVisitsContext } from "../hooks/useVisitsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import VisitDetails from "../components/VisitDetails";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // Add date-fns for date formatting

const Visits = () => {
  const { visits, dispatch } = useVisitsContext();
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sales_officer, setSales_officer] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [km_done, setKm_done] = useState("");
  const [location, setLocation] = useState("");

  const [fetched_users, setFetchedUsers] = useState([]);
  const [ImgURL, setImgURL] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const [formData, setFormData] = useState({
    sales_officer: "",
    area: "",
    description: "",
    km_done: "",
    location: "",
  });

  const [selectedVisit, setSelectedVisit] = useState(null);
  const [filterType, setFilterType] = useState("today"); // New state for filter type
  const [selectedDate, setSelectedDate] = useState(new Date()); // New state for selected date

  const navigate = useNavigate();

  const handleEditClick = (visit) => {
    setSelectedVisit(visit);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const visit = {
      sales_officer,
      area,
      description,
      km_done,
      location,
    };

    try {
      const response = await fetch("/api/visits", {
        method: "POST",
        body: JSON.stringify(visit),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to submit visit:", response.status);
        const errorData = await response.json();
        setError(errorData.error);
        setEmptyFields(errorData.emptyFields || []);
      } else {
        const json = await response.json();
        // Clear form fields
        setSales_officer("");
        setArea("");
        setDescription("");
        setKm_done("");
        setLocation("");

        setError(null);
        setEmptyFields([]);
        dispatch({ type: "CREATE_VISIT", payload: json });
        setIsModalOpen(false);
        setImgURL("");
      }
    } catch (error) {
      console.error("Error submitting visit:", error.message);
      setError("Failed to submit visit. Please try again.");
    }
  };

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await fetch("/api/visits", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_VISITS", payload: json });
        } else {
          console.error("Failed to fetch visits:", response.status);
        }
      } catch (error) {
        console.error("Error fetching visits:", error.message);
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
      fetchVisits();
      fetchWorkouts();
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Filter visits based on the selected filter type and date
  const filteredVisits = visits.filter((visit) => {
    const visitDate = new Date(visit.createdAt);
    if (filterType === "today") {
      return visitDate.toDateString() === new Date().toDateString();
    }
    if (filterType === "date") {
      return visitDate.toDateString() === new Date(selectedDate).toDateString();
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
        <h3>Daily Visits</h3>

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
          Add Visit
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
            //   marginLeft: "10px",
            padding: "10px",
            borderRadius: "5px",
            width: "200px",
            borderRadius: "25px",
            border: "1px solid grey",
          }}
        />
      )}
      {filteredVisits &&
        filteredVisits.map((visit) => (
          <VisitDetails key={visit._id} visit={visit} />
        ))}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{selectedVisit ? "Edit Visit" : "Add New Visit"}</h2>
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
              <label>Area:</label>
              <input
                type="text"
                onChange={(e) => setArea(e.target.value)}
                value={area}
                className={emptyFields.includes("area") ? "error" : ""}
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
            <div style={{ marginBottom: "10px" }}>
              <label>Km Done:</label>
              <input
                type="number"
                onChange={(e) => setKm_done(e.target.value)}
                value={km_done}
                className={emptyFields.includes("km_done") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Location:</label>
              <input
                type="text"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                className={emptyFields.includes("location") ? "error" : ""}
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

export default Visits;
