import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/header-logo.png";
import HeartFilledIcon from "../../assets/icons/heart-filled.png";
import { fetchCharacters } from "../../services/charactersService";
import type { Character } from "../../models/model";

const Header = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch search results when searchTerm changes
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setLoading(true);
        try {
          const data = await fetchCharacters({ name: searchTerm });
          setSearchResults(data.results || []);
        } catch (e) {
          console.error(e)
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500); // debounce 500ms
    
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <header className="bg-gray-100 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" height="40" width="40" />
          <span className="text-lg font-semibold text-gray-900">Character Explorer</span>
        </Link>

        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search characters..."
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Search results dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
              {searchResults.map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    setSearchTerm("");
                    setSearchResults([]);
                    navigate(`/characters/${char.id}`);
                  }}
                  className="w-full px-4 py-2 text-sm text-left text-gray-800 hover:bg-gray-100"
                >
                  {char.name}
                </button>
              ))}
            </div>
          )}
          {loading && (
            <p className="absolute z-20 mt-1 w-full rounded-md bg-white p-2 text-sm text-gray-500 shadow">
              Searching...
            </p>
          )}
        </div>

        {/* Favorites */}
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
