
import { ContentChecker } from "@/components/ContentChecker";
import { Navbar } from "@/components/Navbar";
import { FileUploadButton } from "@/components/FileUploadButton";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="text-center mb-8">
          <h2 className="text-xl text-muted-foreground font-medium">
            FakeBuster — The AI Truth Filter for the Internet
          </h2>
        </div>
        <ContentChecker />
      </main>
      <footer className="border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Fakebuster. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</a>
              <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
      <FileUploadButton />
    </div>
  );
};

export default Index;
