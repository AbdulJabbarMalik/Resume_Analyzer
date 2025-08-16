import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, imagePath, feedback, resumePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResumes = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) {
        console.error("Failed to load resume image");
        return;
      }
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };

    loadResumes();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="group relative block w-full h-full transform transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-2"
    >
      <div className="relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
        {/* Gradient overlay for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Header Section */}
        <div className="relative z-10 p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {companyName && (
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors duration-200 mb-2 leading-tight break-words ">
                  {companyName}
                </h2>
              )}
              {jobTitle && (
                <h3 className="text-base font-medium text-gray-600 break-words group-hover:text-blue-800 transition-colors duration-200">
                  {jobTitle}
                </h3>
              )}
              {!companyName && !jobTitle && (
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors duration-200">
                  Your Resume
                </h3>
              )}
            </div>
            <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-200">
              <ScoreCircle score={feedback.overallScore} />
            </div>
          </div>
        </div>

        {/* Resume Preview Section */}
        {resumeUrl && (
          <div className="relative mx-4 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
            {/* Premium border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[2px] rounded-xl">
              <div className="w-full h-full bg-white rounded-[10px] overflow-hidden">
                <img
                  src={resumeUrl}
                  alt="Resume preview"
                  className="w-full h-[280px] max-sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
            
            {/* Fallback for non-hover state */}
            <div className="group-hover:opacity-0 transition-opacity duration-300">
              <img
                src={resumeUrl}
                alt="Resume preview"
                className="w-full h-[280px] max-sm:h-[250px] object-cover object-top"
              />
            </div>

            {/* Overlay with view action hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                View Details →
              </div>
            </div>
          </div>
        )}

        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
             style={{ clipPath: 'polygon(100% 0%, 0% 0%, 100% 100%)' }} />
      </div>
    </Link>
  );
};

export default ResumeCard;