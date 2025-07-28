const { sequelize } = require('../config/dbconfig'); // Perbaiki typo sequilize -> sequelize
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            where: { email },
            transaction
        });

        if (existingUser) {
            await transaction.rollback();
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password
        }, { transaction });

        const payload = {
            user: {
                id: user.id,
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Perbaiki typo expressIn -> expiresIn
            (err, token) => {
                if (err) {
                    transaction.rollback();
                    throw err;
                }
                transaction.commit();
                res.status(201).json({ token });
            }
        );
    } catch (err) {
        await transaction.rollback();
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // Tambahkan destructuring untuk email
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password); // Gunakan password dari req.body
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err; // Hapus duplikasi pengecekan error
                res.json({ token }); // Pastikan response dikirim
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' }); // Konsisten menggunakan json()
    }
};