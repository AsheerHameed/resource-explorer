import { Link } from "react-router-dom";
import logo from "../../assets/header-logo.png";
import HeartFilledIcon from "../../assets/icons/heart-filled.png";

const Header = () => {
  return (
    <header className="bg-gray-100 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" height="40" width="40" />
          <span className="text-lg font-semibold text-gray-900">
            Character Explorer
          </span>
        </Link>

        <Link
          to="/favorites"
          className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50"
        >
          <img src={HeartFilledIcon} alt="Favorites" width={20} height={20} />
          <span className="text-sm text-gray-800 font-medium">Favorites</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
