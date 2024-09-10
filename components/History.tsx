import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Copy, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { toast } from 'react-hot-toast'
import { ClearHistoryModal } from './ClearModal'
import { useRouter } from 'next/router'

interface HistoryItem {
    id: string
    url: string
    caption: string
    date: string
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const itemsPerPage = 20
    const router = useRouter()

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('uploadHistory') || '[]')
        setHistory(storedHistory)
    }, [])

    const filteredHistory = history.filter(
        (item) =>
            item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
            format(new Date(item.date), 'yyyy-MM-dd').includes(searchTerm)
    )

    const handleClearHistory = () => {
        setIsModalOpen(true)
    }

    const confirmClearHistory = () => {
        localStorage.removeItem('uploadHistory')
        setHistory([])
        setIsModalOpen(false)
        toast.success('History cleared successfully')
    }


    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
    const currentItems = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const copyMarkdown = (item: HistoryItem) => {
        const markdown = `![${item.caption}](${item.url})`
        navigator.clipboard.writeText(markdown)
        toast.success('Markdown copied to clipboard')
    }

    const clearHistory = () => {
        localStorage.removeItem('uploadHistory')
        setHistory([])
        toast.success('History cleared')
    }

    return (
        <div className="flex h-screen bg-primary-foreground">
            <main className="flex-1 overflow-y-auto p-2">
                <div className="mb-6 flex items-center flex-row-reverse justify-between">
                    <Button variant="destructive" onClick={handleClearHistory}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear History
                    </Button>

                    <Input
                        type="text"
                        placeholder="Search by caption or date (YYYY-MM-DD)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                {currentItems.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {currentItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                    <img
                                        src={item.url}
                                        alt={item.caption}
                                        className="mb-2 h-32 w-full object-cover"
                                    />
                                    <p className="mb-1 font-medium">{item.caption}</p>
                                    <p className="text-sm text-gray-500">
                                        {format(new Date(item.date), 'MMM d, yyyy')}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="muted"
                                        className="w-full"
                                        onClick={() => copyMarkdown(item)}
                                    >
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy Markdown
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No upload history yet.</p>
                        <Button variant="muted" onClick={() => router.push('/upload')}>
                            Start Uploading
                        </Button>
                    </div>
                )}
                {totalPages > 1 && (
                    <Pagination className="mt-6">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href="#"
                                        onClick={() => setCurrentPage(i + 1)}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </main>

            <ClearHistoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmClearHistory}
            />
        </div>
    )
}