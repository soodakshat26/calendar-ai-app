import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">EventAI</div>
        {/* You can add nav links, user profile pic, or sign-out button here */}
      </div>
    </header>
  );
};

export default Header;
