import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            Character Explorer
          </h4>
          <p className="mt-2 text-sm text-gray-500">
            Made with ❤️ using the Rick & Morty API by <br />
            <span className="font-bold">Asheer Hameed</span>.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800">Navigation</h4>
          <ul className="mt-2 space-y-1">
            <li>
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/favorites"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Favorites
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800">Contact</h4>
          <a
            className="mt-2 text-sm text-gray-500"
            href="mailto:asheerhameed54321@gmail.com"
          >
            asheerhameed54321@gmail.com
          </a>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Character Explorer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
