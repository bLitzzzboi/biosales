import React from 'react';
import './Sidebar.css';
import { ImUsers } from "react-icons/im";
import { AiFillCopy } from "react-icons/ai";
import { FaArchive, FaBoxes } from "react-icons/fa";
import { MdEditCalendar, MdEmojiTransportation, MdContactEmergency,MdReceipt } from "react-icons/md";

const Sidebar = ({ activePage, onPageChange }) => {
  const handleButtonClick = (page) => {
    console.log('page', page);
    onPageChange(page);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <div className="logo">
          <img src="/bflogo_2.png" alt="BioSales Logo" />
        </div>
        <ul className="sidebar-menu">
          <li className={activePage === 'workouts' ? 'active' : ''}>
            <button
              onClick={() => handleButtonClick('workouts')}
              className={`sidebar-btn ${activePage === 'workouts' ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><ImUsers /></span> Users
            </button>
          </li>
          <li className={activePage === 'receipts' ? 'active' : ''}>
            <button
              onClick={() => handleButtonClick('receipts')}
              className={`sidebar-btn ${activePage === 'receipts' ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><AiFillCopy /></span> Receipts
            </button>
          </li>
          <li className={activePage === 'orders' ? 'active' : ''}>
            <button
              onClick={() => handleButtonClick('orders')}
              className={`sidebar-btn ${activePage === 'orders' ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><FaArchive /></span> Orders
            </button>
          </li>
          <li className={activePage === 'products' ? 'active' : ''}>
            <button
              onClick={() => handleButtonClick('products')}
              className={`sidebar-btn ${activePage === 'products' ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><FaBoxes /></span> Products
            </button>
          </li>
          <li className={activePage === 'Farmer_Meetings' ? 'active' : ''}>
            <button
              onClick={() => handleButtonClick('Farmer_Meetings')}
              className={`sidebar-btn ${activePage === 'Farmer_Meetings' ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><MdEditCalendar /></span> Farmer Meetings
            </button>
          </li>
          <li className={activePage === 'Daily_Visits' ? 'active' : ''}>
            <button
              onClick={() => handleButtonClick('Daily_Visits')}
              className={`sidebar-btn ${activePage === 'Daily_Visits' ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><MdEmojiTransportation /></span> Daily Visits
            </button>
          </li>
          <li className={activePage === 'Dealers' ? 'active' : ''}>
            <button
              onClick={() => handleButtonClick('Dealers')}
              className={`sidebar-btn ${activePage === 'Dealers' ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><MdContactEmergency /></span> Dealers
            </button>
          </li>
          <li className={activePage === 'Policys' ? 'active' : ''}>
            <button
              onClick={() => handleButtonClick('Policys')}
              className={`sidebar-btn ${activePage === 'Policys' ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><MdReceipt /></span> Policies
            </button>
          </li>
          <li className={activePage === 'CreditNotes' ? 'active' : ''}>
            <button
              onClick={() => handleButtonClick('CreditNotes')}
              className={`sidebar-btn ${activePage === 'CreditNotes' ? 'active' : ''}`}
            >
              <span className="sidebar-icon"><MdReceipt /></span> Credit Notes
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
