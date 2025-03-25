"use client";

import Link from "next/link";
import Image from "next/image";

const albums = [
  {
    name: "Salzburg",
    src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858156/Salzburg/usyjkngvadgtll45vbyd.jpg",
    alt: "Salzburg Album",
    slug: "salzburg",
  },
  {
    name: "Innsbruck",
    src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858113/Innsbruck/gsxk25hm5zeqnlzdojr4.jpg",
    alt: "Innsbruck Album",
    slug: "innsbruck",
  },
  {
    name: "Vienna",
    src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858222/Vienna/wuozgshr1wfl6fteoizm.jpg",
    alt: "Vienna Album",
    slug: "vienna",
  },
];

export default function Gallery() {
  return (
    <div>
      <h1 className="text-center mb-4 d-none">Photo Gallery</h1>
      <div className="row justify-content-center">
        {albums.map((album, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <Link href={`/albums/${album.slug}`} className="text-decoration-none">
              <div className="album-wrapper">
                <Image
                  src={album.src}
                  alt={album.alt}
                  width={400}
                  height={500}
                  className="img-fluid"
                />
                <div className="album-title">{album.name}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
