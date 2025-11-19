import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Camera, Loader2, X } from "lucide-react";
import BirdResult from "./BirdResult";

interface BirdIdentification {
  birdName: string;
  confidence: number;
  keyFeatures?: string[];
  alternatives?: string[];
  habitat?: string;
  conservation?: string;
  facts?: string;
}

const ImageScanner = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BirdIdentification | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload or capture a bird image",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('identify-bird-image', {
        body: { imageBase64: selectedImage }
      });

      if (error) throw error;

      setResult(data);

      // Store in database
      await supabase.from('bird_identifications').insert({
        bird_name: data.birdName,
        confidence: data.confidence,
        identification_type: 'image',
        additional_info: {
          keyFeatures: data.keyFeatures,
          alternatives: data.alternatives,
          habitat: data.habitat,
          conservation: data.conservation,
          facts: data.facts
        }
      });

      toast({
        title: "Bird identified!",
        description: data.birdName,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Identification failed",
        description: "Please try again with a clearer image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-forest-medium/20">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-forest-dark">
            Upload or Capture Bird Photo
          </h2>

          {!selectedImage ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-forest-medium/30 rounded-lg p-12 text-center hover:border-forest-medium/50 transition-colors">
                <Camera className="w-16 h-16 mx-auto mb-4 text-forest-medium" />
                <p className="text-forest-medium mb-4">
                  Upload a photo or take a picture of the bird
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Image
                </Button>
              </div>

              <div className="bg-sage/30 p-4 rounded-lg">
                <p className="text-sm text-forest-medium">
                  <strong>Tips for better results:</strong>
                </p>
                <ul className="text-sm text-forest-medium list-disc list-inside mt-2 space-y-1">
                  <li>Ensure the bird is clearly visible</li>
                  <li>Good lighting improves accuracy</li>
                  <li>Capture distinctive features (beak, plumage, markings)</li>
                  <li>Avoid blurry or distant shots</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected bird"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  onClick={clearImage}
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Identify Bird"
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {result && <BirdResult result={result} type="image" />}
    </div>
  );
};

export default ImageScanner;