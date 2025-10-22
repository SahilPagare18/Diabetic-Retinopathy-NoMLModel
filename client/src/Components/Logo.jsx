import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import light from '../Images/light.png';
import dark from '../Images/dark.png';

const Logo = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="flex items-center">
      <div className="w-32 h-16">
        {theme === 'light' ? (
          <img
            src={light}
            alt="Light Theme Logo"
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={dark}
            alt="Dark Theme Logo"
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <button
        onClick={handleToggleTheme}
      >
      </button>
    </div>
  );
};

export default Logo;