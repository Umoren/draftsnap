import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload as UploadIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import MarkdownPreview from './MarkdownPreview';
import { CustomAlert } from './ui/custom-alert';
import { Progress } from "@/components/ui/progress"
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import ProgressBar from './ProgressBar';


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
    const [progress, setProgress] = useState(0);
    const [settings, setSettings] = useState({ captionPrefix: '', captionSuffix: '' });

    useEffect(() => {
        const storedSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
        setSettings({
            captionPrefix: storedSettings.captionPrefix || '',
            captionSuffix: storedSettings.captionSuffix || ''
        });
    }, []);

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
        setProgress(0);

        const totalFiles = files.length;
        let completedFiles = 0;

        const uploadPromises = files.map(async (file, index) => {
            const formData = new FormData();
            formData.append('image', file.file);
            formData.append('title', file.caption);

            try {
                const response = await fetch('/api/upload-imgur', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.status}`);
                }

                const data = await response.json();
                completedFiles++;
                const newProgress = (completedFiles / totalFiles) * 100;
                console.log(`File ${index + 1} completed. Progress: ${newProgress}%`);
                setProgress(newProgress);

                return {
                    ...file,
                    url: data.link
                };
            } catch (error) {
                console.error('Error uploading to Imgur:', error);
                throw error;
            }
        });

        try {
            const uploadedFiles = await Promise.all(uploadPromises);
            setFiles(uploadedFiles);

            // Save to history
            const historyItems = uploadedFiles.map(file => ({
                id: uuidv4(),
                url: file.url,
                caption: file.caption,
                date: new Date().toISOString(),
                size: file.file.size
            }));

            const existingHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
            const newHistory = [...historyItems, ...existingHistory].slice(0, 50); // Keep last 50 items
            localStorage.setItem('uploadHistory', JSON.stringify(newHistory));
            toast.custom((t) => (
                <CustomAlert
                    title="Success"
                    description="All images uploaded successfully!"
                    variant="default"
                />
            ));
        } catch (error) {
            setError(`Failed to upload one or more images. Please try again. Error: ${error}`);
            toast.custom((t) => (
                <CustomAlert
                    title="Error"
                    description={`Failed to upload one or more images. Please try again. Error: ${error}`}
                    variant="destructive"
                />
            ));
        } finally {
            setIsLoading(false);
            setProgress(100); // Ensure the progress bar reaches 100% at the end
        }
    };

    useEffect(() => {
        console.log('Progress updated:', progress);
    }, [progress]);

    const clearAll = () => {
        setFiles([]);
        setError(null);
    };

    const generateMarkdown = useCallback((files: FileWithCaption[]) => {
        const { captionPrefix, captionSuffix } = settings;

        return files.map(file => {
            return `![${captionPrefix}${file.caption}${captionSuffix}](${file.url})`;
        }).join('\n\n');
    }, [settings]);

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

            <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4 sm:space-y-0">
                    <Button
                        onClick={handleUpload}
                        disabled={files.length === 0 || isLoading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                    >
                        {isLoading ? 'Uploading...' : 'Upload'}
                    </Button>
                    <Button
                        onClick={clearAll}
                        variant="destructive"
                        className="w-full sm:w-auto"
                    >
                        Clear All
                    </Button>
                </div>
                {isLoading && (

                    <div className="w-full">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Uploading...</span>
                            {/* <span className="text-sm font-medium">{`${progress.toFixed(0)}%`}</span> */}
                        </div>
                        {/* <Progress value={progress} className="w-full" /> */}
                    </div>
                )}
            </div>

            <MarkdownPreview
                markdown={markdown}
            />
        </div>
    );
}