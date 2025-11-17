import express from "express";
import { protectAdminRoute } from "../middleware/auth.js";
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/is-admin", protectAdminRoute, isAdmin);
adminRouter.get("/dashboard", protectAdminRoute, getDashboardData);
adminRouter.get("/all-shows", protectAdminRoute, getAllShows);
adminRouter.get("/all-bookings", protectAdminRoute, getAllBookings);

export default adminRouter;