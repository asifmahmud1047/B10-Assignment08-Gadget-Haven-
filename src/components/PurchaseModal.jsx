import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "./PurchaseModal.css";

const PurchaseModal = ({ show, onClose }) => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const handleClose = () => {
    clearCart();
    onClose();
    navigate("/");
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>
        <h2>Congratulations!</h2>
        <p>Your purchase has been successful.</p>
        <p>Thank you for shopping with Gadget Heaven!</p>
        <button className="close-button" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

PurchaseModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PurchaseModal;
