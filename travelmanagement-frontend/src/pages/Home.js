import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ImageCarousel from '../components/ImageCarousel';
import HeroSection from '../components/HeroSection';
import ContactUs from '../components/ContactUs';
import axios from 'axios';

export default function Home() {
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    // Fetch images from backend (replace with your endpoint)
    axios.get('/images') // You may need to implement this endpoint
      .then(res => setCarouselImages(res.data))
      .catch(() => setCarouselImages([
        { url: '/assets/sample1.jpg', alt: 'Sample 1' },
        { url: '/assets/sample2.jpg', alt: 'Sample 2' }
      ]));
  }, []);

  const handleSearch = (query) => {
    // Implement search logic or navigation
    alert('Search for: ' + query);
  };

  return (
    <>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <ImageCarousel images={carouselImages} />
      <HeroSection />
      <ContactUs />
    </>
  );
}