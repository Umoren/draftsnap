import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';

interface MarkdownPreviewProps {
    markdown: string;
}

export default function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
    const copyMarkdown = () => {
        navigator.clipboard.writeText(markdown);
        // TODO: Add a toast notification here
    };

    const downloadMarkdown = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'draftsnap_output.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Markdown</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="border border-border rounded-md p-4 bg-background text-foreground">
                    <h4 className="text-sm font-medium mb-2">Markdown</h4>
                    <pre className="text-sm overflow-auto max-h-60">{markdown}</pre>
                </div>
                <div className="border border-border rounded-md p-4 bg-background text-foreground">
                    <h4 className="text-sm font-medium mb-2">Preview</h4>
                    <div className="prose max-w-none overflow-auto max-h-60 dark:prose-invert">
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                    </div>
                </div>
            </div>
            <div className="flex space-x-4">
                <Button onClick={copyMarkdown}>Copy Markdown</Button>
                <Button onClick={downloadMarkdown} className='bg-secondary text-secondary-foreground hover:bg-secondary/80' variant="muted">Download Markdown</Button>
            </div>
        </div>
    );
}