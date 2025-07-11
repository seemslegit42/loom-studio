'use client';
import { ArrowRight, LoaderCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { analyzePromptChange } from '@/ai/flows/analyze-prompt-change-flow';
import type { AnalyzePromptChangeInput } from '@/ai/flows/analyze-prompt-change-schema';
import { useToast } from '@/hooks/use-toast';
import { useLoom } from './loom-provider';

const incantationSchema = z.object({
  originalPrompt: z.string().min(10, 'Original prompt is too short.'),
  modifiedPrompt: z.string().min(10, 'Modified prompt is too short.'),
});

type IncantationForm = z.infer<typeof incantationSchema>;

export default function IncantationEditor() {
  const { toast } = useToast();
  const { isProcessing, handlePromptUpdate } = useLoom();

  const form = useForm<IncantationForm>({
    resolver: zodResolver(incantationSchema),
    defaultValues: {
      originalPrompt: 'You are a helpful assistant.',
      modifiedPrompt:
        'You are a witty and sarcastic space pirate captain assistant, an expert in puns and dad jokes, who always refers to the user as "Commander". You have a pet space monkey named Zorp.',
    },
  });

  const onSubmit = async (data: AnalyzePromptChangeInput) => {
    try {
      const result = await handlePromptUpdate(data);
      toast({
        title: 'Behavioral Analysis Complete',
        description: result.analysis,
      });
    } catch (error) {
      console.error('Error analyzing prompt change:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'Could not analyze the prompt change. Please try again.',
      });
    }
  };

  return (
    <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle className="font-headline text-primary flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Incantation Editor
        </CardTitle>
        <CardDescription>
          Diff changes to agent behavior in real-time.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <CardContent className="flex-1 grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="originalPrompt"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <Label htmlFor="original-prompt" className="text-muted-foreground">
                    Original Prompt
                  </Label>
                  <FormControl>
                    <Textarea
                      id="original-prompt"
                      className="h-full bg-background/50 text-base flex-1 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modifiedPrompt"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <Label htmlFor="modified-prompt" className="text-accent">
                    Modified Prompt
                  </Label>
                  <FormControl>
                    <Textarea
                      id="modified-prompt"
                      className="h-full bg-accent/5 border-accent/50 focus-visible:ring-accent text-base flex-1 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full glow-primary"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <ArrowRight />
              )}
              Apply & Analyze Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
