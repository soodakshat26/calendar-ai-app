import React from "react";

const FeaturesSection: React.FC = () => {
  // Updated feature list to reflect the actual offerings
  const features = [
    {
      icon: "google",
      title: "Google SSO",
      description: "Seamless single sign-on with your Google account.",
    },
    {
      icon: "funnel",
      title: "Date & Range Filtering",
      description: "Quickly narrow down events by specific dates.",
    },
    {
      icon: "search",
      title: "Search & Sort",
      description: "Find and organize events with text search & sorting preferences.",
    },
    {
      icon: "calendar-check",
      title: "Detailed Event View",
      description: "View event details, attendees, and a calendar link at a glance.",
    },
    {
      icon: "robot",
      title: "AI Summaries",
      description: "Generate concise insights for any event using ChatGPT integration.",
    },
    {
      icon: "bell",
      title: "Reminders",
      description: "Schedule real email or push notifications ahead of your events.",
    },
  ];

  return (
    // Use Next.js iconic blue: #0070f3
    <section className="py-16 bg-[#0070f3]">
      <div className="container mx-auto px-4">
        {/* White text for heading to contrast with blue background */}
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Powerful Features
        </h2>
        {/* 6 items → 3 columns at lg screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="hover-scale p-6 rounded-xl bg-white shadow-lg">
              {/* Using Bootstrap Icons, e.g. 'bi-robot', 'bi-bell' for new features */}
              <i className={`bi bi-${feature.icon} text-3xl text-blue-600 mb-4`}></i>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
