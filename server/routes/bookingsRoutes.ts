import express from "express";
import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";

const bookingsRouter = express.Router();

bookingsRouter.post("/create", createBooking);
bookingsRouter.get("/seats/:showId", getOccupiedSeats);

export default bookingsRouter;