import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id) => {
    const payload = { id }; 
    return jwt.sign(
        payload, 
        JWT_SECRET, 
        {
            expiresIn: '15m', 
        }
    );
};

const generateRefreshToken = (id) => {
    return jwt.sign(
        { id }, 
        JWT_SECRET, 
        { expiresIn: '7d' } 
    );
};

export const signupUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required.",
        });
    }
    try {
        const user = await User.create({ email, password }); 
        const userResponse = {
            id: user._id,
            email: user.email,
        };
        return res.status(201).json({
            message: "User registered successfully.",
            user: userResponse,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Registration failed: This email is already registered.",
            });
        }
        console.error(error);
        return res.status(500).json({
            message: "An unexpected error occurred during registration.",
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid credentials' }); 
    }
    try {
        const user = await User.findOne({ email }).select('+password'); 
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        
        user.refreshToken = refreshToken; 
        await user.save();
        
        res.cookie('jwt', accessToken, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
            maxAge: 15 * 60 * 1000
        });
        
        return res.status(200).json({
            message: 'Login successful',
            refreshToken: refreshToken,
            user: { id: user._id, email: user.email },
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
    });

    res.status(200).json({ 
        message: 'Logged out successfully.' 
    });
};

export const getProfile = async (req, res) => {
    return res.status(200).json({
        message: 'Access granted to protected route!',
        user: {
            id: req.user._id,
            email: req.user.email,
        }
    });
};


export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body; 

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token required.' });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user || user.refreshToken !== refreshToken) {
            if(user) {
                user.refreshToken = undefined;
                await user.save(); 
            }
            return res.status(403).json({ message: 'Invalid or revoked Refresh Token.' });
        }

        const newAccessToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        
        user.refreshToken = newRefreshToken; 
        await user.save(); 

        res.cookie('jwt', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 
        });

        res.status(200).json({ 
            message: 'Access Token refreshed successfully.',
            refreshToken: newRefreshToken, 
            user: { id: user._id, email: user.email }
        });

    } catch (error) {
        console.error('Refresh Token Error:', error.message);
        return res.status(403).json({ message: 'Refresh Token expired. Please log in again.' });
    }
};