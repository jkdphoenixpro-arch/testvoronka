import React from 'react';

interface IconPlaceholderProps {
  iconType: string;
  className?: string;
}

const IconPlaceholder: React.FC<IconPlaceholderProps> = ({ iconType, className = "" }) => {
  const getImageSrc = (type: string): string => {
    switch (type) {
      case 'face&neck':
        return '/image/face&neck.webp';
      case 'belly&waist':
        return '/image/belly&waist.webp';
      case 'back&posture':
        return '/image/back&posture.webp';
      case 'strength&bodytone':
        return '/image/strength&bodytone.webp';
      case 'joints&flexibility':
        return '/image/joints&flexibility.webp';
      case 'exercise':
        return '/image/strength&bodytone.webp';
      case 'nutrition':
        return '/image/belly&waist.webp';
      case 'back-posture':
        return '/image/back&posture.webp';
      case 'sleep':
        return '/image/face&neck.webp';
      case 'mindfulness':
        return '/image/joints&flexibility.webp';
      default:
        return '/image/face&neck.webp';
    }
  };

  const getAltText = (type: string): string => {
    switch (type) {
      case 'face&neck':
        return 'Face & neck';
      case 'belly&waist':
        return 'Belly & waist';
      case 'back&posture':
        return 'Back & posture';
      case 'strength&bodytone':
        return 'Strength & body tone';
      case 'joints&flexibility':
        return 'Joints & flexibility';
      default:
        return 'Icon';
    }
  };

  return (
    <div className={`icon-placeholder ${className}`}>
      <img 
        src={getImageSrc(iconType)} 
        alt={getAltText(iconType)}
        className="icon-image"
        width={52}
        height={52}
      />
    </div>
  );
};

export default IconPlaceholder;