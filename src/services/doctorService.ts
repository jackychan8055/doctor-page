
import { Doctor } from "../types/doctor";

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

export async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
}

export function getAllSpecialties(doctors: Doctor[]): string[] {
  // Extract all unique specialties from the doctor data
  const specialtiesSet = new Set<string>();
  
  // Check if doctors array exists and has items
  if (!doctors || !Array.isArray(doctors)) {
    console.error("Invalid doctors data:", doctors);
    return [];
  }
  
  doctors.forEach(doctor => {
    // Check if doctor has specialty array before iterating
    if (doctor && doctor.specialty && Array.isArray(doctor.specialty)) {
      doctor.specialty.forEach(spec => {
        specialtiesSet.add(spec);
      });
    }
  });
  
  return Array.from(specialtiesSet).sort();
}

export function searchDoctorsByName(doctors: Doctor[], searchQuery: string): Doctor[] {
  if (!searchQuery.trim() || !Array.isArray(doctors)) return doctors || [];
  
  const query = searchQuery.toLowerCase().trim();
  return doctors.filter(doctor => 
    doctor && doctor.name && doctor.name.toLowerCase().includes(query)
  );
}

export function getAutocompleteSuggestions(doctors: Doctor[], searchQuery: string): Doctor[] {
  if (!searchQuery.trim() || !Array.isArray(doctors)) return [];
  
  const query = searchQuery.toLowerCase().trim();
  const filteredDoctors = doctors.filter(doctor => 
    doctor && doctor.name && doctor.name.toLowerCase().includes(query)
  );
  
  // Return top 3 matches
  return filteredDoctors.slice(0, 3);
}

export function filterAndSortDoctors(
  doctors: Doctor[],
  searchQuery: string,
  consultationType: "Video Consult" | "In Clinic" | null,
  selectedSpecialties: string[],
  sortOption: "fees" | "experience" | null
): Doctor[] {
  // Check if doctors is valid array
  if (!Array.isArray(doctors)) {
    return [];
  }
  
  // First filter by search query
  let filteredDoctors = searchDoctorsByName(doctors, searchQuery);
  
  // Then filter by consultation type
  if (consultationType) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor && doctor.consultation_type && 
      doctor.consultation_type.includes(consultationType)
    );
  }
  
  // Then filter by selected specialties
  if (selectedSpecialties && selectedSpecialties.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor && doctor.specialty && Array.isArray(doctor.specialty) &&
      doctor.specialty.some(spec => selectedSpecialties.includes(spec))
    );
  }
  
  // Finally, sort the filtered results
  if (sortOption) {
    if (sortOption === "fees") {
      filteredDoctors.sort((a, b) => a.fee - b.fee); // ascending
    } else if (sortOption === "experience") {
      filteredDoctors.sort((a, b) => b.experience - a.experience); // descending
    }
  }
  
  return filteredDoctors;
}
