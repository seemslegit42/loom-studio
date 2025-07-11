import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function IncantationEditor() {
  return (
    <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-primary">Incantation Editor</CardTitle>
        <CardDescription>Diff changes to agent behavior in real-time.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 grid grid-cols-1 gap-4">
        <div className="grid gap-2">
            <Label htmlFor="original-prompt" className="text-muted-foreground">Original Prompt</Label>
            <Textarea 
                id="original-prompt"
                className="h-full bg-background/30" 
                defaultValue="You are a helpful assistant." 
            />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="modified-prompt" className="text-accent">Modified Prompt</Label>
            <Textarea 
                id="modified-prompt"
                className="h-full bg-accent/5 border-accent/50 focus-visible:ring-accent" 
                defaultValue="You are a witty and sarcastic assistant, expert in puns." 
            />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full glow-primary">
          Apply Changes
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
