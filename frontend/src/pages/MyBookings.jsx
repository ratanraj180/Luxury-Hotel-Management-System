import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './my-bookings.css';

const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      const response = await API.get('/bookings/user/my-bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  if (!isAuthenticated) {
    return <div className="my-bookings-container"><p>Please login to view your bookings</p></div>;
  }

  return (
    <div className="my-bookings-container">
      <div className="bookings-card">
        <h2>My Bookings</h2>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="no-bookings">You don't have any bookings yet</p>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking._id} className="booking-item">
                <div className="booking-header">
                  <h3>Room {booking.room.roomNumber}</h3>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="label">Type:</span>
                    <span className="value">{booking.room.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Check-in:</span>
                    <span className="value">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Check-out:</span>
                    <span className="value">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Guests:</span>
                    <span className="value">{booking.numberOfGuests}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Total Price:</span>
                    <span className="value price">${booking.totalPrice}</span>
                  </div>
                  {booking.specialRequests && (
                    <div className="detail-row">
                      <span className="label">Special Requests:</span>
                      <span className="value">{booking.specialRequests}</span>
                    </div>
                  )}
                </div>

                <div className="booking-actions">
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancel(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
