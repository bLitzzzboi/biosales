import React, { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import WorkoutDetails from "../components/WorkoutDetails";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

const Workouts = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [area, setArea] = useState("");
  const [full_name, setFull_name] = useState("");
  const [cnic, setCnic] = useState("");
  const [designation, setDesignation] = useState("");
  const [contact_no, setContact_no] = useState("");
  const [vehicle_number, setVehicle_number] = useState("");
  const [vehicle_make, setVehicle_make] = useState("");
  const [vehicle_model, setVehicle_model] = useState("");
  const [sales, setSales] = useState("");
  const [cash_returned, setCash_returned] = useState("");

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
  });

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const handleEditClick = (workout) => {
    setSelectedWorkout(workout);
    setArea(workout.area);
    setFull_name(workout.full_name);
    setCnic(workout.cnic);
    setDesignation(workout.designation);
    setContact_no(workout.contact_no);
    setVehicle_number(workout.vehicle_number);
    setVehicle_make(workout.vehicle_make);
    setVehicle_model(workout.vehicle_model);
    setSales(workout.sales);
    setCash_returned(workout.cash_returned);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const workout = {
      area,
      full_name,
      cnic,
      designation,
      contact_no,
      vehicle_number,
      vehicle_make,
      vehicle_model,
      sales,
      cash_returned,
    };

    try {
      const url = selectedWorkout ? `/api/workouts/${selectedWorkout._id}` : '/api/workouts';
      const method = selectedWorkout ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: JSON.stringify(workout),
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

        if (selectedWorkout) {
          dispatch({ type: "UPDATE_WORKOUT", payload: json });
        } else {
          dispatch({ type: "CREATE_WORKOUT", payload: json });
        }

        setArea("");
        setFull_name("");
        setCnic("");
        setDesignation("");
        setContact_no("");
        setVehicle_number("");
        setVehicle_make("");
        setVehicle_model("");
        setSales("");
        setCash_returned("");

        setError(null);
        setEmptyFields([]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to submit workout:', error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/workouts", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const json = await response.json();
          dispatch({ type: "SET_WORKOUTS", payload: json });
        } else {
          console.error("Failed to fetch workouts:", response.status);
        }
      } catch (error) {
        console.error("Error fetching workouts:", error.message);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Ensure that the filteredWorkouts updates when workouts change
    console.log('Workouts updated:', workouts);
  }, [workouts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredWorkouts = (workouts || []).filter(workout =>
    workout.full_name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h3>Users</h3>

        <div
          className="workout-detail-header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <input
            type="text"
            placeholder="Search User"
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
            Add User
          </button>
        </div>
      </div>
      {filteredWorkouts &&
        filteredWorkouts.map((workout) => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{selectedWorkout ? "Edit User" : "Add New User"}</h2>
        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label>Area:</label>
              <input
                type="text"
                name="area"
                onChange={handleInputChange}
                value={formData.area}
                className={emptyFields.includes("area") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Full Name:</label>
              <input
                type="text"
                name="full_name"
                onChange={handleInputChange}
                value={formData.full_name}
                className={emptyFields.includes("full_name") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>CNIC:</label>
              <input
                type="number"
                name="cnic"
                onChange={handleInputChange}
                value={formData.cnic}
                className={emptyFields.includes("cnic") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Designation:</label>
              <input
                type="text"
                name="designation"
                onChange={handleInputChange}
                value={formData.designation}
                className={emptyFields.includes("designation") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Contact Number:</label>
              <input
                type="number"
                name="contact_no"
                onChange={handleInputChange}
                value={formData.contact_no}
                className={emptyFields.includes("contact_no") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Vehicle Number:</label>
              <input
                type="text"
                name="vehicle_number"
                onChange={handleInputChange}
                value={formData.vehicle_number}
                className={
                  emptyFields.includes("vehicle_number") ? "error" : ""
                }
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Vehicle Make:</label>
              <input
                type="text"
                name="vehicle_make"
                onChange={handleInputChange}
                value={formData.vehicle_make}
                className={emptyFields.includes("vehicle_make") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Vehicle Model:</label>
              <input
                type="text"
                name="vehicle_model"
                onChange={handleInputChange}
                value={formData.vehicle_model}
                className={emptyFields.includes("vehicle_model") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Sales:</label>
              <input
                type="number"
                name="sales"
                onChange={handleInputChange}
                value={formData.sales}
                className={emptyFields.includes("sales") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Cash Returned:</label>
              <input
                type="number"
                name="cash_returned"
                onChange={handleInputChange}
                value={formData.cash_returned}
                className={emptyFields.includes("cash_returned") ? "error" : ""}
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

export default Workouts;
