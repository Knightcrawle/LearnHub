import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './payment.css';
import QRCode from 'react-qr-code';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your actual Stripe public key
const stripePromise = loadStripe('your_stripe_public_key');

const PaymentPage = () => {
  const location = useLocation();
  const { course } = location.state || {};
  const [method, setMethod] = useState('card');
  const [upiUrl, setUpiUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleMethodChange = (selectedMethod) => {
    setMethod(selectedMethod);
    setMessage('');
  };

  useEffect(() => {
    if (method === 'upi' && course) {
      const upiId = 'LearnHubupi@bank';
      const amount = course.price;
      const upiLink = `upi://pay?pa=${upiId}&pn=LearnHub&am=${amount}&cu=INR`;
      setUpiUrl(upiLink);
    }
  }, [method, course]);

  return (
    <div className="payment-container">
      <img src="/src/assets/logo.svg" alt="Logo" className="logo" />
      <h2>Pay for {course?.name}</h2>

      <div className="payment-option">
        <button className={method === 'card' ? 'active' : ''} onClick={() => handleMethodChange('card')}>Card</button>
        <button className={method === 'upi' ? 'active' : ''} onClick={() => handleMethodChange('upi')}>UPI</button>
      </div>

      {method === 'card' && (
        <Elements stripe={stripePromise}>
          <CardPaymentForm amount={course?.price} setMessage={setMessage} message={message} />
        </Elements>
      )}

      {method === 'upi' && upiUrl && (
        <div id="upi" className="payment-method">
          <p>Scan this QR Code using any UPI App</p>
          <QRCode value={upiUrl} size={250} />
          <p><strong>Amount:</strong> ₹{course?.price}</p>
          <p><strong>UPI ID:</strong> LearnHubupi@bank</p>
          <button
            className="pay-btn"
            onClick={() => alert(`Please confirm ₹${course?.price} payment in your UPI app.`)}
          >
            I have paid via UPI
          </button>
        </div>
      )}
    </div>
  );
};

// Stripe Payment Component
const CardPaymentForm = ({ amount, setMessage, message }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleCardPayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const { error, token } = await stripe.createToken(card);

    if (error) {
      setMessage(error.message);
    } else {
      try {
        const res = await fetch('http://localhost:8001/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token.id, amount }),
        });

        const data = await res.json();
        setMessage(data.success ? 'Payment successful!' : 'Payment failed!');
      } catch (err) {
        setMessage('Server error during payment.');
        console.log(err);
      }
    }
  };

  return (
    <form onSubmit={handleCardPayment} id="payment-form">
      <div className="stripe-elements">
        <CardElement />
      </div>
      <button className="pay-btn" disabled={!stripe}>
        Pay ₹{amount} with Card
      </button>
      <p
        id="payment-message"
        style={{ color: message.includes('success') ? 'green' : 'red' }}
      >
        {message}
      </p>
    </form>
  );
};

export default PaymentPage;
