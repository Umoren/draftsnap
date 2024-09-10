import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload as UploadIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import MarkdownPreview from './MarkdownPreview';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FileWithCaption {
    file: File;
    caption: string;
    url: string;
}


export default function Upload() {
    const [files, setFiles] = useState<FileWithCaption[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);
        const newFiles = acceptedFiles.filter(file => {
            if (file.size > MAX_FILE_SIZE) {
                setError(`File ${file.name} exceeds 5MB limit and was not added.`);
                return false;
            }
            return true;
        });

        setFiles(prevFiles => {
            const updatedFiles = [
                ...prevFiles,
                ...newFiles.map(file => ({ file, caption: file.name, url: URL.createObjectURL(file) }))
            ].slice(0, MAX_FILES);
            if (updatedFiles.length === MAX_FILES) {
                setError('Maximum number of files reached (5).');
            }
            return updatedFiles;
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.gif', '.jpeg', '.jpg']
        },
        maxFiles: MAX_FILES
    });

    const removeFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setError(null);
    };

    const updateCaption = (index: number, newCaption: string) => {
        setFiles(prevFiles => prevFiles.map((file, i) =>
            i === index ? { ...file, caption: newCaption } : file
        ));
    };

    const handleUpload = async () => {
        setIsLoading(true);
        setError(null);
        // TODO: Implement actual upload to Imgur or similar service
        // For now, we'll simulate an upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
    };

    const clearAll = () => {
        setFiles([]);
        setError(null);
    };

    const generateMarkdown = (files: FileWithCaption[]) => {
        return files.map(file => {
            let markdown = `![${file.caption}](${file.url})`;
            return markdown;
        }).join('\n\n');
    };

    const markdown = generateMarkdown(files);

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-muted-foreground">
                            Drag and drop images here or click to upload
                        </p>
                    </div>
                </CardContent>
            </Card>

            {error && (
                <div className="p-4 bg-destructive/10 rounded-md">
                    <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <p className="ml-3 text-sm text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative">
                            <img
                                src={file.url}
                                alt={file.caption}
                                className="w-full h-32 object-cover rounded-md"
                            />
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <Input
                                type="text"
                                value={file.caption}
                                onChange={(e) => updateCaption(index, e.target.value)}
                                className="mt-1 text-xs text-gray-700"
                                placeholder="Enter caption"
                            />
                            <p className="mt-1 text-xs text-gray-500 truncate">{file.file.name}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex space-x-4">
                <Button
                    onClick={handleUpload}
                    disabled={files.length === 0 || isLoading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    {isLoading ? 'Processing...' : 'Upload'}
                </Button>
                <Button onClick={clearAll} variant="muted" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    Clear All
                </Button>
            </div>

            <MarkdownPreview
                markdown={markdown}
            />
        </div>
    );
}