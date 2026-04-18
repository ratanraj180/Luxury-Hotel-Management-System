import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRoom, setNewRoom] = useState({
    hotelName: '',
    city: '',
    roomNumber: '',
    type: 'single',
    capacity: 1,
    pricePerNight: 0,
    description: '',
    amenities: ''
  });
  const [showAddRoom, setShowAddRoom] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      return;
    }
    fetchData();
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'bookings') {
        const response = await API.get('/bookings');
        setBookings(response.data);
      } else if (activeTab === 'rooms') {
        const response = await API.get('/rooms');
        setRooms(response.data);
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await API.post('/rooms', {
        hotelName: newRoom.hotelName,
        city: newRoom.city,
        roomNumber: newRoom.roomNumber,
        type: newRoom.type,
        capacity: parseInt(newRoom.capacity),
        pricePerNight: parseFloat(newRoom.pricePerNight),
        description: newRoom.description,
        amenities: newRoom.amenities.split(',').map(a => a.trim())
      });

      setNewRoom({
        hotelName: '',
        city: '',
        roomNumber: '',
        type: 'single',
        capacity: 1,
        pricePerNight: 0,
        description: '',
        amenities: ''
      });
      setShowAddRoom(false);
      fetchData();
    } catch (err) {
      setError('Failed to add room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await API.delete(`/rooms/${roomId}`);
      fetchData();
    } catch (err) {
      setError('Failed to delete room');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  if (!isAuthenticated) {
    return <div className="admin-container"><p>Please login to access admin dashboard</p></div>;
  }

  if (!isAdmin()) {
    return <div className="admin-container"><p>You do not have permission to access this page</p></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Manage Bookings
        </button>
        <button
          className={`tab ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          Manage Rooms
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <p>Loading...</p>
        ) : activeTab === 'bookings' ? (
          <div className="bookings-section">
            <h2>All Bookings</h2>
            {bookings.length === 0 ? (
              <p>No bookings found</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.user.name}</td>
                      <td>Room {booking.room.roomNumber}</td>
                      <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                      <td>${booking.totalPrice}</td>
                      <td>
                        <select
                          value={booking.status}
                          onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => alert(`Email: ${booking.user.email}\nPhone: ${booking.user.phone}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="rooms-section">
            <div className="rooms-header">
              <h2>All Rooms</h2>
              <button
                className="btn-add"
                onClick={() => setShowAddRoom(!showAddRoom)}
              >
                {showAddRoom ? 'Cancel' : 'Add New Room'}
              </button>
            </div>

            {showAddRoom && (
              <form className="add-room-form" onSubmit={handleAddRoom}>
                <div className="form-group">
                  <label>Hotel Name:</label>
                  <input
                    type="text"
                    value={newRoom.hotelName}
                    onChange={(e) => setNewRoom({ ...newRoom, hotelName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    value={newRoom.city}
                    onChange={(e) => setNewRoom({ ...newRoom, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Room Number:</label>
                  <input
                    type="text"
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type:</label>
                  <select
                    value={newRoom.type}
                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                    <option value="deluxe">Deluxe</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacity:</label>
                  <input
                    type="number"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price per Night:</label>
                  <input
                    type="number"
                    value={newRoom.pricePerNight}
                    onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Amenities (comma separated):</label>
                  <input
                    type="text"
                    value={newRoom.amenities}
                    onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                    placeholder="WiFi, TV, AC"
                  />
                </div>
                <button type="submit" className="btn-submit">Add Room</button>
              </form>
            )}

            {rooms.length === 0 ? (
              <p>No rooms found</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Hotel Name</th>
                    <th>City</th>
                    <th>Room Number</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Price/Night</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room._id}>
                      <td>{room.hotelName}</td>
                      <td>{room.city}</td>
                      <td>{room.roomNumber}</td>
                      <td>{room.type}</td>
                      <td>{room.capacity}</td>
                      <td>${room.pricePerNight}</td>
                      <td>
                        <span className={`availability ${room.isAvailable ? 'available' : 'unavailable'}`}>
                          {room.isAvailable ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteRoom(room._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
