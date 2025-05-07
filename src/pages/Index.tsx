
import { ContentChecker } from "@/components/ContentChecker";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <ContentChecker />
      </main>
    </div>
  );
};

export default Index;
