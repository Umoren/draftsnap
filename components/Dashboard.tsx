import { BarChart3, Image, HardDrive, FileText, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const stats = [
    { title: 'Total Uploads', value: '1,234', icon: Image },
    { title: 'Images Converted Today', value: '56', icon: FileText },
    { title: 'Most Used Image Host', value: 'Imgur', icon: HardDrive },
    { title: 'Average Upload Size', value: '2.3 MB', icon: BarChart3 },
]

const recentUploads = [
    { id: 1, name: 'screenshot1.png', date: '2023-06-01', thumbnail: '/placeholder.svg?height=50&width=50' },
    { id: 2, name: 'diagram.jpg', date: '2023-05-31', thumbnail: '/placeholder.svg?height=50&width=50' },
    { id: 3, name: 'profile-pic.png', date: '2023-05-30', thumbnail: '/placeholder.svg?height=50&width=50' },
    { id: 4, name: 'mockup.jpg', date: '2023-05-29', thumbnail: '/placeholder.svg?height=50&width=50' },
    { id: 5, name: 'logo-draft.png', date: '2023-05-28', thumbnail: '/placeholder.svg?height=50&width=50' },
]

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentUploads.map((upload) => (
                            <div key={upload.id} className="flex items-center justify-between space-x-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={upload.thumbnail}
                                        alt={upload.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium">{upload.name}</p>
                                        <p className="text-sm text-gray-500">{upload.date}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    View
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}