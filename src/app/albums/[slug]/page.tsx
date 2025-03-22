"use client";


import { useParams } from "next/navigation"; // To access the 'slug' from URL
import Image from "next/image";

// Sample data for each album
const albumData = {
  italy: [
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1701264776/Bologna/sample-7_srvyxl.jpg",
      alt: "Italy Photo 1",
    },
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1701264778/Bologna/sample-15_ovamwi.jpg",
      alt: "Italy Photo 2",
    },
  ],
  iceland: [
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1723683270/000079240037_ar9bff.png",
      alt: "Iceland Photo 1",
    },
    {
      src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1723683270/000079240010_xwesni.png",
      alt: "Iceland Photo 2",
    },
  ],
};

export default function AlbumSubGallery() {
  const { slug } = useParams(); // Access the 'slug' from the URL

  // Check if slug is a string before calling toUpperCase
  const albumName = typeof slug === "string" ? slug.toUpperCase() : "Album"; // Fallback to "Album" if it's not a string

  // Fetch the photos for the album based on the slug
  const photos = albumData[slug as keyof typeof albumData] || [];

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">{albumName}</h1> {/* Added fallback */}
      <div className="row g-4">
        {photos.map((photo, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div className="position-relative overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={400} // Adjust the size as needed
                height={300} // Adjust the size as needed
                className="object-cover rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
