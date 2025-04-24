
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full px-4 py-6 mt-8 border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Dice Mosaic Maker. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <a 
            href="#" 
            className="text-gray-500 hover:text-dice-primary transition-colors flex items-center gap-1"
            aria-label="GitHub"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
          <span>·</span>
          <a 
            href="#" 
            className="text-gray-500 hover:text-dice-primary transition-colors"
            aria-label="Contact"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
