import React from "react";
import HeroSection from "../components/Landing/HeroSection";
import FeaturesSection from "../components/Landing/FeaturesSection";
import FAQSection from "../components/Landing/FAQSection";
import Footer from "../components/Layout/Footer";

export default function Home() {
  // Example sign-in handler
  const handleSignIn = async () => {
    // This route will initiate the Google OAuth flow
    window.location.href = "/api/auth/google";
  };

  return (
    <div>
      <HeroSection onSignIn={handleSignIn} />
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <i className="bi bi-calendar-x text-6xl text-blue-600 mb-6"></i>
            <h2 className="text-3xl font-bold mb-4">Too Many Events to Handle?</h2>
            <p className="text-gray-600 text-lg">
              Managing multiple calendars, events, and schedules shouldn&apos;t be a hassle. Let our AI do the heavy lifting.
            </p>
          </div>
        </div>
      </section>
      <FeaturesSection />
      <FAQSection />
      <section className="py-16 gradient-bg text-white text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to streamline your schedule?</h2>
        <button
          onClick={handleSignIn}
          className="glow-effect bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300"
        >
          <i className="bi bi-google me-2"></i> Get Started Now
        </button>
      </section>
      <Footer />
    </div>
  );
}
