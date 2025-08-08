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
      className="resume-card animate-in fade-in duration-1000 overflow-hidden pb-30"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">
              {companyName ? companyName : "Company Name Not Provided"}
            </h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500">
              {jobTitle ? jobTitle : "Job Title Not Provided"}
            </h3>
          )}
          {!companyName && !jobTitle && (
            <h3 className="font-bold !text-black text-2xl">Your Resume</h3>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000 h-[90%]">
          <div className="w-full h-full ">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-[100%] max-sm:h-[350px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
