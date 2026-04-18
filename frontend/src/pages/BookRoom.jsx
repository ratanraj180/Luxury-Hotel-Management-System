import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './booking.css';

const BookRoom = () => {
  const { id } = useParams();
  const roomId = id;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchRoom();
  }, []);

  const fetchRoom = async () => {
    try {
      const response = await API.get(`/rooms/${roomId}`);
      setRoom(response.data);
    } catch (err) {
      setError('Failed to fetch room details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotalPrice = () => {
    if (!room || !bookingData.checkInDate || !bookingData.checkOutDate) return 0;
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * room.pricePerNight : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBookingLoading(true);

    try {
      const response = await API.post('/bookings', {
        roomId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: parseInt(bookingData.numberOfGuests),
        specialRequests: bookingData.specialRequests
      });

      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) return <div className="booking-container"><p>Loading...</p></div>;

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2>Book a Room</h2>

        {room && (
          <div className="room-details">
            <h3>Room {room.roomNumber}</h3>
            <p><strong>Type:</strong> {room.type}</p>
            <p><strong>Capacity:</strong> {room.capacity} guests</p>
            <p><strong>Price per Night:</strong> ${room.pricePerNight}</p>
            <p><strong>Description:</strong> {room.description}</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Check-in Date:</label>
            <input
              type="date"
              name="checkInDate"
              value={bookingData.checkInDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Check-out Date:</label>
            <input
              type="date"
              name="checkOutDate"
              value={bookingData.checkOutDate}
              onChange={handleInputChange}
              required
              min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Number of Guests:</label>
            <input
              type="number"
              name="numberOfGuests"
              value={bookingData.numberOfGuests}
              onChange={handleInputChange}
              min="1"
              max={room?.capacity || 10}
              required
            />
          </div>

          <div className="form-group">
            <label>Special Requests:</label>
            <textarea
              name="specialRequests"
              value={bookingData.specialRequests}
              onChange={handleInputChange}
              rows="4"
              placeholder="Any special requests?"
            ></textarea>
          </div>

          <div className="price-summary">
            <h4>Booking Summary</h4>
            <p><strong>Total Price:</strong> ${calculateTotalPrice()}</p>
          </div>

          <button type="submit" disabled={bookingLoading}>
            {bookingLoading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookRoom;
