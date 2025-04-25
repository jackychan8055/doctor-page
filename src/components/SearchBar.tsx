
import { useState, useEffect, useRef } from "react";
import { Doctor } from "../types/doctor";
import { Search } from "lucide-react";

interface SearchBarProps {
  doctors: Doctor[];
  onSearch: (query: string) => void;
  initialValue?: string;
}

const SearchBar = ({ doctors, onSearch, initialValue = "" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    // Handle clicks outside the search component
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      // Find top 3 matching doctors
      const filtered = doctors
        .filter(doctor => doctor.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name);
    onSearch(name);
    setIsFocused(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setIsFocused(false);
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          data-testid="autocomplete-input"
          ref={inputRef}
          type="text"
          placeholder="Search Symptoms, Doctors, Specialists, Clinics"
          className="w-full p-3 pr-10 border rounded-md focus:outline-none focus:border-blue-500"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
        />
        <button 
          type="submit" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          <Search size={20} />
        </button>
      </form>

      {isFocused && suggestions.length > 0 && (
        <div 
          ref={suggestionRef}
          className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 overflow-hidden border"
        >
          {suggestions.map((doctor, index) => (
            <div
              key={doctor.id}
              data-testid="suggestion-item"
              className="p-3 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(doctor.name)}
            >
              <div className="font-semibold">{doctor.name}</div>
              <div className="text-sm text-gray-500">{doctor.specialty.join(', ')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
