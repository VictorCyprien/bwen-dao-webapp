import * as React from 'react';

/**
 * Split background component with a gradient banner and dark content area
 */
const OnboardingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Banner - 20% viewport height */}
      <div className="h-[20vh] w-full bg-[url('https://applescoop.org/image/wallpapers/mac/pink-blue-purple-abstract-gradient-08-10-2024-1728440099-hd-wallpaper.jpg')] bg-cover bg-center bg-no-repeat"></div>
      {/* Main background - dark grey for remaining 80% */}
      <div className="h-[80vh] w-full bg-background"></div>
    </div>
  );
};

export default OnboardingBackground; 