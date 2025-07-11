
'use client';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
  
/**
 * @interface ConfirmationDialogProps
 * @description Props for the ConfirmationDialog component.
 * @property {React.ReactNode} children - The element that triggers the dialog.
 * @property {string} title - The title displayed in the dialog header.
 * @property {string} description - The descriptive text within the dialog.
 * @property {string} [actionLabel="Confirm"] - The label for the confirmation action button.
 * @property {() => void} onConfirm - The function to call when the action is confirmed.
 */
interface ConfirmationDialogProps {
    children: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    onConfirm: () => void;
}

/**
 * A reusable modal dialog that requires user confirmation for a critical action.
 * It includes a checkbox that must be checked before the confirmation action can be taken,
 * serving as a cognitive speedbump to prevent accidental actions.
 * @param {ConfirmationDialogProps} props - The props for the component.
 * @returns {JSX.Element} The rendered confirmation dialog component.
 */
export function ConfirmationDialog({ children, title, description, actionLabel = "Confirm", onConfirm }: ConfirmationDialogProps) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    /**
     * Handles the confirmation action, calling the onConfirm prop and closing the dialog.
     */
    const handleConfirm = () => {
        onConfirm();
        setIsOpen(false);
    };

    /**
     * Manages the open state of the dialog, resetting the confirmation checkbox on close.
     * @param {boolean} open - The new open state of the dialog.
     */
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setIsConfirmed(false); // Reset on close
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-headline text-primary">{title}</AlertDialogTitle>
                <AlertDialogDescription className="text-base text-muted-foreground">
                    {description}
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center space-x-2 my-4">
                    <Checkbox id="confirm-reset" checked={isConfirmed} onCheckedChange={(checked) => setIsConfirmed(checked as boolean)} />
                    <Label htmlFor="confirm-reset" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I understand this action is irreversible.
                    </Label>
                </div>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirm} disabled={!isConfirmed}>
                    {actionLabel}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
