import React from 'react';

interface ContextWindowBarProps {
  usagePercentage: number;
  className?: string;
}

const ContextWindowBar: React.FC<ContextWindowBarProps> = ({ usagePercentage, className = '' }) => {
  // Determine color based on usage percentage
  const getBarColor = () => {
    if (usagePercentage < 50) return 'bg-green-500';
    if (usagePercentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Determine animation based on usage percentage
  const getAnimation = () => {
    return usagePercentage >= 80 ? 'animate-pulse' : '';
  };
  
  return (
    <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full ${getBarColor()} ${getAnimation()} transition-all duration-500 ease-out`}
        style={{ width: `${usagePercentage}%` }}
      ></div>
    </div>
  );
};

export default ContextWindowBar;
