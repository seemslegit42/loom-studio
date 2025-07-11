
'use client';
import { PlusCircle, UploadCloud, Settings, LogOut, User, LifeBuoy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLoom } from './loom-provider';
import { Skeleton } from '../ui/skeleton';
import { ConfirmationDialog } from './confirmation-dialog';

export default function Header() {
  const { agentAvatar, isProcessing, resetToInitialState } = useLoom();

  return (
    <header className="flex h-20 items-center justify-between border-b border-border/50 px-6 lg:px-8 shrink-0 bg-card/20 backdrop-blur-sm">
      <div>
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Good Afternoon, Commander
        </h1>
        <p className="text-muted-foreground font-code tracking-widest text-sm">InnovΛtΞ. ΛutomΛtΞ. DominΛtΞ.</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <UploadCloud />
          Load Snapshot
        </Button>
        <ConfirmationDialog
            title="Create New Agent?"
            description="This will reset the current agent's prompts, profile, and avatar to their default state. This action cannot be undone."
            onConfirm={resetToInitialState}
            actionLabel="Create New Agent"
        >
            <Button className="bg-primary hover:bg-primary/90 glow-primary">
                <PlusCircle />
                New Agent
            </Button>
        </ConfirmationDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer relative">
              {isProcessing ? (
                <Skeleton className="h-12 w-12 rounded-full" />
              ) : (
                <Avatar className="h-12 w-12 border-2 border-primary/50">
                  <AvatarImage src={agentAvatar} alt="Commander" data-ai-hint="person avatar" />
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <User />
                            <span>Profile</span>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>User Profile</DialogTitle>
                            <DialogDescription>
                                This is a placeholder for the user profile settings.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Settings />
                            <span>Settings</span>
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Application Settings</DialogTitle>
                            <DialogDescription>
                                This is a placeholder for application settings.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LifeBuoy />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              API
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
