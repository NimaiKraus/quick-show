import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import BookSeat from "./pages/BookSeat";
import { StrictMode } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import Favorites from "./pages/Favorites";
import MyBookings from "./pages/MyBookings";

const App = () => {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
  }

  return (
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ClerkProvider>
    </StrictMode>
  )
}

const AppLayout = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<BookSeat />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      {/* {!isAdminRoute && <Footer />} */}
    </>
  );
};

export default App