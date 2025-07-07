'use client';

import Image from 'next/image';
import React from 'react';
import { CLOUDINARY_BASE_URL } from '../data/photoDB';

type PolaroidStackProps = {
  photos: string[];
  labels?: string[];
};

export default function PolaroidStack({ photos, labels }: PolaroidStackProps) {
  return (
    <div className="polaroid-stack">
      {photos.slice(0, 3).map((photo, index) => (
        <div className="polaroid" key={index}>
          <Image
            src={`${CLOUDINARY_BASE_URL}${photo}`}
            alt={`Polaroid ${index + 1}`}
            width={400}
            height={500}
            priority
          />
          <h3>{labels?.[index] ?? 'Photo'}</h3>
        </div>
      ))}
    </div>
  );
};

