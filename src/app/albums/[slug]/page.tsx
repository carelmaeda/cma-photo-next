"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import '../../styles.css';
 

const albumData = {
  salzburg: [
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858160/Salzburg/efrmqrhtetgustmoblr0.jpg",
      alt: "Salzburg Photo 1",
    },
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858160/Salzburg/s5mt7ldzeeoxtsp9l7bk.jpg",
      alt: "Salzburg Photo 2",
    },
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858160/Salzburg/bfknun2bbokmdsaptxdq.jpg",
      alt: "Salzburg Photo 3",
    },
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858160/Salzburg/ucwsgftyghfriaotjivh.jpg",
      alt: "Salzburg Photo 3",
    },
  ],
  innsbruck: [
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858159/Salzburg/japek7sn5xbzeimf2q59.jpg",
      alt: "Innsbruck Photo 1",
    },
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858159/Salzburg/idnpfspiqqdjut5bjsr3.jpg",
      alt: "Innsbruck Photo 2",
    },
      {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858158/Salzburg/mjsuroc19gre40sazzpm.jpg",
      alt: "Innsbruck Photo 3",
    },
  ],
  vienna: [
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858221/Vienna/we18qdnfbdcfbbvsnqv1.jpg",
      alt: "Innsbruck Photo 1",
    },
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858221/Vienna/yljqflbifpfj3ihsvmqf.jpg",
      alt: "Innsbruck Photo 2",
    },
      {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858221/Vienna/uszawu6xn7aishutq1dx.jpg",
      alt: "Innsbruck Photo 3",
    },
  ],
};

export default function AlbumSubGallery() {
  const { slug } = useParams();
  const albumName = typeof slug === "string" ? slug.toUpperCase() : "Album";
  const photos = albumData[slug as keyof typeof albumData] || [];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Open Lightbox
  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  // Close Lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Navigate Next
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  // Navigate Previous
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  // Keyboard Navigation (Esc, Left/Right Arrows)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") prevImage();
    },
    [photos.length]
  );

  useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, handleKeyDown]);

  return (
    <div className="container-fluid">
      <h1 className="text-center">{albumName}</h1>
      <div className="row">
        {photos.map((photo, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3">
            <div className="">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={400}
                height={500}
                className="img-fluid galery-img"
                onClick={() => openLightbox(index)}
              />
            </div>
          </div>
        ))}
      </div>

      <a href="/" className="btn btn-light">&#10094; Return</a>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox">
          <div className="d-flex w-100 justify-content-end">
         <button className="close-btn" onClick={closeLightbox}>&times;</button>
          </div>
          <div className="lightbox-content">
            <button className="prev-btn" onClick={prevImage}>&#10094;</button>
            <Image
              src={photos[currentIndex].src}
              alt={photos[currentIndex].alt}
              width={800}
              height={1000}
              className="lightbox-img"
            />
            <button className="next-btn" onClick={nextImage}>&#10095;</button>
          </div>
        </div>
      )}
      
    </div>
  );
}
