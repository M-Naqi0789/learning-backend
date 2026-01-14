import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
    let token;
    token = req.cookies.jwt; 

    if (!token) {
        return res.status(401).json({ 
            message: 'Not authorized, no token present.' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); //
        req.user = await User.findById(decoded.id).select('-password'); //

        if (!req.user) {
            return res.status(401).json({ 
                message: 'Not authorized, user not found.' 
            });
        }
        next(); 
    } catch (error) {
        res.clearCookie('jwt'); 
        return res.status(401).json({ 
            message: 'Not authorized, token failed verification or expired.' 
        });
    }
};