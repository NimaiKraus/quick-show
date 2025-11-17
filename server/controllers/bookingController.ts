import { Request, Response } from "express";
import ShowModel from "../models/Show.js";
import { Booking, CreateBookingRequestBody, Show } from "../types/index.js";
import BookingModel from "../models/Booking.js";
import { getAuth } from "@clerk/express";

const checkSeatsAvailability = async (
  showId: string,
  selectedSeats: string[]
): Promise<boolean> => {
  try {
    const show = await ShowModel.findById(showId);
    if (!show) return false;
    const occupiedSeats = show.occupiedSeats;
    const isAnySeatTaken = selectedSeats.some(
      (seat) => !occupiedSeats.includes(seat)
    );
    return !isAnySeatTaken;
  } catch (error) {
    console.error("Error checking seat availability:", error);
    return false;
  }
};

export const createBooking = async (
  req: Request<{}, {}, CreateBookingRequestBody>,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const areSeatsAvailable = await checkSeatsAvailability(
      showId,
      selectedSeats
    );
    if (!areSeatsAvailable) {
      return res.status(409).json({
        success: false,
        message: "Selected seats are no longer available.",
      });
    }

    const show = await ShowModel.findById(showId).populate("movie");

    const booking: Omit<Booking, "_id"> = {
      user: userId,
      show: showId,
      amount: (show?.showPrice ?? 0) * selectedSeats.length,
      bookedSeats: selectedSeats,
      isPaid: false,
    };

    const newBooking = await BookingModel.create(booking);

    selectedSeats.map((seat) => {
        (show as unknown as Show).occupiedSeats[seat] = userId;
    });

    show?.markModified("occupiedSeats");
    await show?.save();

    // STRIPE Gateway initialization can be done here

    return res.json({
      success: true,
      message: "Booking created successfully.",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res
      .status(500)
      .json({ success: false, message: errorMessage });
  }
};

export const getOccupiedSeats = async (req: Request, res: Response) => {
  try {
    const { showId } = req.params;
    const show = await ShowModel.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }
    return res.json({ success: true, occupiedSeats: Object.keys(show.occupiedSeats) });
  } catch (error) {
    console.error("Error fetching occupied seats:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res
      .status(500)
      .json({ success: false, message: errorMessage });
  }
};
