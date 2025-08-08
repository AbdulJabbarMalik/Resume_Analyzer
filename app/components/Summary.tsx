import React from 'react'
import ScoreGauge from './ScoreGauge'
import ScoreBadge from './ScoreBadge';

const Category = ({ title, score }: { title: string; score: number }) => {
    const textColor = score >= 70 ? "text-emerald-600" : score >= 49 ? "text-amber-600" : "text-rose-600";
    const bgColor = score >= 70 ? "bg-emerald-50" : score >= 49 ? "bg-amber-50" : "bg-rose-50";
    const borderColor = score >= 70 ? "border-emerald-200" : score >= 49 ? "border-amber-200" : "border-rose-200";
    const iconColor = score >= 70 ? "text-emerald-500" : score >= 49 ? "text-amber-500" : "text-rose-500";
    
    const getIcon = (title: string) => {
        switch (title) {
            case 'Tone & Style': return '✍️';
            case 'Content': return '📝';
            case 'Structure': return '🏗️';
            case 'Skills': return '⚡';
            default: return '📊';
        }
    };

    return (
        <div className={`relative overflow-hidden ${bgColor} border ${borderColor} rounded-xl p-4 mx-6 mb-4 hover:shadow-md transition-all duration-300 group`}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/30 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10 flex flex-row items-center justify-between">
                <div className='flex flex-row gap-3 items-center'>
                    <div className={`text-2xl p-2 rounded-lg bg-white/60 ${iconColor} shadow-sm`}>
                        {getIcon(title)}
                    </div>
                    <div className="flex flex-col">
                        <p className='text-lg font-bold text-gray-800'>{title}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <ScoreBadge score={score} />
                        </div>
                    </div>
                </div>
                
                <div className="text-right">
                    <p className="text-3xl font-black">
                        <span className={textColor}>
                            {score}
                        </span>
                        <span className="text-lg font-medium text-gray-500">/100</span>
                    </p>
                    
                    {/* Mini progress bar */}
                    <div className="w-20 bg-white/50 rounded-full h-1.5 mt-2 shadow-inner">
                        <div 
                            className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${score >= 70 ? "bg-emerald-500" : score >= 49 ? "bg-amber-500" : "bg-rose-500"}`}
                            style={{ width: `${score}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Summary = ({feedback}: {feedback : any}) => {
  return (
    <div className='bg-white rounded-3xl shadow-xl w-full overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500'>
        {/* Header Section with enhanced gradient */}
        <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-row items-center justify-between p-8 gap-8 border-b border-gray-100">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100/30 rounded-full -translate-y-20 -translate-x-20 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100/40 rounded-full translate-y-16 translate-x-16 blur-xl"></div>
            
            <div className="relative z-10 flex items-center gap-6 flex-col md:flex-row   ">
                <div className="relative">
                    {/* Glow effect behind gauge */}
                    <div className="absolute inset-0 bg-blue-200/30 rounded-full blur-xl scale-110"></div>
                    <ScoreGauge score={feedback.overallScore}/>
                </div>
                
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <h2 className='text-3xl font-black text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text'>
                            Your Resume Score
                        </h2>
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                            AI ANALYZED
                        </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed max-w-md">
                        Comprehensive analysis based on industry standards and ATS optimization best practices
                    </p>
                    
                    {/* Overall score display */}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-medium text-gray-500">Overall:</span>
                        <span className={`text-2xl font-bold ${feedback.overallScore >= 70 ? "text-emerald-600" : feedback.overallScore >= 49 ? "text-amber-600" : "text-rose-600"}`}>
                            {feedback.overallScore}/100
                        </span>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${feedback.overallScore >= 70 ? "bg-emerald-500" : feedback.overallScore >= 49 ? "bg-amber-500" : "bg-rose-500"}`}>
                            {feedback.overallScore >= 70 ? 'EXCELLENT' : feedback.overallScore >= 49 ? 'GOOD' : 'NEEDS WORK'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Categories Section */}
        <div className="py-6 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="px-6 mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    📊 Detailed Breakdown
                </h3>
                <p className="text-sm text-gray-500">Individual category performance analysis</p>
            </div>
            
            <div className="space-y-2">
                <Category title='Tone & Style' score={feedback.toneAndStyle.score} />
                <Category title='Content' score={feedback.content.score} />
                <Category title='Structure' score={feedback.structure.score} />
                <Category title='Skills' score={feedback.skills.score} />
            </div>
            
            {/* Bottom action area */}
            <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-gray-800">🎯 Ready to improve?</p>
                        <p className="text-sm text-gray-600">Get detailed recommendations for each category</p>
                    </div>
                    <div className="text-blue-500 font-medium text-sm hover:text-blue-600 cursor-pointer transition-colors">
                        View Details →
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Summary