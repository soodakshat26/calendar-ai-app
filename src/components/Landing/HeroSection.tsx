import React from "react";

interface HeroSectionProps {
  onSignIn?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSignIn }) => {
  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn(); // If a parent prop is provided
    } else {
      // Default fallback: Hardcode your Google OAuth route
      window.location.href = "/api/auth/google";
    }
  };

  return (
    <section
      className="
        relative
        min-h-[80vh]
        flex
        items-center
        justify-center
        bg-cover
        bg-center
      "
      style={{
        backgroundImage: "url('/images/im.jpg')", // Your hero image path
      }}
    >
      {/* Semi-transparent overlay so text is readable */}
      <div className="absolute inset-0 bg-white bg-opacity-40 pointer-events-none" />

      {/* The hero content (text + button) is centered and above the overlay */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Consolidate Your Events with AI-Powered Ease
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Transform your scheduling experience with intelligent event management
        </p>
        <button
          onClick={handleSignIn}
          className="glow-effect bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300"
        >
          <i className="bi bi-google me-2"></i> Sign In with Google
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
