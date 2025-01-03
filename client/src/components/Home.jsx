import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/home.css';
import { AuthContext } from '../contexts/AuthContext';
import { fetchHomeData } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const ROWS = 12; // 11 rows with 7 seats + 1 row with 3 seats
const SEATS_PER_ROW = 7;
const LAST_ROW_SEATS = 3;

const Home = () => {
  const { auth, logout } = useContext(AuthContext);
  const [seats, setSeats] = useState(Array(80).fill(false)); // False = available, True = reserved
  const [numSeats, setNumSeats] = useState('');
  const [bookedSeats, setBookedSeats] = useState([]); // Track the recently booked seats
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  useEffect(() => {
    // Optionally, fetch initial data from backend if available
    // For simplicity, keeping seats state on frontend
  }, []);

  const bookSeats = () => {
    const num = parseInt(numSeats, 10);

    if (isNaN(num) || num < 1 || num > 7) {
      toast.error('You can reserve between 1 and 7 seats at a time.');
      return;
    }

    const availableSeats = [];
    seats.forEach((seat, index) => {
      if (!seat) availableSeats.push(index);
    });

    if (availableSeats.length < num) {
      toast.error(`Booking failed, only ${availableSeats.length} seats are available.`);
      return;
    }

    // Set loading state to true
    setIsLoading(true);

    // Simulate a delay to mimic booking process
    setTimeout(() => {
      const newBookedSeats = [];
      outerLoop: for (let i = 0; i < ROWS; i++) {
        const seatsInRow = i === ROWS - 1 ? LAST_ROW_SEATS : SEATS_PER_ROW; // Adjust for last row
        const startIdx = i * SEATS_PER_ROW;
        const endIdx = startIdx + seatsInRow;

        const rowAvailableSeats = availableSeats.filter(
          (seat) => seat >= startIdx && seat < endIdx
        );

        if (rowAvailableSeats.length >= num) {
          newBookedSeats.push(...rowAvailableSeats.slice(0, num));
          break outerLoop;
        }
      }

      if (newBookedSeats.length === 0) {
        newBookedSeats.push(...availableSeats.slice(0, num));
      }

      setSeats((prev) =>
        prev.map((seat, index) => (newBookedSeats.includes(index) ? true : seat))
      );
      setBookedSeats(newBookedSeats);

      // Show success toast and reset loading state
      toast.success('Seats successfully booked');
      setIsLoading(false);
    }, 2000); // Simulate a 2-second delay for the booking process
  };

  const resetSeats = () => {
    setSeats(Array(80).fill(false));
    setBookedSeats([]);
    toast.success('All seat bookings have been reset.');
  };

  const renderSeats = () => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
      const seatsInRow = i === ROWS - 1 ? LAST_ROW_SEATS : SEATS_PER_ROW; // Adjust for last row
      const rowSeats = [];
      for (let j = 0; j < seatsInRow; j++) {
        const seatIndex = i * SEATS_PER_ROW + j;
        rowSeats.push(
          <div
            key={seatIndex}
            className={`seat ${seats[seatIndex] ? 'reserved' : ''}`}
          >
            {seatIndex + 1}
          </div>
        );
      }
      rows.push(
        <div key={i} className="row">
          {rowSeats}
        </div>
      );
    }
    return rows;
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login'); // Redirect to the login page or any desired page
    }, 2000); // Add a 2-second delay before redirecting
  };
  

  return (
    <div className="home-container">
      {/* Toast Container */}
      <ToastContainer position="bottom-center" autoClose={3000} />

      {/* Header */}
      <div className="header">
      <h3 className="header-title">Ticket Booking</h3>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Left Side: Seat Grid */}
      <div>
        <div className="seat-grid">{renderSeats()}</div>
        <div className="buttons-group">
          <button>Booked Seats: {seats.filter((seat) => seat).length}</button>
          <button>
            Available Seats: {seats.filter((seat) => !seat).length}
          </button>
        </div>
      </div>

      {/* Right Side: Inputs and Information */}
      <div className="input-group">
        {bookedSeats.length > 0 && (
          <div className="booked-seats">
            <h3>Booked seats are:</h3>
            <div className="booked-seats-grid">
              {bookedSeats.map((seatIndex) => (
                <div key={seatIndex} className="booked-seat">
                  {seatIndex + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input and Buttons */}
        <input
          placeholder="Enter number of seats"
          id="numSeats"
          min="1"
          max="7"
          value={numSeats} // Use the state directly
          onChange={(e) => {
            const value = e.target.value;
            // Allow only valid numbers or an empty string
            if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) <= 7)) {
              setNumSeats(value);
            }
          }}
        />

        <button onClick={bookSeats} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="loading-spinner"></div> Please wait...
            </>
          ) : (
            'Book'
          )}
        </button>
        <button className="reset-button" onClick={resetSeats}>
          Reset Booking
        </button>
      </div>
    </div>
  );
};

export default Home;
