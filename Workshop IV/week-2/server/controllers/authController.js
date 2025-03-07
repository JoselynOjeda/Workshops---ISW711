// controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({
            username: username,
            password: password  // Directamente pasa la contraseña sin hashear
        });

        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error registering new user');
    }
};

// Función para autenticar un usuario
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('User not found');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send('Password is incorrect');
        }

        const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Error during authentication');
    }
};
