import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioListener from "@/components/AudioListener";
import ImageScanner from "@/components/ImageScanner";
import { Volume2, Camera } from "lucide-react";
import birdLogo from "@/assets/bird-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="py-8 px-4 text-center">
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <img 
            src={birdLogo} 
            alt="Birds of East Africa Logo" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Birds of East Africa
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the beautiful birds of East Africa through sound or sight
        </p>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 pb-12">
        <Tabs defaultValue="audio" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="audio" className="text-lg">
              <Volume2 className="w-5 h-5 mr-2" />
              Listen to Bird Sounds
            </TabsTrigger>
            <TabsTrigger value="image" className="text-lg">
              <Camera className="w-5 h-5 mr-2" />
              Scan Bird Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audio" className="mt-0">
            <AudioListener />
          </TabsContent>

          <TabsContent value="image" className="mt-0">
            <ImageScanner />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground">
        <p className="text-sm">
          Powered by AI • Helping conserve East African biodiversity
        </p>
      </footer>
    </div>
  );
};

export default Index;