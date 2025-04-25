
import { useState, useEffect } from "react";
import { fetchDoctors, getAllSpecialties, filterAndSortDoctors } from "../services/doctorService";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import DoctorCard from "../components/DoctorCard";
import { Doctor } from "../types/doctor";
import { ConsultationType, SortOption } from "../types/doctor";
import { useQueryParams } from "../hooks/useQueryParams";

const Index = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get query params from URL
  const { 
    searchQuery, 
    consultationType, 
    selectedSpecialties, 
    sortOption, 
    updateQueryParams 
  } = useQueryParams();

  // Fetch doctor data on component mount
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDoctors();
        setDoctors(data);
        
        // Extract all unique specialties
        const specialties = getAllSpecialties(data);
        setAllSpecialties(specialties);
        
        // Apply initial filtering if URL has parameters
        const initialFiltered = filterAndSortDoctors(
          data,
          searchQuery,
          consultationType,
          selectedSpecialties,
          sortOption
        );
        setFilteredDoctors(initialFiltered);
      } catch (err) {
        setError("Failed to load doctors. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDoctors();
  }, []);

  // Re-filter when URL params change
  useEffect(() => {
    if (doctors.length > 0) {
      const filtered = filterAndSortDoctors(
        doctors,
        searchQuery,
        consultationType,
        selectedSpecialties,
        sortOption
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, consultationType, selectedSpecialties, sortOption, doctors]);

  const handleSearch = (query: string) => {
    updateQueryParams(
      query,
      consultationType,
      selectedSpecialties,
      sortOption
    );
  };

  const handleFilterChange = (
    newConsultationType: ConsultationType,
    newSpecialties: string[],
    newSortOption: SortOption | null
  ) => {
    updateQueryParams(
      searchQuery,
      newConsultationType,
      newSpecialties,
      newSortOption
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <div className="search-container mb-4">
        <div className="container mx-auto px-4">
          <SearchBar 
            doctors={doctors} 
            onSearch={handleSearch} 
            initialValue={searchQuery}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Panel */}
          <div className="md:w-1/4">
            <FilterPanel 
              specialties={allSpecialties}
              onFilterChange={handleFilterChange}
              initialConsultationType={consultationType}
              initialSpecialties={selectedSpecialties}
              initialSortOption={sortOption}
            />
          </div>
          
          {/* Doctor List */}
          <div className="md:w-3/4">
            {isLoading ? (
              <div className="flex justify-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="bg-white p-10 rounded-lg shadow-sm text-center">
                <h3 className="text-xl font-medium text-gray-700">No doctors found</h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filters to find more results
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-bold">{filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found</h2>
                </div>
                <div className="space-y-4">
                  {filteredDoctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
