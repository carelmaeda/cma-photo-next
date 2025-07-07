
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
        <section className="d-none">
        <Gallery/>
        </section>
      <section id="about" className="d-none">
        <About />
      </section>
      <section id="contact" className="d-none">
        <Contact />
      </section>
      </div>
    </>
  );
}
