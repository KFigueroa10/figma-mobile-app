import React, { useState } from 'react';

interface MascotProps {
  className?: string;
  useGif?: boolean;
  gifUrl?: string;
  useVideo?: boolean;
  videoUrl?: string;
}

export const Mascot: React.FC<MascotProps> = ({ className = '', useGif = false, gifUrl, useVideo = false, videoUrl }) => {
  const [imgError, setImgError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  if (useVideo && !videoError) {
    return (
      <div className={`w-32 h-32 flex items-center justify-center ${className}`}>
        <video
          src={videoUrl ?? '/images/Live%20chatbot.mp4'}
          className="w-full h-full object-contain"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
        />
      </div>
    );
  }

  if (useGif && !imgError) {
    return (
      <div className={`w-32 h-32 flex items-center justify-center ${className}`}>
        <img
          src={gifUrl ?? '/images/Live%20chatbot.gif'}
          alt="Mascot"
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`w-32 h-32 flex items-center justify-center ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cabeza */}
        <circle cx="100" cy="100" r="80" fill="#FFD54F" />

        {/* Ojos */}
        <circle cx="70" cy="80" r="15" fill="#424242" />
        <circle cx="130" cy="80" r="15" fill="#424242" />

        {/* Sonrisa */}
        <path
          d="M70 130 C85 150, 115 150, 130 130"
          stroke="#424242"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Brazos */}
        <path
          d="M40 100 L10 70"
          stroke="#FFB74D"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M160 100 L190 70"
          stroke="#FFB74D"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* Cuerpo */}
        <path
          d="M80 180 C80 180, 120 180, 120 180 C140 180, 160 160, 160 140 L160 120 C160 120, 160 100, 100 100 C40 100, 40 120, 40 120 L40 140 C40 160, 60 180, 80 180 Z"
          fill="#4CAF50"
        />
      </svg>
    </div>
  );
};

export default Mascot;
