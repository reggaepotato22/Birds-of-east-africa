import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioListener from "@/components/AudioListener";
import ImageScanner from "@/components/ImageScanner";
import { Bird, Volume2, Camera } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-light via-sage to-forest-light">
      {/* Header */}
      <header className="py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Bird className="w-12 h-12 text-forest-dark" />
          <h1 className="text-4xl md:text-5xl font-bold text-forest-dark">
            East African Bird Identifier
          </h1>
        </div>
        <p className="text-lg text-forest-medium max-w-2xl mx-auto">
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
      <footer className="py-6 text-center text-forest-medium">
        <p className="text-sm">
          Powered by AI • Helping conserve East African biodiversity
        </p>
      </footer>
    </div>
  );
};

export default Index;