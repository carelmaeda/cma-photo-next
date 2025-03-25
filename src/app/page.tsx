
"use client";

import Gallery from "./components/Gallery";
import About from "./components/About";
import Contact from "./components/Contact";


export default function Homepage() {
  return (
    <>
      <div className="container-fluid p-5">
        <h1 className="d-none">Carel Maeda - Portfolio</h1>
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
