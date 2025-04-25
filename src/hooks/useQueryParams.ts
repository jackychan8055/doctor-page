
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ConsultationType, SortOption } from "../types/doctor";

interface QueryParamsResult {
  searchQuery: string;
  consultationType: ConsultationType;
  selectedSpecialties: string[];
  sortOption: SortOption | null;
  updateQueryParams: (
    search: string,
    consultationType: ConsultationType,
    specialties: string[],
    sortOption: SortOption | null
  ) => void;
}

export function useQueryParams(): QueryParamsResult {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse the current URL search params
  const searchQuery = searchParams.get("search") || "";
  const consultationType = searchParams.get("consult") as ConsultationType;
  const selectedSpecialties = searchParams.getAll("specialty");
  const sortOption = searchParams.get("sort") as SortOption | null;

  // Function to update the URL with new query parameters
  const updateQueryParams = (
    search: string,
    consultationType: ConsultationType,
    specialties: string[],
    sortOption: SortOption | null
  ) => {
    // Create a new URLSearchParams object
    const newParams = new URLSearchParams();
    
    // Add search parameter if not empty
    if (search) {
      newParams.set("search", search);
    }
    
    // Add consultation type if not null
    if (consultationType) {
      newParams.set("consult", consultationType);
    }
    
    // Add all selected specialties
    specialties.forEach(specialty => {
      newParams.append("specialty", specialty);
    });
    
    // Add sort option if not null
    if (sortOption) {
      newParams.set("sort", sortOption);
    }
    
    // Update the URL without reloading the page
    setSearchParams(newParams);
  };

  return {
    searchQuery,
    consultationType,
    selectedSpecialties,
    sortOption,
    updateQueryParams,
  };
}
