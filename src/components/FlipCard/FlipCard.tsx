'use client';

import { useState } from 'react';
import Image from 'next/image';
import QRCode from 'react-qr-code';
import { QrCode } from 'lucide-react';

interface FlipCardProps {
  imageSrc: string;
  imageAlt: string;
  qrValue?: string;
  size: number;
  enableFlip?: boolean;
}

export default function FlipCard({
  imageSrc,
  imageAlt,
  qrValue,
  size,
  enableFlip = true,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flex-shrink-0 mx-auto md:mx-0 ${
        enableFlip ? 'cursor-pointer group' : ''
      }`}
      style={{ perspective: '1000px' }}
      onClick={() => enableFlip && setIsFlipped(!isFlipped)}
    >
      <div
        className="relative transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          width: size,
          height: size,
        }}
      >
        {/* Fronte - Immagine */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={size}
            height={size}
            className={`rounded-2xl shadow-lg object-cover border border-muted w-full h-full`}
          />
          {/* Badge con suggerimento QR */}
          {enableFlip && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 transition-opacity group-hover:opacity-100 opacity-80">
              <QrCode className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-medium">
                Clicca per QR
              </span>
            </div>
          )}
        </div>

        {/* Retro - QR Code */}

        {qrValue && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-muted p-4"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <QRCode
              value={qrValue}
              size={size - 32}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
