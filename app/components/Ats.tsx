import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const getGradient = (score: number) => {
  if (score > 69) return "from-emerald-50 via-green-50 to-teal-50";
  if (score > 49) return "from-amber-50 via-yellow-50 to-orange-50";
  return "from-rose-50 via-red-50 to-pink-50";
};

const getBorderColor = (score: number) => {
  if (score > 69) return "border-emerald-200";
  if (score > 49) return "border-amber-200";
  return "border-rose-200";
};

const getIcon = (score: number) => {
  if (score > 69) return "/icons/ats-good.svg";
  if (score > 49) return "/icons/ats-warning.svg";
  return "/icons/ats-bad.svg";
};

const getScoreColor = (score: number) => {
  if (score > 69) return "text-emerald-700";
  if (score > 49) return "text-amber-700";
  return "text-rose-700";
};

const getProgressColor = (score: number) => {
  if (score > 69) return "bg-emerald-500";
  if (score > 49) return "bg-amber-500";
  return "bg-rose-500";
};

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const gradient = getGradient(score);
  const borderColor = getBorderColor(score);
  const icon = getIcon(score);
  const scoreColor = getScoreColor(score);
  const progressColor = getProgressColor(score);

  return (
    <div className={`w-full relative rounded-2xl bg-gradient-to-br ${gradient} border-2 ${borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 p-8  mx-auto backdrop-blur-sm`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-lg"></div>
      
      {/* Header Section */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/40 rounded-full blur-md"></div>
            <img src={icon} alt="ATS Icon" className="relative w-16 h-16 drop-shadow-lg" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">ATS Score</h2>
            <div className={`text-3xl font-black ${scoreColor} tracking-tight`}>
              {score}<span className="text-lg font-medium text-gray-600">/100</span>
            </div>
          </div>
        </div>
        
        {/* Score badge */}
        <div className={`px-4 py-2 rounded-full ${scoreColor} bg-white/80 backdrop-blur-sm font-bold text-sm shadow-md`}>
          {score > 69 ? 'Excellent' : score > 49 ? 'Good' : 'Needs Work'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 relative z-10">
        <div className="w-full bg-white/50 rounded-full h-3 shadow-inner">
          <div 
            className={`${progressColor} h-3 rounded-full transition-all duration-1000 ease-out shadow-md relative overflow-hidden`}
            style={{ width: `${score}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="relative z-10 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
          📊 Analysis Report
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 bg-white/40 p-3 rounded-lg backdrop-blur-sm">
          This score reflects how well your resume performs when scanned by Applicant Tracking Systems used by employers to filter candidates.
        </p>
      </div>

      {/* Suggestions */}
      <div className="relative z-10 mb-6">
        <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2">
          💡 Recommendations
        </h4>
        <div className="space-y-3">
          {suggestions.map((s, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-white/40">
              <div className="flex-shrink-0 mt-0.5">
                <img
                  src={s.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                  alt={s.type === "good" ? "Good" : "Improve"}
                  className="w-5 h-5 drop-shadow-sm"
                />
              </div>
              <span className="text-gray-700 text-sm leading-relaxed font-medium">{s.tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-10 text-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm">
          <p className="text-gray-700 text-sm font-medium mb-2">
            🚀 Ready to boost your score?
          </p>
          <p className="text-gray-600 text-xs">
            Implement these suggestions to improve your ATS compatibility and increase your interview chances!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ATS;