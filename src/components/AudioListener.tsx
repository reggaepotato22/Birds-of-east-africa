import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mic, MicOff, Loader2 } from "lucide-react";
import BirdResult from "./BirdResult";

interface BirdIdentification {
  birdName: string;
  confidence: number;
  reasoning?: string;
  alternatives?: string[];
  facts?: string;
}

const AudioListener = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioDescription, setAudioDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BirdIdentification | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!audioDescription.trim()) {
      toast({
        title: "Please describe the bird sound",
        description: "Enter details about what you heard",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('identify-bird-audio', {
        body: { audioDescription }
      });

      if (error) throw error;

      setResult(data);

      // Store in database
      await supabase.from('bird_identifications').insert({
        bird_name: data.birdName,
        confidence: data.confidence,
        identification_type: 'audio',
        additional_info: {
          description: audioDescription,
          reasoning: data.reasoning,
          alternatives: data.alternatives,
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
        description: "Please try again with more details",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-forest-medium/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-forest-dark">
              Describe the Bird Sound
            </h2>
            <Button
              variant={isListening ? "destructive" : "default"}
              size="lg"
              onClick={() => setIsListening(!isListening)}
              className="rounded-full"
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Start Listening
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-forest-medium">
              What did you hear?
            </label>
            <Textarea
              placeholder="Describe the bird's call or song... For example: 'A high-pitched whistle followed by a series of chirps' or 'A loud, haunting cry that sounds like KEE-ow'"
              value={audioDescription}
              onChange={(e) => setAudioDescription(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="bg-sage/30 p-4 rounded-lg">
            <p className="text-sm text-forest-medium">
              <strong>Tips for better results:</strong>
            </p>
            <ul className="text-sm text-forest-medium list-disc list-inside mt-2 space-y-1">
              <li>Describe the pitch (high, low, medium)</li>
              <li>Note the rhythm (continuous, repetitive, sporadic)</li>
              <li>Mention any distinctive patterns or sequences</li>
              <li>Include time of day and habitat if known</li>
            </ul>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !audioDescription.trim()}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Identifying...
              </>
            ) : (
              "Identify Bird"
            )}
          </Button>
        </div>
      </Card>

      {result && <BirdResult result={result} type="audio" />}
    </div>
  );
};

export default AudioListener;