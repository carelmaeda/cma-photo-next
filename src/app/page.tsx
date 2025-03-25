
"use client";

import Gallery from "./components/Gallery";

export default function Homepage() {
  return (
    <>
      <div className="container">
        <h1 className="text-center mb-4">This is my Portfolio</h1>
        <Gallery/>
      </div>
    </>
  );
}
