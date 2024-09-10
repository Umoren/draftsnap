import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CustomAlertProps {
    title: string;
    description: string;
    variant: 'default' | 'destructive';
}

export function CustomAlert({ title, description, variant = 'default' }: CustomAlertProps) {
    const iconMap = {
        default: AlertCircle,
        destructive: XCircle,
    };

    const Icon = iconMap[variant];

    return (
        <Alert variant={variant} className='w-1/3'>
            <Icon className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}