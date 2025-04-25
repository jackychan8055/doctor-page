
import { useState } from "react";
import { ConsultationType, SortOption } from "../types/doctor";

interface FilterPanelProps {
  specialties: string[];
  onFilterChange: (consultationType: ConsultationType, specialties: string[], sortOption: SortOption | null) => void;
  initialConsultationType?: ConsultationType;
  initialSpecialties?: string[];
  initialSortOption?: SortOption | null;
}

const FilterPanel = ({ 
  specialties, 
  onFilterChange,
  initialConsultationType = null,
  initialSpecialties = [],
  initialSortOption = null
}: FilterPanelProps) => {
  const [consultationType, setConsultationType] = useState<ConsultationType>(initialConsultationType);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(initialSpecialties);
  const [sortOption, setSortOption] = useState<SortOption | null>(initialSortOption);

  const handleConsultationTypeChange = (type: ConsultationType) => {
    setConsultationType(type);
    onFilterChange(type, selectedSpecialties, sortOption);
  };

  const handleSpecialtyChange = (specialty: string, isChecked: boolean) => {
    let updatedSpecialties: string[];
    
    if (isChecked) {
      updatedSpecialties = [...selectedSpecialties, specialty];
    } else {
      updatedSpecialties = selectedSpecialties.filter(item => item !== specialty);
    }
    
    setSelectedSpecialties(updatedSpecialties);
    onFilterChange(consultationType, updatedSpecialties, sortOption);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    onFilterChange(consultationType, selectedSpecialties, option);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h2 className="font-bold text-lg mb-4">Filters</h2>
      
      {/* Consultation Type Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-moc" className="filter-header">
          Consultation Mode
        </h3>
        <div className="space-y-2 mt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="filter-video-consult"
              checked={consultationType === "Video Consult"}
              onChange={() => handleConsultationTypeChange("Video Consult")}
              className="rounded-full"
            />
            <span>Video Consult</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="filter-in-clinic"
              checked={consultationType === "In Clinic"}
              onChange={() => handleConsultationTypeChange("In Clinic")}
              className="rounded-full"
            />
            <span>In Clinic</span>
          </label>
        </div>
      </div>
      
      {/* Sort Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-sort" className="filter-header">
          Sort by
        </h3>
        <div className="space-y-2 mt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="sort-fees"
              checked={sortOption === "fees"}
              onChange={() => handleSortChange("fees")}
              className="rounded-full"
            />
            <span>Price: Low-High</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="sort-experience"
              checked={sortOption === "experience"}
              onChange={() => handleSortChange("experience")}
              className="rounded-full"
            />
            <span>Experience: Most Experience first</span>
          </label>
        </div>
      </div>
      
      {/* Specialties Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-speciality" className="filter-header">
          Specialties
        </h3>
        <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
          {specialties.map((specialty) => (
            <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                data-testid={`filter-specialty-${specialty.replace('/', '-')}`}
                checked={selectedSpecialties.includes(specialty)}
                onChange={(e) => handleSpecialtyChange(specialty, e.target.checked)}
                className="rounded"
              />
              <span>{specialty}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
