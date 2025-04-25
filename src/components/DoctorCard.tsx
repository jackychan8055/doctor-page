
import { Doctor } from "../types/doctor";
import { Button } from "@/components/ui/button";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <div data-testid="doctor-card" className="doctor-card bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            {doctor.image ? (
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <span className="text-xl font-bold">{doctor.name?.[0] || "?"}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 data-testid="doctor-name" className="text-lg font-bold text-gray-800">
            {doctor.name || "Unknown Doctor"}
          </h3>
          <p data-testid="doctor-specialty" className="text-gray-600">
            {doctor.specialty && Array.isArray(doctor.specialty) 
              ? doctor.specialty.join(", ") 
              : "Specialty not specified"}
          </p>
          <p className="text-sm text-gray-500">
            {doctor.qualification || "Qualification not specified"}
          </p>
          <p data-testid="doctor-experience" className="text-sm font-medium mt-1">
            {doctor.experience !== undefined ? `${doctor.experience} yrs exp.` : "Experience not specified"}
          </p>
          
          <div className="mt-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{doctor.clinic_name || "Clinic not specified"}</span>
              {doctor.area && <span>, {doctor.area}</span>}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p data-testid="doctor-fee" className="text-lg font-bold text-gray-800">
            ₹ {doctor.fee !== undefined ? doctor.fee : "Fee not specified"}
          </p>
          
          <Button className="mt-4 bg-primary text-white hover:bg-blue-600 transition">
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
