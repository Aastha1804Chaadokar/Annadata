import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isDatabaseConnected } from '../db/connection.js';

export async function registerUser(req: Request, res: Response) {
  try {
    const { name, mobile, password, language, state, district } = req.body;

    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanMobile = typeof mobile === 'string' ? mobile.replace(/\D/g, '') : '';
    const cleanPassword = typeof password === 'string' ? password.trim() : '';

    if (!cleanName || !cleanMobile || !cleanPassword) {
      return res.status(400).json({
        success: false,
        error: 'Full name, 10-digit mobile number, and password are required.',
      });
    }

    if (cleanMobile.length !== 10) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number.',
      });
    }

    if (cleanPassword.length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 4 characters.',
      });
    }

    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database service is temporarily unavailable. Please try again.',
      });
    }

    const existingUser = await User.findOne({ mobile: cleanMobile });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this mobile number already exists. Please login.',
      });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    const user = await User.create({
      name: cleanName,
      mobile: cleanMobile,
      password: hashedPassword,
      language: language || 'hi',
      state: state || '',
      district: district || '',
    });

    const token = `token_${user._id}_${Date.now()}`;

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          language: user.language,
          state: user.state,
          district: user.district,
        },
      },
    });
  } catch (error: any) {
    if (
      error.name === 'MongooseError' ||
      error.name === 'MongoServerSelectionError' ||
      error.name === 'MongoNetworkError' ||
      !isDatabaseConnected()
    ) {
      return res.status(503).json({
        success: false,
        error: 'Database service is temporarily unavailable.',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.',
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { mobile, password } = req.body;

    const cleanMobile = typeof mobile === 'string' ? mobile.replace(/\D/g, '') : '';
    const cleanPassword = typeof password === 'string' ? password.trim() : '';

    if (!cleanMobile || !cleanPassword) {
      return res.status(400).json({
        success: false,
        error: 'Mobile number and password are required.',
      });
    }

    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database service is temporarily unavailable. Please try again.',
      });
    }

    const user = await User.findOne({ mobile: cleanMobile });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid mobile number or password.',
      });
    }

    // Verify password using bcrypt
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(cleanPassword, user.password);
    } catch {
      isMatch = false;
    }

    // Support automatic migration if a legacy plaintext password existed
    if (!isMatch && user.password === cleanPassword) {
      isMatch = true;
      user.password = await bcrypt.hash(cleanPassword, 10);
      await user.save();
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid mobile number or password.',
      });
    }

    const token = `token_${user._id}_${Date.now()}`;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          mobile: user.mobile,
          language: user.language,
          state: user.state,
          district: user.district,
        },
      },
    });
  } catch (error: any) {
    if (
      error.name === 'MongooseError' ||
      error.name === 'MongoServerSelectionError' ||
      error.name === 'MongoNetworkError' ||
      !isDatabaseConnected()
    ) {
      return res.status(503).json({
        success: false,
        error: 'Database service is temporarily unavailable.',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Login failed. Please check your credentials.',
    });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    res.clearCookie('annadata_session');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully from Annadata session.',
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Logout failed.',
    });
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Unauthorized session. Please login.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const parts = token.split('_');
    if (parts.length >= 2) {
      const userId = parts[1];
      if (isDatabaseConnected()) {
        const user = await User.findById(userId);
        if (user) {
          return res.status(200).json({
            success: true,
            data: {
              user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                language: user.language,
                state: user.state,
                district: user.district,
              },
            },
          });
        }
      }
    }

    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid. Please login again.',
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: 'Session lookup failed.',
    });
  }
}
