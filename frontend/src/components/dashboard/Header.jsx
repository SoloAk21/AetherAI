import React from "react";
import MenuSvg from "../../assets/svg/MenuSvg";
import Button from "../Button";

const Header = ({ openNavigation, toggleNavigation, user, onLogout }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-n-8 bg-opacity-80">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Button - Visible only on small screens */}
        <Button
          className="ml-auto md:hidden"
          px="px-3"
          onClick={toggleNavigation} // Toggle sidebar visibility
        >
          {openNavigation ? (
            // Cross icon when sidebar is open
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-n-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Menu icon when sidebar is closed
            <MenuSvg />
          )}
        </Button>
        <div>
          <span className="text-lg font-semibold text-n-1">SoloAk</span>
          <span className="ml-2 text-sm text-n-2">2.0 Flash</span>
        </div>
      </div>

      <div className="flex items-center">
        <button className="mr-4 focus:outline-none" onClick={onLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-n-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-color-1 flex items-center justify-center text-n-8 font-semibold"></div>
      </div>
    </header>
  );
};

export default Header;
