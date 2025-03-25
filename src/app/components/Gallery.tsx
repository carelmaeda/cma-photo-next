"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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
  {
    name: "Braga",
    src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742935884/Braga/_DSF5631_thcn3s.jpg",
    alt: "Braga Album",
    slug: "braga",
  },
  {
    name: "Brugge",
    src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742935924/Brugge/DSCF4756_vxptpv.jpg",
    alt: "Brugge Album",
    slug: "brugge",
  },
  {
    name: "Porto",
    src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742935938/Porto/Posted/_DSF5660_monjnl.jpg",
    alt: "Porto Album",
    slug: "porto",
  },
  {
    name: "London",
    src: "https://res.cloudinary.com/duwhxzb0q/image/upload/v1742935899/London/Posted/_DSF3690_jehqle.jpg",
    alt: "London Album",
    slug: "london",
  },
];

export default function Gallery() {
  return (
    <div>
      <h1 className="text-center mb-4 d-none">Photo Gallery</h1>
      <div className="row justify-content-center">
        {albums.map((album, index) => (
          <motion.div
            key={index}
            className="col-6 col-md-4 col-lg-3"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link href={`/albums/${album.slug}`} className="text-decoration-none">
              <div className="album-wrapper">
                <Image
                  src={album.src}
                  alt={album.alt}
                  width={400}
                  height={500}
                  className="img-fluid"
                  loading="lazy"
                />
                <div className="album-title">{album.name}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
