import { useState, useEffect, ReactNode } from 'react'
import { LayoutDashboard, Upload, History, Settings, Menu } from 'lucide-react'
import { useRouter } from 'next/router'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Upload, label: 'Upload', href: '/upload' },
    { icon: History, label: 'History', href: '/history' },
    { icon: Settings, label: 'Settings', href: '/settings' },
]

interface AppLayoutProps {
    children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [currentDateTime, setCurrentDateTime] = useState('')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const currentPath = router.pathname
        const currentTab = navItems.find(item => item.href === currentPath)?.label || 'Dashboard'
        setActiveTab(currentTab)
    }, [router.pathname])

    const handleNavClick = (label: string, href: string) => {
        setActiveTab(label)
        router.push(href)
    }

    return (
        <>
            <div className="flex h-screen bg-muted font-sans">
                {/* Sidebar */}
                <aside
                    className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        } fixed inset-y-0 left-0 z-50 w-64 bg-background text-foreground dark:bg-slate-900 dark:text-slate-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
                >
                    <div className="flex h-full flex-col justify-between p-4">
                        <div>
                            <h1 className="mb-8 text-2xl font-bold">MarkSnap</h1>
                            <nav>
                                <ul className="space-y-2">
                                    {navItems.map((item) => (
                                        <li key={item.label}>
                                            <a
                                                href={item.href}
                                                className={`flex items-center rounded-lg p-2 transition-colors duration-200 hover:bg-gray-800 ${activeTab === item.label ? 'bg-gray-800 shadow-lg' : ''
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleNavClick(item.label, item.href)
                                                }}
                                            >
                                                <item.icon className="mr-3 h-6 w-6" />
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                        <div className="text-sm text-gray-400">Made by Samuel</div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted">
                    <div className="container mx-auto px-6 py-8">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-foreground">Welcome back, User</h2>
                            <p className="text-sm text-muted-foreground">{currentDateTime}</p>
                        </div>
                        <button
                            className="fixed right-4 top-4 rounded-full bg-gray-900 p-2 text-white lg:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            {/* Main content container */}
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}