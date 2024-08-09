import React, { useState, useEffect } from "react";
import { useOrdersContext } from "../hooks/useOrdersContext";
import { useAuthContext } from "../hooks/useAuthContext";
import OrderDetails from "../components/OrderDetails";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { format } from "date-fns"; // Add date-fns for date formatting

const Orders = () => {
  const { orders, dispatch } = useOrdersContext();
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

  const [items, setItems] = useState([]);
  const [dealer, setDealer] = useState("");
  const [policy, setPolicy] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [bilty_invoice, setBilty_invoice] = useState("");
  const [bilty_receipt, setBilty_receipt] = useState("");
  const [truck_number, setTruck_number] = useState("");
  const [truck_name, setTruck_name] = useState("");
  const [truck_contact_no, setTruck_contact_no] = useState("");

  const [fetched_users, setFetchedUsers] = useState([]);
  const [ImgURL, setImgURL] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [formData, setFormData] = useState({
    sales_officer: "",
    items: [],
    dealer: "",
    policy: "",
    amount: "",
    status: "",
    bilty_invoice: "",
    bilty_receipt: "",
    truck_number: "", 
    truck_name: "",
    truck_contact_no: "",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const order = {
      sales_officer,
      items,
      dealer,
      policy,
      amount,
      status,
      bilty_invoice,
      bilty_receipt,
      truck_number,
      truck_name,
      truck_contact_no,

    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to submit order:", response.status);
        const errorData = await response.json();
        setError(errorData.error);
        setEmptyFields(errorData.emptyFields || []);
      } else {
        const json = await response.json();
        setSales_officer("");
        setItems([]);
        setDealer("");
        setPolicy("");
        setAmount("");
        setStatus("");
        setBilty_invoice("");
        setBilty_receipt("");
        setTruck_number("");
        setTruck_name("");
        setTruck_contact_no("");

        setError(null);
        setEmptyFields([]);
        dispatch({ type: "CREATE_FARMER_MEETING", payload: json });
        setIsModalOpen(false);
        setImgURL("");
      }
    } catch (error) {
      console.error("Error submitting order:", error.message);
      setError("Failed to submit order. Please try again.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // router.get('/admin', getOrdersAdmin) // use this route to get all orders
        const response = await fetch("/api/orders/admin", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // const response = await fetch("/api/orders/admin", {
        //   headers: { Authorization: `Bearer ${user.token}` },
        // });
        if (response.ok) {
          const json = await response.json();
          console.log(json);
          dispatch({ type: "SET_ORDERS", payload: json });
        } else {
          console.error("Failed to fetch orders:", response.status);
        }
      } catch (error) {
        console.error("Error fetching orders:", error.message);
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
      fetchOrders();
      fetchWorkouts();
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Filter farmer meetings based on the selected filter type and date
  const filteredOrders = orders.filter((meeting) => {
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
        <h3>Orders</h3>

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
          Add Order
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
      {filteredOrders &&
        filteredOrders.map((order) => (
          <OrderDetails
            key={order._id}
            order={order}
          />
        ))}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{selectedOrder ? "Edit Order" : "Add New Order"}</h2>
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
              <label>Items:</label>
              <input
                type="text"
                onChange={(e) => setItems(e.target.value)}
                value={items}
                className={emptyFields.includes("items") ? "error" : ""}
              />
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
                type="text"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                className={emptyFields.includes("amount") ? "error" : ""}
              />
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
                <option value="Shipped">Shipped</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Bilty Invoice:</label>
              <input
                type="text"
                onChange={(e) => setBilty_invoice(e.target.value)}
                value={bilty_invoice}
                className={emptyFields.includes("bilty_invoice") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Bilty Receipt:</label>
              <input
                type="text"
                onChange={(e) => setBilty_receipt(e.target.value)}
                value={bilty_receipt}
                className={emptyFields.includes("bilty_receipt") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Truck Number:</label>
              <input
                type="text"
                onChange={(e) => setTruck_number(e.target.value)}
                value={truck_number}
                className={emptyFields.includes("truck_number") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Truck Name:</label>
              <input
                type="text"
                onChange={(e) => setTruck_name(e.target.value)}
                value={truck_name}
                className={emptyFields.includes("truck_name") ? "error" : ""}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Truck Contact No:</label>
              <input
                type="text"
                onChange={(e) => setTruck_contact_no(e.target.value)}
                value={truck_contact_no}
                className={emptyFields.includes("truck_contact_no") ? "error" : ""}
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

export default Orders;
