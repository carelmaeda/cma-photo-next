// src/app/page.tsx

"use client";

import Navbar from "./Navbar";  // Importing the Navbar component
import Link from "next/link";
import Image from "next/image";


const albums = [
  {
    name: "Italy",
    src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1723683270/000079240010_xwesni.png", // Replace with actual Italy image URL
    alt: "Italy Album",
    slug: "italy", // This will be used in the URL for subgallery
  },
  {
    name: "Iceland",
    src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1723683270/000079240037_ar9bff.png", // Replace with actual Iceland image URL
    alt: "Iceland Album",
    slug: "iceland", // This will be used in the URL for subgallery
  },
];

export default function Homepage() {
  return (
    <>
      <div className="container py-4">
        <h1 className="text-center mb-4">Photo Gallery</h1>
        <div className="row g-4">
          {albums.map((album, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <Link href={`/albums/${album.slug}`}>
                <div className="position-relative overflow-hidden">
                  <Image
                    src={album.src}
                    alt={album.alt}
                    width={400}
                    height={300}
                    className="object-cover rounded"
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-black bg-opacity-50 text-white">
                    {album.name}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
