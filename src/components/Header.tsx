
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full px-4 py-4 border-b bg-white">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="dice" className="text-2xl">🎲</span>
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-dice-primary to-dice-secondary bg-clip-text text-transparent">
            Dice Mosaic Generator
          </Link>
        </div>
        
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link 
                to="/" 
                className={`transition-colors hover:text-dice-primary ${isActive('/') ? 'text-dice-primary font-medium' : 'text-gray-600'}`}
              >
                Create
              </Link>
            </li>
            <li>
              <Link 
                to="/blog" 
                className={`transition-colors hover:text-dice-primary ${isActive('/blog') ? 'text-dice-primary font-medium' : 'text-gray-600'}`}
              >
                Blog
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
