import { ChefHat, Github, Linkedin, Globe } from "lucide-react";
import { MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent } from "./ui/morphing-popover";
interface TeamMember {
  name: string;
  branch: string;
  github?: string;
  linkedin?: string;
  domain?: string;
}
const teamMembers: TeamMember[] = [{
  name: "Thanas R",
  branch: "CSE(AIML)",
  github: "https://github.com/Thanas-R",
  linkedin: "https://www.linkedin.com/in/thanasr/",
  domain: "https://thanas.vercel.app/"
}, {
  name: "Tanay S",
  branch: "CSE",
  github: "https://github.com/Tanay-s5",
  linkedin: "https://www.linkedin.com/in/tanay-s-8a46b0390/"
}, {
  name: "Ken George Koshy",
  branch: "CSE",
  github: "https://github.com/kengeorgeoff182-code",
  linkedin: undefined
}, {
  name: "Vamshik Kudlur M R",
  branch: "CSE(AIML)",
  github: undefined,
  linkedin: undefined
}];
export const Header = () => {
  return <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <ChefHat className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-serif font-bold text-foreground">Smart Chef</h1>
        </div>
        
        <div className="relative">
          <MorphingPopover>
            <MorphingPopoverTrigger className="text-primary font-semibold text-xs tracking-wide hover:text-primary/80 transition-colors cursor-pointer bg-transparent border-none">
              Chemakya Pesters
            </MorphingPopoverTrigger>
            
            <MorphingPopoverContent className="w-[90vw] max-w-3xl p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10 top-12 right-0">
              <div className="space-y-8">
                <h2 className="text-4xl font-serif font-bold text-center text-foreground">
                  ABOUT US
                </h2>

                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
                  <h3 className="text-2xl font-bold text-primary mb-6">PROUD PESU STUDENTS [P9]</h3>
                  
                  <div className="space-y-6">
                    {teamMembers.map((member, index) => <div key={index} className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="text-xl font-bold text-foreground">{member.name}</h4>
                          <div className="flex items-center gap-2">
                            {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="w-5 h-5" />
                              </a>}
                            {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                              </a>}
                            {member.domain && <a href={member.domain} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Globe className="w-5 h-5" />
                              </a>}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.branch}</p>
                      </div>)}
                  </div>
                </div>

                
              </div>
            </MorphingPopoverContent>
          </MorphingPopover>
        </div>
      </div>
    </header>;
};