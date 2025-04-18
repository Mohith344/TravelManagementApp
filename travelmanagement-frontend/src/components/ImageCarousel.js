import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ImageCarousel({ images }) {
  return (
    <Carousel showThumbs={false} autoPlay infiniteLoop>
      {images.map((img, i) => (
        <div key={i}>
          <img
            src={img.url}
            alt={img.alt}
            style={{ width: '100%', height: 350, objectFit: 'cover' }}
          />
        </div>
      ))}
    </Carousel>
  );
}