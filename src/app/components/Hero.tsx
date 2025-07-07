"use client"; 

import React from 'react';
import photoDB from '../data/photoDB';
import PolaroidStack from './PolaroidStack';


export default function Hero() {

  const AlbumLondon = photoDB.find(album => album.slug === 'london');
  const AlbumAmsterdam = photoDB.find(album => album.slug === 'amsterdam');
  const AlbumVaduz = photoDB.find(album => album.slug === 'vaduz');




  return (
    <section className="hero">
          <div className="section-wrapper">
            <div className="section-title d-none">
               <h1>HELLOO</h1>
            </div>
           <div className="section-content">
           {AlbumVaduz && (
            <PolaroidStack
              photos={AlbumVaduz.photos}
              labels={Array(3).fill(AlbumVaduz.name)} 
            />
          )}

          <div className="hero-title">
          <h2>Hello there, friend. Pull up a chair.</h2>
          <p>I’m Carel, and I've got some photos to show you.</p>
          </div>
              {AlbumLondon && (
            <PolaroidStack
              photos={AlbumLondon.photos}
              labels={Array(3).fill(AlbumLondon.name)} 
            />
          )}
           </div>
          </div>
    </section>
  );
}


