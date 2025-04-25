
export interface Doctor {
  id: number;
  name: string;
  specialty: string[];
  qualification: string;
  experience: number;
  clinic_name: string;
  area: string;
  consultation_type: ("Video Consult" | "In Clinic")[];
  fee: number;
  image?: string;
}

export type SortOption = "fees" | "experience";
export type ConsultationType = "Video Consult" | "In Clinic" | null;
