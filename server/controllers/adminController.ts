import { Request, Response } from "express";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

export const isAdmin = (req: Request, res: Response) => {
  res.json({ success: true, message: "User is admin" });
};

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ isPaid: true });
    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() }
    }).populate("movie");
    const totalEarnings = bookings.reduce(
      (total, booking) => total + booking.amount,
      0
    );
    const totalUsers = await User.countDocuments();
    const dashboardData = {
      totalUsers,
      totalBookings: bookings.length,
      totalRevenue: totalEarnings,
      activeShows
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const getAllShows = async (req: Request, res: Response) => {
  try {
    const shows = await Show.find({showDateTime: { $gte: new Date() }}).populate("movie").sort({ showDateTime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find().populate('user').populate({
            path: 'show',
            populate: { path: 'movie' }
        }).sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ success: false, message: errorMessage });
    }
}
