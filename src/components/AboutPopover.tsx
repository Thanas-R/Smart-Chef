import { Github, Linkedin, Globe, ChefHat } from "lucide-react";
import { MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent } from "./ui/morphing-popover";

interface TeamMember {
  name: string;
  branch: string;
  github?: string;
  linkedin?: string;
  domain?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Thanas R",
    branch: "CSE(AIML)",
    github: "https://github.com/Thanas-R",
    linkedin: "https://www.linkedin.com/in/thanasr/",
    domain: "https://thanas.vercel.app/"
  },
  {
    name: "Ken George Koshy",
    branch: "CSE",
    github: "https://github.com/kengeorgeoff182-code",
    linkedin: undefined
  },
  {
    name: "Tanay S",
    branch: "CSE",
    github: "https://github.com/Tanay-s5",
    linkedin: "https://www.linkedin.com/in/tanay-s-8a46b0390/"
  },
  {
    name: "Vamshik Kudlur M R",
    branch: "CSE(AIML)",
    github: undefined,
    linkedin: undefined
  }
];

export const AboutPopover = () => {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <MorphingPopover>
        <MorphingPopoverTrigger className="group bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-6 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-primary/50">
          <ChefHat className="w-10 h-10" />
        </MorphingPopoverTrigger>
        
        <MorphingPopoverContent className="w-[90vw] max-w-3xl p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif font-bold text-center text-foreground">
              ABOUT US
            </h2>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-bold text-primary mb-6">PROUD PESU STUDENTS [P9]</h3>
              
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-xl font-bold text-foreground">{member.name}</h4>
                      <div className="flex items-center gap-2">
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {member.domain && (
                          <a
                            href={member.domain}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Globe className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.branch}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-center px-4">
              Created to help PESU students prepare quickly with their short notes and study materials. 
              Our AI-powered platform transforms your content into interactive learning experiences.
            </p>
          </div>
        </MorphingPopoverContent>
      </MorphingPopover>
    </div>
  );
};
