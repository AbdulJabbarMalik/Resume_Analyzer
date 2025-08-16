import { prepareInstructions } from "constants/index";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

export const meta = () => [
  { title: "Resume Analyzer | Upload" },
  { name: "description", content: "Upload your resume" },
];

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { auth, isLoading, ai, kv, fs } = usePuterStore();
  const navigate = useNavigate();

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyzeResume = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    console.log("Analyzing resume with file:", file);
    setStatusText("Analyzing your resume...");
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile) {
      setStatusText("Failed to upload the resume. Please try again.");
      return;
    }

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    console.log("convertPdfToImage result:", imageFile);
    if (!imageFile.file) {
      setStatusText("Failed to convert resume to image." + (imageFile.error || ""));
      return;
    }
    setStatusText("Uploading Image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) {
      setStatusText("Failed to upload Image. Please try again.");
      return;
    }
    setStatusText("Analyzing resume...");

    const uuid = generateUUID();

    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing....");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) {
      setStatusText("Error: Failed to analyze resume.");
      return;
    }

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete!");
    console.log("Resume data:", data);
    navigate(`/resume/${uuid}`)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    if (!file) {
      alert("Please fill in all fields and upload a resume.");
      return;
    }
    console.log("Form data:", {
      companyName,
      jobTitle,
      jobDescription,
      file,
    });
    handleAnalyzeResume({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-indigo-400/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-400/5 to-pink-600/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <Navbar />

      <section className="relative z-10 px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Processing State */}
          {isProcessing ? (
            <div className="text-center py-8 sm:py-16 animate-in fade-in duration-1000">
              <div className="space-y-6 sm:space-y-8">
                {/* Status Header */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-xs sm:text-sm text-blue-800 font-semibold">AI Analysis in Progress</span>
                    </div>
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent px-4">
                    {statusText}
                  </h1>
                </div>

                {/* Processing Animation */}
                <div className="relative max-w-xs sm:max-w-md mx-auto px-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl sm:rounded-3xl blur-2xl opacity-20 animate-pulse" />
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-gray-200">
                    <img 
                      src="/images/resume-scan.gif" 
                      alt="Analyzing resume" 
                      className="w-full max-w-xs sm:max-w-sm mx-auto rounded-xl sm:rounded-2xl shadow-lg"
                    />
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 max-w-sm sm:max-w-md mx-auto">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0" />
                      <span className="text-gray-700">File uploaded successfully</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
                      <span className="text-gray-700">AI analysis in progress</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full flex-shrink-0" />
                      <span className="text-gray-400">Generating feedback</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Form */
            <div className="animate-in fade-in duration-1000">
              {/* Hero Section */}
              <div className="text-center py-8 sm:py-12 lg:py-16 xl:py-20">
                <div className="space-y-4 sm:space-y-6 px-4">
                  <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/50 mb-4 sm:mb-6">
                    <span className="text-xs sm:text-sm font-medium text-green-800">
                      🎯 Smart Career Analysis
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                    Smart Feedback for<br />
                    <span className="text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                      Your Dream Job
                    </span>
                  </h1>
                  
                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Upload your resume and get personalized AI-powered feedback tailored to your target position.
                  </p>
                </div>
              </div>

              {/* Form Card */}
              <div className="relative px-4 w-[80%] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-2xl sm:rounded-3xl blur-2xl" />
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 xl:p-12">
                  <form
                    id="upload-form"
                    onSubmit={handleSubmit}
                    className="space-y-6 sm:space-y-8"
                  >
                    {/* Step 1: Job Information */}
                    <div className="space-y-4 sm:space-y-6  w-full">
                      <div className="flex items-center gap-2  sm:gap-3 mb-4 sm:mb-6">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                          1
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Job Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6  ">
                        {/* Company Name */}
                        <div className="space-y-2">
                          <label 
                            htmlFor="company-name" 
                            className="block text-sm font-semibold text-gray-900"
                          >
                            Company Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="company-name"
                              id="company-name"
                              placeholder="e.g., Google, Microsoft, Apple"
                              className="w-full  px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md text-sm sm:text-base"
                            />
                            <div className="absolute  inset-y-0 right-0  pr-3 flex items-center">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Job Title */}
                        <div className="space-y-2">
                          <label 
                            htmlFor="job-title" 
                            className="block text-sm font-semibold text-gray-900"
                          >
                            Job Title
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="job-title"
                              id="job-title"
                              placeholder="e.g., Software Engineer, Product Manager"
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md text-sm sm:text-base"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6H6a2 2 0 00-2 2v6a2 2 0 002 2h2m8-8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Job Description */}
                      <div className="space-y-2">
                        <label 
                          htmlFor="job-description" 
                          className="block text-sm font-semibold text-gray-900"
                        >
                          Job Description
                        </label>
                        <div className="relative">
                          <textarea
                            name="job-description"
                            id="job-description"
                            placeholder="Paste the complete job description here for better analysis..."
                            rows={4}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md resize-none text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
                          />
                          <div className="absolute top-2.5 sm:top-3 right-3">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Resume Upload */}
                    <div className="space-y-4 sm:space-y-6 w-full">
                      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                          2
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Upload Your Resume</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <label 
                          htmlFor="uploader" 
                          className="block text-sm font-semibold text-gray-900"
                        >
                          Resume File (PDF format recommended)
                        </label>
                        <FileUploader onFileSelect={handleFileSelect} />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 sm:pt-6 w-full ">
                      <button 
                        className="group w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 sm:gap-3"
                        type="submit"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="hidden sm:inline">Analyze Resume with AI</span>
                        <span className="sm:hidden">Analyze Resume</span>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 rounded-full group-hover:bg-white transition-colors duration-300" />
                      </button>
                    </div>
                  </form>

                  {/* Help Text */}
                  <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50/50 rounded-xl sm:rounded-2xl border border-blue-100">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">Pro Tip</h4>
                        <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                          Include the complete job description for more accurate and tailored feedback. Our AI analyzes job requirements against your resume to provide specific improvement suggestions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;