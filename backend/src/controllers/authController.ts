import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { generateToken, AuthRequest } from "../middleware/authMiddleware";

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
      favorites: [],
    });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        favorites: user.favorites,
        token,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        favorites: user.favorites,
        token,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(req.user._id).select("-password").populate("favorites");

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch profile",
    });
  }
};

// @desc    Toggle favorite song for logged in user (persisted in DB!)
// @route   POST /api/auth/favorites/:songId
export const toggleFavoriteSong = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { songId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const favoriteIndex = user.favorites.findIndex(
      (id) => id.toString() === songId
    );

    let isFav = false;
    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1);
      isFav = false;
    } else {
      user.favorites.push(songId as any);
      isFav = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: isFav ? "Song added to MongoDB favorites!" : "Song removed from MongoDB favorites!",
      data: {
        songId,
        isFavorite: isFav,
        favorites: user.favorites,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update favorites",
    });
  }
};
