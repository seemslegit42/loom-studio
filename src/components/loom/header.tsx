'use client';
import { PlusCircle, UploadCloud, Settings, LogOut, User, LifeBuoy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

export default function Header() {
  const { agentAvatar, isProcessing } = useLoom();

  return (
    <header className="flex h-20 items-center justify-between border-b border-border/50 px-6 lg:px-8 shrink-0 bg-card/20 backdrop-blur-sm">
      <div>
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Good Afternoon, Commander
        </h1>
        <p className="text-muted-foreground">Here is the current state of your agentic systems.</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <UploadCloud />
          Load Snapshot
        </Button>
        <Button className="bg-primary hover:bg-primary/90 glow-primary">
          <PlusCircle />
          New Agent
        </Button>
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
              <DropdownMenuItem>
                <User />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                <span>Settings</span>
              </DropdownMenuItem>
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
