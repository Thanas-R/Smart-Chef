import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Github, Linkedin, Globe } from "lucide-react";

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    linkedin: undefined // Placeholder
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
    github: undefined, // Placeholder
    linkedin: undefined // Placeholder
  }
];

export const AboutDialog = ({ isOpen, onClose }: AboutDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-2 border-border rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-4xl font-serif font-bold text-center text-foreground">
            ABOUT US
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
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
      </DialogContent>
    </Dialog>
  );
};
