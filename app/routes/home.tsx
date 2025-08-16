import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer" },
    { name: "description", content: "Test your resume for you dream job!" },
  ];
}

export default function Home() {
  const { isLoading, auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
      console.log("Resumes fetched:", parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    fetchResumes();
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-600/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <Navbar />

      <section className="relative z-10 px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16 lg:py-24">
            <div className="space-y-6 animate-in fade-in duration-1000">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200/50 mb-6">
                <span className="text-sm font-medium text-blue-800">
                  🚀 AI-Powered Resume Analysis
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                Track Your Applications &<br />
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  Resume Ratings
                </span>
              </h1>
              
              {!loadingResumes && resumes?.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    No resumes found yet. Ready to take your career to the next level?
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-amber-800">Start by uploading your resume!</span>
                  </div>
                </div>
              ) : (
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Review your submissions and discover AI-powered insights to land your dream job.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loadingResumes && (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse" />
                <img 
                  src="/images/resume-scan-2.gif" 
                  className="w-48 h-48 relative z-10 rounded-2xl shadow-2xl"
                  alt="Analyzing resumes"
                />
              </div>
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Analyzing your resumes...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumes Grid */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="max-w-7xl mx-auto pb-16">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-green-800">
                  {resumes.length} Resume{resumes.length > 1 ? 's' : ''} Analyzed
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Resume Portfolio</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Click on any resume to view detailed feedback and improvement suggestions.
              </p>
            </div>

            {/* Resumes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-1000 delay-200">
              {resumes.map((resume, index) => (
                <div 
                  key={resume.id}
                  className="animate-in fade-in duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ResumeCard resume={resume} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loadingResumes && resumes.length === 0 && (
          <div className="max-w-4xl mx-auto pb-16">
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-2xl opacity-20" />
                <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                    Upload your resume and get instant AI-powered feedback to improve your chances of landing your dream job.
                  </p>
                  
                  <Link
                    to="/upload"
                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                  >
                    <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Your Resume
                    <div className="w-2 h-2 bg-white/50 rounded-full group-hover:bg-white transition-colors duration-300" />
                  </Link>
                </div>
              </div>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                {[
                  { icon: "🤖", title: "AI Analysis", desc: "Advanced AI reviews your resume structure and content" },
                  { icon: "📊", title: "Detailed Scores", desc: "Get comprehensive ratings across multiple criteria" },
                  { icon: "💡", title: "Smart Suggestions", desc: "Receive actionable feedback to improve your resume" }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 hover:bg-white/80 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}