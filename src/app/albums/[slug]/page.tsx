"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import albumData from "@/app/data/albumData";
import Link from "next/link";

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

  // Memoized Close Lightbox
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Memoized Next Image
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  }, [photos.length]);

  // Memoized Previous Image
  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard Navigation (Esc, Left/Right Arrows)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") prevImage();
    },
    [closeLightbox, nextImage, prevImage]
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
          <motion.div
            key={index}
            className="col-6 col-md-4 col-lg-3"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src={photo.src}
                alt={`${albumName} Photo ${index + 1}`}
                width={400}
                height={500}
                className="img-fluid galery-img"
                onClick={() => openLightbox(index)}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <Link href="/" className="btn btn-secondary">&#10094; Return</Link>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="d-flex w-100 justify-content-end">
            <button className="close-btn" onClick={closeLightbox}>&times;</button>
          </div>
          <div className="lightbox-content">
            <button className="prev-btn" onClick={prevImage}>&#10094;</button>
            <Image
              src={photos[currentIndex].src}
              alt={"Gallery Image"}
              width={800}
              height={1000}
              className="lightbox-img"
              loading="lazy"
            />
            <button className="next-btn" onClick={nextImage}>&#10095;</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
