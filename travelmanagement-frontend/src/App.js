// src/App.js
import React from 'react';
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

function App() {
  return (
    <AuthProvider>
      <Router>
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
          {/* New Search Routes */}
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/destination-details/:id" element={<DestinationDetails />} />
          <Route path="/book-destination/:id" element={<BookDestination />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
