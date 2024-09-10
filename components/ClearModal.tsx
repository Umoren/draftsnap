import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface ClearHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ClearHistoryModal({ isOpen, onClose, onConfirm }: ClearHistoryModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Clear All History</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to clear all history? This action cannot be undone and will affect your dashboard statistics.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="muted" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Clear All</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}