const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Room = require('./models/Room');

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_management';

const citiesAndHotels = [
  { city: 'Tokyo', hotel: 'The Tokyo Imperial' },
  { city: 'Paris', hotel: 'L’Étoile Palace' },
  { city: 'New York', hotel: 'Manhattan Grand' },
  { city: 'London', hotel: 'The Monarch' },
  { city: 'Dubai', hotel: 'Burj Horizon' },
  { city: 'Singapore', hotel: 'Marina Heights' },
  { city: 'Maldives', hotel: 'Azure Atoll Resort' },
  { city: 'Rome', hotel: 'Villa Romana' },
  { city: 'Sydney', hotel: 'Harbour Vista Hotel' },
  { city: 'Los Angeles', hotel: 'Beverly Hills Oasis' },
  { city: 'Hong Kong', hotel: 'The Peak Residences' },
  { city: 'Shanghai', hotel: 'Oriental Pearl Inn' },
  { city: 'Seoul', hotel: 'Gangnam Skyline' },
  { city: 'Bali', hotel: 'Ubud Jungle Resort' },
  { city: 'Barcelona', hotel: 'Gaudí Retreat' },
  { city: 'Istanbul', hotel: 'Bosphorus Palace' },
  { city: 'Amsterdam', hotel: 'Canal Boutique Hotel' },
  { city: 'Vienna', hotel: 'Habsburg Grand' },
  { city: 'Prague', hotel: 'Bohemian Castle Suites' },
  { city: 'Venice', hotel: 'Grand Canal Resort' },
  { city: 'Rio de Janeiro', hotel: 'Copacabana Pearl' },
  { city: 'Cape Town', hotel: 'Table Mountain Lodge' },
  { city: 'Santorini', hotel: 'Oia Cliffside Villas' },
  { city: 'Kyoto', hotel: 'Zen Garden Ryokan' },
  { city: 'Zurich', hotel: 'Alpine Peak Hotel' }
];

const roomTypes = ['single', 'double', 'suite', 'deluxe'];

const getRandomAmenities = (type) => {
  const baseAmenities = ['Free WiFi', 'Air Conditioning', 'Flat-screen TV'];
  if (type === 'suite' || type === 'deluxe') {
    return [...baseAmenities, 'Mini Bar', 'Ocean/City View', 'Room Service', 'Spa Access'];
  }
  return baseAmenities;
};

const getRandomPrice = (type) => {
  switch (type) {
    case 'single': return Math.floor(Math.random() * 100) + 100; // 100-200
    case 'double': return Math.floor(Math.random() * 150) + 200; // 200-350
    case 'deluxe': return Math.floor(Math.random() * 300) + 400; // 400-700
    case 'suite': return Math.floor(Math.random() * 1500) + 800; // 800-2300
    default: return 150;
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for global seeding...');

    // Clear existing data
    await User.deleteMany();
    await Room.deleteMany();
    console.log('Existing DB cleared.');

    // Seed Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin Faculty',
      email: 'admin@hotel.com',
      password: adminPassword,
      role: 'admin',
      phone: '123-456-7890',
      address: 'Global HQ',
    });
    console.log(`Global Admin created: ${admin.email}`);

    // Seed Rooms
    const roomsToSeed = [];
    let roomCounter = 100;

    for (const location of citiesAndHotels) {
      // 4 rooms per hotel/city
      for (let i = 0; i < 4; i++) {
        const rType = roomTypes[i % 4];
        const capacity = rType === 'single' ? 1 : (rType === 'suite' ? 4 : 2);
        const bgIndex = (i % 3) + 1; // 1, 2, or 3

        roomsToSeed.push({
          hotelName: location.hotel,
          city: location.city,
          roomNumber: `${location.city.substring(0,3).toUpperCase()}-${roomCounter++}`,
          type: rType,
          capacity: capacity,
          pricePerNight: getRandomPrice(rType),
          description: `Experience ultimate luxury at ${location.hotel} in the heart of ${location.city}. This ${rType} room offers everything you need for a perfect stay.`,
          amenities: getRandomAmenities(rType),
          image: `/backdrops/bg${bgIndex}.png`
        });
      }
    }

    await Room.insertMany(roomsToSeed);
    console.log(`${roomsToSeed.length} global luxury rooms created across ${citiesAndHotels.length} cities.`);

    console.log('Global Database Seeding Completed Successfully! 🌍✈️');
    process.exit();

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
