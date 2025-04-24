
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full px-4 py-4 border-b">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="dice" className="text-2xl">🎲</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-dice-primary to-dice-secondary bg-clip-text text-transparent">
            Dice Mosaic Maker
          </h1>
        </div>
        
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link 
                to="/" 
                className={`transition-colors hover:text-dice-primary ${isActive('/') ? 'text-dice-primary font-medium' : 'text-gray-600'}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`transition-colors hover:text-dice-primary ${isActive('/about') ? 'text-dice-primary font-medium' : 'text-gray-600'}`}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/export" 
                className={`transition-colors hover:text-dice-primary ${isActive('/export') ? 'text-dice-primary font-medium' : 'text-gray-600'}`}
              >
                Export
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
