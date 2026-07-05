import { useGetCertificate, getGetCertificateQueryKey } from "@workspace/api-client-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Lock, Printer, Award, BookOpen, Code, Target, Star } from "lucide-react";
import { format } from "date-fns";

export function Certificate() {
  const { data: cert, isLoading } = useGetCertificate({ query: { queryKey: getGetCertificateQueryKey() } });
  const [name, setName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("pythonLearnerName");
    if (savedName) setName(savedName);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    localStorage.setItem("pythonLearnerName", e.target.value);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !cert) {
    return <div className="p-8">Loading...</div>;
  }

  if (!cert.earned) {
    return (
      <div className="max-w-3xl mx-auto animate-in fade-in duration-500 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Certificate</h1>
          <p className="text-muted-foreground mt-2">Complete all lessons to unlock your certificate of completion.</p>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Progress towards certificate
            </h2>
            <span className="text-sm font-medium">{cert.completedLessons} / {cert.totalLessons} Lessons</span>
          </div>
          <Progress value={(cert.completedLessons / Math.max(cert.totalLessons, 1)) * 100} className="h-3" />
        </div>

        <div className="relative border-2 border-dashed border-border rounded-2xl p-12 bg-muted/20 overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-background border rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Certificate Locked</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
              You're making great progress! Complete the remaining {cert.totalLessons - cert.completedLessons} lessons to unlock your personalized certificate.
            </p>
          </div>
          
          {/* Faded Certificate Preview */}
          <div className="opacity-20 pointer-events-none w-full max-w-2xl border-4 border-double border-muted-foreground p-8">
            <h1 className="text-4xl font-serif text-center mb-4">Certificate of Completion</h1>
            <div className="h-px bg-muted-foreground w-1/2 mx-auto mb-8"></div>
            <p className="text-center text-xl mb-12">Your Name Here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 space-y-8 print:space-y-0 print:m-0 print:max-w-none">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Certificate</h1>
          <p className="text-muted-foreground mt-2">Congratulations on completing the curriculum!</p>
        </div>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </Button>
      </div>

      <div className="print:absolute print:inset-0 print:bg-white print:z-50 print:flex print:items-center print:justify-center">
        {/* Certificate Card */}
        <div className="relative bg-card text-card-foreground border-2 border-primary/20 shadow-xl rounded-none p-2 md:p-4 print:shadow-none print:border-none print:w-full">
          <div className="border border-primary/10 p-2 h-full">
            <div className="border-4 border-double border-primary/30 p-8 md:p-16 h-full relative overflow-hidden flex flex-col items-center bg-white text-slate-900">
              
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary/40"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary/40"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-primary/40"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary/40"></div>
              
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-8 border border-primary/20">
                <Award className="w-10 h-10 text-primary" />
              </div>

              <h1 className="text-4xl md:text-5xl font-serif text-center font-bold tracking-tight text-slate-900 mb-6">
                Certificate of Completion
              </h1>
              
              <p className="text-slate-500 uppercase tracking-widest text-sm font-semibold mb-6">This certifies that</p>
              
              <input 
                type="text" 
                value={name} 
                onChange={handleNameChange} 
                placeholder="Your Name Here"
                className="text-3xl md:text-4xl font-serif text-center font-bold text-primary bg-transparent border-b-2 border-primary/20 focus:border-primary/50 outline-none w-full max-w-md pb-2 mb-8 print:border-none placeholder:text-slate-300"
              />
              
              <p className="text-slate-600 text-lg md:text-xl text-center max-w-xl mb-12">
                Has successfully completed the Python Learner curriculum, demonstrating proficiency in Python programming concepts.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-16">
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary mb-2" />
                  <span className="text-2xl font-bold text-slate-800">{cert.completedLessons}</span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Lessons</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                  <Code className="w-6 h-6 text-primary mb-2" />
                  <span className="text-2xl font-bold text-slate-800">{cert.completedChallenges}</span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Challenges</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                  <Target className="w-6 h-6 text-primary mb-2" />
                  <span className="text-2xl font-bold text-slate-800">{Math.round(cert.accuracy)}%</span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Accuracy</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg">
                  <Star className="w-6 h-6 text-primary mb-2" />
                  <span className="text-2xl font-bold text-slate-800">{cert.badgesEarned}</span>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Badges</span>
                </div>
              </div>

              <div className="w-full flex justify-between items-end mt-auto pt-8 border-t border-slate-200">
                <div className="flex flex-col items-center">
                  <div className="text-lg font-serif text-slate-800 mb-1">
                    {cert.completedAt ? format(new Date(cert.completedAt), "MMMM d, yyyy") : format(new Date(), "MMMM d, yyyy")}
                  </div>
                  <div className="h-px w-40 bg-slate-400 mb-1"></div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Date Completed</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-signature text-slate-800 mb-1 italic">
                    Python Learner
                  </div>
                  <div className="h-px w-40 bg-slate-400 mb-1"></div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Curriculum</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
