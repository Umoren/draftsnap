import { useState, useEffect } from 'react'
import { BarChart3, Image, HardDrive, FileText, ExternalLink, Upload as UploadIcon, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface UploadItem {
    id: string
    url: string
    caption: string
    date: string
    size?: number | null
}

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUploads: 0,
        todayUploads: 0,
        mostUsedHost: 'Imgur',
        averageSizeMB: '0'
    })
    const [recentUploads, setRecentUploads] = useState<UploadItem[]>([])

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('uploadHistory') || '[]') as UploadItem[]

        // Calculate stats
        const totalUploads = history.length
        const today = new Date().toDateString()
        const todayUploads = history.filter(item => new Date(item.date).toDateString() === today).length
        const mostUsedHost = 'Imgur'

        const totalSize = history.reduce((acc, item) => acc + (item?.size || 0), 0);
        const averageSize = history.length > 0 ? totalSize / history.length : 0;
        const averageSizeMB = (averageSize / (1024 * 1024)).toFixed(2);
        console.log({ averageSize })

        setStats({
            totalUploads,
            todayUploads,
            mostUsedHost,
            averageSizeMB
        })

        // Set recent uploads (last 5)
        setRecentUploads(history.slice(0, 5))
    }, [])



    const copyMarkdown = (item: UploadItem) => {
        const markdown = `![${item.caption}](${item.url})`
        navigator.clipboard.writeText(markdown)
        toast.success('Markdown copied to clipboard')
    }

    return (
        <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold mb-2">Welcome to draftsnap!</h2>
                    <p>Easily convert your images to markdown. Start by uploading an image.</p>
                    <Link href="/upload">
                        <Button className="mt-4" variant="secondary">
                            <UploadIcon className="mr-2 h-4 w-4" /> Quick Upload
                        </Button>
                    </Link>
                </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
                        <Image className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUploads}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Images Converted Today</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.todayUploads}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Most Used Image Host</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.mostUsedHost}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Upload Size (MB)</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageSizeMB}</div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Uploads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentUploads.length > 0 ? (
                            <div className="space-y-4">
                                {recentUploads.map((upload) => (
                                    <div key={upload.id} className="flex items-center justify-between space-x-4">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={upload.url}
                                                alt={upload.caption}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{upload.caption}</p>
                                                <p className="text-sm text-gray-500">{new Date(upload.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Button variant="muted" size="sm" onClick={() => copyMarkdown(upload)}>
                                            Copy Markdown
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">
                                No recent uploads. Start by uploading an image!
                            </p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-rows-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Getting Started</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="list-decimal list-inside space-y-2">
                                <li>Click on "Upload" in the sidebar or use the Quick Upload button above.</li>
                                <li>Drag and drop your image or click to select from your files.</li>
                                <li>Add a caption if desired, then click "Upload".</li>
                                <li>Copy the generated markdown and use it in your documents!</li>
                            </ol>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Did you know?</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center">
                            <Info className="h-8 w-8 text-primary mr-4" />
                            <p>draftsnap uses local storage to keep your upload history. Your data stays on your device!</p>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}