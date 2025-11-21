import React from 'react';

interface IconPlaceholderProps {
  iconType: string;
  className?: string;
}

const IconPlaceholder: React.FC<IconPlaceholderProps> = ({ iconType, className = "" }) => {
  const getImageSrc = (type: string): string => {
    return ("/image/" + type + ".webp")
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
      case 'wrinkles&finelines':
        return 'Wrinkles & fine lines';
      case 'puffiness&darkcircles':
        return 'Puffiness & dark circles';
      case 'jawline&doublechin':
        return 'Jawline & double chin';
      case 'neck&venusrings':
        return 'Neck & venus rings';
      case 'skintone&firmness':
        return 'Skin tone & firmness';
      case 'slouching&neckhump':
        return 'Slouching & neck hump';
      case 'chestfirmness&shape':
        return 'Chest firmness & shape';
      case 'belly&bodyshape':
        return 'Belly & body shape';
      case 'flattenedglutes_softerhips':
        return 'Flattened glutes / softer hips';
      case 'muscletoneloss':
        return 'Muscle tone loss';
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