"use client"; 
import React from 'react';
import Image from 'next/image';


export default function Hero() {
  return (
    <section className="hero">
          <div className="section-wrapper">
            <div className="section-title d-none">
               <h1>HELLOO</h1>
            </div>
           <div className="section-content">
           <div className="polaroid">
          <Image
            src="https://res.cloudinary.com/duwhxzb0q/image/upload/v1742858158/Salzburg/mjsuroc19gre40sazzpm.jpg"
            alt="Hero"
            width={400} 
            height={500} 
            priority 
          />
             <h3>Zurich</h3>
          </div>
          
          <div className="hero-title">
          <h2>Hello there, friend. Pull up a chair.</h2>
          <p>I’m Carel, and I've got some photos to show you.</p>
          </div>
            
          <div className="polaroid">
          <Image
            src="https://res.cloudinary.com/duwhxzb0q/image/upload/v1742935886/Braga/_DSF5808_e0uozy.jpg"
            alt="Hero"
            width={400} 
            height={500} 
            priority 
          />
            <h3>Braga</h3>
          </div>
           </div>
          </div>
    </section>
  );
}