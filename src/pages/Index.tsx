
import { ContentChecker } from "@/components/ContentChecker";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-10">
        <ContentChecker />
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Fakebuster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
