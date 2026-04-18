const jwt = require('jsonwebtoken');
const User = require('../models/User');
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email exists' });
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: genToken(user._id), user: { id: user._id, name, email, role: user.role } });
  } catch(e) { res.status(500).json({ message: e.message }); }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: genToken(user._id), user: { id: user._id, name: user.name, email, role: user.role } });
  } catch(e) { res.status(500).json({ message: e.message }); }
};