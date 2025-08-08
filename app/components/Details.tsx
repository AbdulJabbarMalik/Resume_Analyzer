import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-2 items-center px-4 py-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg border-2",
        score > 69
          ? "bg-emerald-100/80 border-emerald-300 hover:bg-emerald-200/80"
          : score > 39
          ? "bg-amber-100/80 border-amber-300 hover:bg-amber-200/80"
          : "bg-rose-100/80 border-rose-300 hover:bg-rose-200/80"
      )}
    >
      <div className={cn(
        "p-1 rounded-full",
        score > 69 ? "bg-emerald-500" : score > 39 ? "bg-amber-500" : "bg-rose-500"
      )}>
        <img
          src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
          alt="score"
          className="size-3 brightness-0 invert"
        />
      </div>
      <p
        className={cn(
          "text-sm font-bold",
          score > 69
            ? "text-emerald-700"
            : score > 39
            ? "text-amber-700"
            : "text-rose-700"
        )}
      >
        {score}/100
      </p>
      <div className={cn(
        "text-xs font-medium px-2 py-0.5 rounded-full",
        score > 69
          ? "bg-emerald-600 text-white"
          : score > 39
          ? "bg-amber-600 text-white"
          : "bg-rose-600 text-white"
      )}>
        {score > 69 ? "GREAT" : score > 39 ? "GOOD" : "POOR"}
      </div>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
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
    <div className="flex flex-col md:flex-row justify-between items-center gap-7 py-4 px-2 group">
      <div className="flex items-center gap-4">
        <div className={cn(
          "text-2xl p-3 rounded-xl shadow-md transition-all duration-300 group-hover:scale-110",
          categoryScore > 69
            ? "bg-emerald-100 text-emerald-600"
            : categoryScore > 39
            ? "bg-amber-100 text-amber-600"
            : "bg-rose-100 text-rose-600"
        )}>
          {getIcon(title)}
        </div>
        <div className="flex flex-col">
          <p className="text-2xl font-bold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">Click to view detailed analysis</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ScoreBadge score={categoryScore} />
        <div className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1">
          →
        </div>
      </div>
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {/* Quick Tips Grid */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 w-full rounded-2xl p-6 shadow-inner border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-500 text-white p-2 rounded-lg">
            💡
          </div>
          <h4 className="text-lg font-bold text-gray-800">Quick Tips Overview</h4>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
            <div 
              className="flex flex-row gap-3 items-start bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-white/40 group" 
              key={index}
            >
              <div className={cn(
                "p-2 rounded-lg shadow-sm transition-all duration-300 group-hover:scale-110",
                tip.type === "good" 
                  ? "bg-emerald-100 text-emerald-600" 
                  : "bg-amber-100 text-amber-600"
              )}>
                <img
                  src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                  alt="score"
                  className="size-4"
                />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-700 leading-tight">{tip.tip}</p>
                <div className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block",
                  tip.type === "good" 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-amber-100 text-amber-700"
                )}>
                  {tip.type === "good" ? "STRENGTH" : "IMPROVEMENT"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Explanations */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-purple-500 text-white p-2 rounded-lg">
            📋
          </div>
          <h4 className="text-lg font-bold text-gray-800">Detailed Analysis</h4>
        </div>
        
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              "relative flex flex-col gap-4 rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl group overflow-hidden",
              tip.type === "good"
                ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-300"
                : "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-300"
            )}
          >
            {/* Background decoration */}
            <div className={cn(
              "absolute  top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 transition-all duration-500 group-hover:opacity-30 group-hover:scale-110",
              tip.type === "good" ? "bg-emerald-300" : "bg-amber-300"
            )}></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row  gap-4 items-start mb-3">
                <div className={cn(
                  "p-3 rounded-xl shadow-md transition-all duration-300 group-hover:scale-105",
                  tip.type === "good"
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-500 text-white"
                )}>
                  <img
                    src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                    alt="score"
                    className="size-5 brightness-0 invert"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                    <h5 className={cn(
                      "text-xl font-bold",
                      tip.type === "good" ? "text-emerald-800" : "text-amber-800"
                    )}>
                      {tip.tip}
                    </h5>
                    <div className={cn(
                      "text-xs font-bold px-3 py-1 rounded-full shadow-sm self-start ",
                      tip.type === "good"
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-600 text-white"
                    )}>
                      {tip.type === "good" ? "✓ STRENGTH" : "⚠ IMPROVE"}
                    </div>
                  </div>
                  <div className={cn(
                    "p-4 rounded-xl border-l-4 bg-white/60 backdrop-blur-sm shadow-sm",
                    tip.type === "good" 
                      ? "border-emerald-400 text-emerald-800" 
                      : "border-amber-400 text-amber-800"
                  )}>
                    <p className="leading-relaxed font-medium">{tip.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: any }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-xl">
              📊
            </div>
            <div>
              <h2 className="text-2xl font-bold">Detailed Analysis</h2>
              <p className="text-gray-500">In-depth breakdown of your resume performance</p>
            </div>
          </div>
        </div>

        {/* Accordion Content */}
        <div className="p-4">
          <Accordion>
            <AccordionItem id="tone-style">
              <AccordionHeader itemId="tone-style">
                <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
                />
              </AccordionHeader>
              <AccordionContent itemId="tone-style">
                <CategoryContent tips={feedback.toneAndStyle.tips} />
              </AccordionContent>
            </AccordionItem>
            
            <div className="border-t border-gray-100 my-2"></div>
            
            <AccordionItem id="content">
              <AccordionHeader itemId="content">
                <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
                />
              </AccordionHeader>
              <AccordionContent itemId="content">
                <CategoryContent tips={feedback.content.tips} />
              </AccordionContent>
            </AccordionItem>
            
            <div className="border-t border-gray-100 my-2"></div>
            
            <AccordionItem id="structure">
              <AccordionHeader itemId="structure">
                <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
                />
              </AccordionHeader>
              <AccordionContent itemId="structure">
                <CategoryContent tips={feedback.structure.tips} />
              </AccordionContent>
            </AccordionItem>
            
            <div className="border-t border-gray-100 my-2"></div>
            
            <AccordionItem id="skills">
              <AccordionHeader itemId="skills">
                <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
                />
              </AccordionHeader>
              <AccordionContent itemId="skills">
                <CategoryContent tips={feedback.skills.tips} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Details;