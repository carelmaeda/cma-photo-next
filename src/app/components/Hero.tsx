import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-line">瞬間を捉える</span>
          <span className="hero-title-line">Capture the Moment</span>
        </h1>
        <p className="hero-subtitle">
          Here are my photos
        </p>
        <Link href="/gallery" className="hero-button">
          Explore Gallery
        </Link>
      </div>
      <div className="hero-overlay"></div>
      <Image
        src="https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858160/Salzburg/efrmqrhtetgustmoblr0.jpg" 
        alt="Retro camera and cityscape"
        fill
        className="hero-image"
        priority
      />
    </section>
  );
}