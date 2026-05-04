import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: '',
    provider: 'SWIFT',
    payeeAccountNumber: '',
    swiftCode: '',
    payeeName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { amount, currency, provider, payeeAccountNumber, swiftCode, payeeName } = formData;
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Set up axios auth header
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Load payment history
    loadPaymentHistory();
  }, [navigate]);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/payment/my-payments');
      setPayments(response.data);
    } catch (err) {
      console.error('Failed to load payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); const validateInput = () => {
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    const allowedCurrencies = ['USD', 'EUR', 'GBP', 'ZAR', 'JPY'];
    const accountRegex = /^[A-Z0-9]{15,34}$/; // IBAN format to match backend
    const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;

    if (!amount || !amountRegex.test(amount)) {
      setError('Amount should be a valid number');
      return false;
    }

    if (!currency || !allowedCurrencies.includes(currency)) {
      setError('Please select a valid currency');
      return false;
    }

    if (!payeeName || !nameRegex.test(payeeName)) {
      setError('Payee name should contain only letters and spaces (2-50 characters)');
      return false;
    }

    if (!payeeAccountNumber || !accountRegex.test(payeeAccountNumber)) {
      setError('Invalid IBAN format (15-34 alphanumeric characters)');
      return false;
    }

    if (!swiftCode || !swiftRegex.test(swiftCode)) {
      setError('Invalid SWIFT code format');
      return false;
    }

    return true;
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateInput()) return; try {
      setLoading(true);
      await axios.post('/api/payment/create', formData);
      setSuccess('Payment submitted successfully! Your payment is now pending verification.');
      setFormData({
        amount: '',
        currency: '',
        provider: 'SWIFT',
        payeeAccountNumber: '',
        swiftCode: '',
        payeeName: ''
      });

      // Reload payment history
      await loadPaymentHistory();
    } catch (err) {
      console.error('Payment submission error:', err);
      const errorMessage = err.response?.data?.msg ||
        err.response?.data?.message ||
        'Payment failed. Please try again.';
      setError(errorMessage);
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-topbar">
        <div className="brand-section">
          <h1>GlobalPay</h1>
          <span>International Payment Portal</span>
        </div>
        <button className="logout-btn-modern" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dashboard-grid">

        {/* LEFT SIDE — PAYMENT FORM */}
        <div className="card glass-card">
          <div className="card-header">
            <h2>New International Transfer</h2>
            <p>Secure SWIFT payment processing</p>
          </div>

          {error && <div className="alert error-alert">{error}</div>}
          {success && <div className="alert success-alert">{success}</div>}

          <form onSubmit={onSubmit} className="modern-form">
            <div className="form-row">
              <div className="input-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1000000"
                  name="amount"
                  value={amount}
                  onChange={onChange}
                  placeholder="1000.00"
                  required
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label>Currency</label>
                <select name="currency" value={currency} onChange={onChange} required disabled={loading}>
                  <option value="">Select</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="ZAR">ZAR</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Recipient Name</label>
              <input
                type="text"
                name="payeeName"
                value={payeeName}
                onChange={onChange}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label> Account Number</label>
              <input
                type="text"
                name="payeeAccountNumber"
                value={payeeAccountNumber}
                onChange={onChange}
                placeholder="DE89370400440532013000"
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>SWIFT Code</label>
                <input
                  type="text"
                  name="swiftCode"
                  value={swiftCode}
                  onChange={onChange}
                  placeholder="MNPCZAR8XXX"
                  required
                  disabled={loading}
                />
                {/* <small>BankCode + Country + Location + Branch</small> */}
              </div>

              <div className="input-group">
                <label>Provider</label>
                <select name="provider" value={provider} onChange={onChange} disabled={loading}>
                  <option value="SWIFT">SWIFT</option>
                </select>
              </div>
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE — PAYMENT HISTORY */}
        <div className="card glass-card">
          <div className="card-header">
            <h2>Transaction History</h2>
            <p>Your recent international payments</p>
          </div>

          {loading && !payments.length ? (
            <div className="empty-state">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="empty-state">No payments yet.</div>
          ) : (
            <div className="history-list">
              {payments.map((payment, index) => (
                <div key={payment._id || index} className="history-item">
                  <div className="history-top">
                    <div>
                      <span className="reference">Ref: {payment.referenceNumber}</span>
                      <span className="amount-display">
                        {payment.currency} {payment.amount}
                      </span>
                    </div>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status}
                    </span>
                  </div>

                  <div className="history-details">
                    <div>
                      <strong>Recipient:</strong> {payment.payeeName}
                    </div>
                    <div>
                      <strong>Account:</strong> {payment.payeeAccountNumber}
                    </div>
                    <div>
                      <strong>SWIFT:</strong> {payment.swiftCode}
                    </div>
                    <div>
                      <strong>Submitted:</strong> {new Date(payment.createdAt).toLocaleString()}
                    </div>
                    {payment.verifiedAt && (
                      <div>
                        <strong>Verified:</strong> {new Date(payment.verifiedAt).toLocaleString()}
                      </div>
                    )}
                    {payment.rejectionReason && (
                      <div className="rejection">
                        <strong>Rejection:</strong> {payment.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
