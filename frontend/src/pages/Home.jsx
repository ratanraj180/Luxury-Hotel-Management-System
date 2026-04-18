import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './home.css';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', priceMax: 5000, city: '' });
  const [bgIndex, setBgIndex] = useState(0);
  const { isAuthenticated } = useAuth();

  const backgrounds = [
    '/backdrops/bg1.png',
    '/backdrops/bg2.png',
    '/backdrops/bg3.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  const fetchCities = async () => {
    try {
      const response = await API.get('/rooms/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      let query = `priceMax=${filters.priceMax}`;
      if (filters.type) query += `&type=${filters.type}`;
      if (filters.city) query += `&city=${filters.city}`;

      const response = await API.get(`/rooms?${query}`);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="home-page">
      <div className="bg-container">
        <div className="bg-overlay"></div>
        {backgrounds.map((bg, index) => (
          <div 
            key={index}
            className={`bg-image ${index === bgIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
      </div>

      <div className="hero-section fade-in">
        <h1>Hotel Luxury</h1>
        <p>Experience the pulse of the city in unparalleled comfort.</p>
      </div>

      <div className="container">
        <div className="filters-panel fade-in">
          <h3>Personalize Your Stay</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Destination</label>
              <select 
                name="city" 
                value={filters.city} 
                onChange={handleFilterChange}
                className="custom-select"
              >
                <option value="">Global Destinations</option>
                {cities.map((city, idx) => (
                  <option key={idx} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Room Category</label>
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
                className="custom-select"
              >
                <option value="">All Collections</option>
                <option value="single">Single Suite</option>
                <option value="double">Double Deluxe</option>
                <option value="suite">Presidential Suite</option>
              </select>
            </div>

            <div className="filter-group">
              <div className="price-slider-container">
                <div className="price-range-info">
                  <label>Max Budget</label>
                  <span>${filters.priceMax} / night</span>
                </div>
                <input 
                  type="range"
                  name="priceMax"
                  min="50"
                  max="5000"
                  step="50"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  className="modern-slider"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rooms-grid">
          {loading ? (
            <div className="no-rooms-msg">
              <h3>Curating your collection...</h3>
            </div>
          ) : rooms.length === 0 ? (
            <div className="no-rooms-msg">
              <h3>No rooms match your preference.</h3>
              <p style={{color: '#ff6b6b', marginTop: '10px'}}>
                 ⚠️ Connection Error! Your frontend cannot reach your backend. <br />
                 Tried reaching: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
              </p>
              <p>Try adjusting your filters or ensure your Backend is running on Render.</p>
            </div>
          ) : (
            rooms.map((room, idx) => (
              <div key={room._id} className="room-card fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="room-image-wrapper">
                  <span className="price-tag">${room.pricePerNight}</span>
                  {room.image ? (
                    <img src={room.image} alt={room.roomNumber} />
                  ) : (
                    <div className="no-image">Luxury Preview Unavailable</div>
                  )}
                </div>
                <div className="room-details">
                  <h3 className="hotel-name">{room.hotelName}</h3>
                  <h4 className="room-title">Room {room.roomNumber} - {room.city}</h4>
                  <div className="room-meta">
                    <span><i className="fas fa-bed"></i> {room.type}</span>
                    <span><i className="fas fa-users"></i> {room.capacity} Guests</span>
                  </div>
                  <p className="room-desc">{room.description}</p>
                  <div className="amenities-chips">
                    {room.amenities?.map((a, i) => (
                      <span key={i} className="chip">{a}</span>
                    ))}
                  </div>
                  <div className="room-actions">
                    <Link 
                      to={isAuthenticated ? `/book-room/${room._id}` : '/login'} 
                      className="btn btn-primary"
                    >
                      {isAuthenticated ? 'Reserve Now' : 'Sign in to Reserve'}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
