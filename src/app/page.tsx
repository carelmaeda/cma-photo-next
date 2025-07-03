
"use client";

import Gallery from "./components/Gallery";
import About from "./components/About";
import Contact from "./components/Contact";
import Hero from "./components/Hero";


export default function Homepage() {
  return (
    <>
      <div className="container">
        <h1>Carel Maeda - Portfolio</h1>
        <section>
        < Hero/>
        </section>
        <section>
        <Gallery/>
        </section>
      <section id="about" className="container py-4">
        <About />
      </section>
      <section id="contact" className="container py-4">
        <Contact />
      </section>
      </div>
    </>
  );
}
