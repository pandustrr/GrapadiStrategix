import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div>
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Web Planning
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 font-medium">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/features" className="hover:text-blue-600">
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-blue-600">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Menu */}
          {/* <ul className="flex md:hidden  space-x-6 font-medium">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/features" className="hover:text-blue-600">
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-blue-600">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul> */}

          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default LandingPage;
