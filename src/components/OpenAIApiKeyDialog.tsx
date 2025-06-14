
import { useState, useEffect } from "react";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OpenAIApiKeyDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export function OpenAIApiKeyDialog({ open, onOpenChange }: OpenAIApiKeyDialogProps) {
  const [inputKey, setInputKey] = useState("");
  const [storedKey, setStoredKey] = useState<string | null>(null);

  useEffect(() => {
    // Show current stored key as short preview (first 6 chars...)
    const saved = window.localStorage.getItem("openai_api_key");
    setStoredKey(saved);
    setInputKey(saved ? saved : "");
  }, [open]);

  const handleSave = () => {
    if (!inputKey.trim()) {
      toast.error("API key cannot be empty");
      return;
    }
    window.localStorage.setItem("openai_api_key", inputKey.trim());
    setStoredKey(inputKey.trim());
    toast.success("OpenAI API key saved!");
    onOpenChange(false);
  };

  const handleRemove = () => {
    window.localStorage.removeItem("openai_api_key");
    setInputKey("");
    setStoredKey(null);
    toast.success("API key removed");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set OpenAI API Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="openai-key" className="block text-sm mb-1">
              Paste your OpenAI API key:
            </label>
            <Input
              id="openai-key"
              type="password"
              value={inputKey}
              onChange={e => setInputKey(e.target.value)}
              placeholder="sk-..."
              autoFocus
            />
            {storedKey && (
              <div className="text-xs text-muted-foreground mt-2">
                Current key: <span className="font-mono">{storedKey.slice(0, 6)}...{storedKey.slice(-4)}</span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="destructive" onClick={handleRemove} type="button">
              Remove Key
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button onClick={handleSave} type="button">
                Save Key
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
