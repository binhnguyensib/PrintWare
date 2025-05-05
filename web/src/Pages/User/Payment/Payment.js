import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../Styles/Payment.css"; // CSS styles imported
import printingServiceImage from "../../../innerImg/printing-service.webp"; // Import the image

const Payment = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [error, setError] = useState("");

  const handlePay = () => {
    if (!selectedPayment) {
      setError("Please select a payment method!");
    } else {
      setError("");
      navigate("/confirmation");
    }
  };

  return (
    <div
      className="payment-container"
      style={{
        backgroundImage: `url(${printingServiceImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "95vh",
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="payment-box" style={{ background: "rgba(255, 255, 255, 0.9)", padding: "20px", borderRadius: "10px", maxWidth: "500px", width: "100%" }}>
        <h2 className="payment-title">Select Payment Method</h2>
        <div className="payment-methods">
          <div
            className={`payment-option ${selectedPayment === "Momo" ? "selected" : ""}`}
            onClick={() => setSelectedPayment("Momo")}
          >
            <input
              type="radio"
              name="payment"
              value="Momo"
              checked={selectedPayment === "Momo"}
              onChange={() => setSelectedPayment("Momo")}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
              alt="Momo"
            />
            <span>Momo</span>
          </div>
          <div
            className={`payment-option ${selectedPayment === "Visa" ? "selected" : ""}`}
            onClick={() => setSelectedPayment("Visa")}
          >
            <input
              type="radio"
              name="payment"
              value="Visa"
              checked={selectedPayment === "Visa"}
              onChange={() => setSelectedPayment("Visa")}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
            />
            <span>Visa</span>
          </div>
          <div
            className={`payment-option ${selectedPayment === "PayPal" ? "selected" : ""}`}
            onClick={() => setSelectedPayment("PayPal")}
          >
            <input
              type="radio"
              name="payment"
              value="PayPal"
              checked={selectedPayment === "PayPal"}
              onChange={() => setSelectedPayment("PayPal")}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
            />
            <span>PayPal</span>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="actions">
          <button className="secondary-button" onClick={() => navigate("/order")}>
            Back
          </button>
          <button className="primary-button" onClick={handlePay}>
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;