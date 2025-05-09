// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePackage from './pages/CreatePackage';
import ViewPackages from './pages/ViewPackages';
import EditPackage from './pages/EditPackage';
import AddHotel from './pages/AddHotel';
import ViewHotels from './pages/ViewHotels';
import AddRestaurant from './pages/AddRestaurant';
import ViewRestaurants from './pages/ViewRestaurants';
import AddDestination from './pages/AddDestination';
import ViewDestinations from './pages/ViewDestinations';
import { AuthProvider } from './context/AuthContext';
import SearchResults from './pages/SearchResults';
import DestinationDetails from './pages/DestinationDetails';
import BookDestination from './pages/BookDestination';
import PackageDetails from './pages/PackageDetails';
import BookPackage from './pages/BookPackage';
import ViewTravelPackages from './pages/ViewTravelPackages';
import MyBookings from './pages/MyBookings';
import MyComplaints from './pages/MyComplaints';
import ManageComplaints from './pages/ManageComplaints';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-package" element={<CreatePackage />} />
            <Route path="/view-packages" element={<ViewPackages />} />
            <Route path="/edit-package/:id" element={<EditPackage />} />
            {/* Admin Routes */}
            <Route path="/add-destination" element={<AddDestination />} />
            <Route path="/add-hotel" element={<AddHotel />} />
            <Route path="/add-restaurant" element={<AddRestaurant />} />
            <Route path="/view-destinations" element={<ViewDestinations />} />
            <Route path="/view-hotels" element={<ViewHotels />} />
            <Route path="/view-restaurants" element={<ViewRestaurants />} />
            <Route path="/manage-complaints" element={<ManageComplaints />} />
            {/* New Search Routes */}
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/destination-details/:id" element={<DestinationDetails />} />
            <Route path="/book-destination/:id" element={<BookDestination />} />
            <Route path="/package-details/:id" element={<PackageDetails />} />
            <Route path="/book-package/:id" element={<BookPackage />} />
            <Route path="/view-travel-packages" element={<ViewTravelPackages />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/my-complaints" element={<MyComplaints />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
