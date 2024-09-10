import { useState, useEffect } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from 'react-hot-toast'

const defaultSettings = {
    imageHost: 'imgur',
    maxFileSize: 5,
    captionPrefix: '',
    captionSuffix: '',
    includeImageDimensions: false,
    theme: 'light',
}

export default function SettingsPage() {
    const [settings, setSettings] = useState(defaultSettings)

    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings')
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings))
        }
    }, [])

    const handleChange = (key: string, value: string | number | boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const saveSettings = () => {
        localStorage.setItem('appSettings', JSON.stringify(settings))
        toast.success('Settings saved successfully')

        // Apply theme change
        document.documentElement.className = settings.theme
    }

    const resetSettings = () => {
        setSettings(defaultSettings)
        localStorage.removeItem('appSettings')
        toast.success('Settings reset to defaults')

        // Reset theme
        document.documentElement.className = defaultSettings.theme
    }

    return (
        <div className="flex">
            <main className="flex-1 overflow-y-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Application Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="imageHost">Default Image Host</Label>
                            <Select
                                value={settings.imageHost}
                                onValueChange={(value) => handleChange('imageHost', value)}
                            >
                                <SelectTrigger id="imageHost">
                                    <SelectValue placeholder="Select image host" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="imgur" defaultChecked>Imgur</SelectItem>
                                    <SelectItem value="custom">Cloudinary (coming soon)</SelectItem>
                                    <SelectItem value="custom">S3 buckets (coming soon)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxFileSize">Maximum Upload File Size (MB)</Label>
                            <Input
                                id="maxFileSize"
                                type="number"
                                value={settings.maxFileSize}
                                max={5}
                                min={0}
                                onChange={(e) => handleChange('maxFileSize', parseInt(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="captionPrefix">Default Caption Prefix</Label>
                            <Input
                                id="captionPrefix"
                                value={settings.captionPrefix}
                                onChange={(e) => handleChange('captionPrefix', e.target.value)}
                                placeholder="e.g., 'Screenshot of: '"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="captionSuffix">Default Caption Suffix</Label>
                            <Input
                                id="captionSuffix"
                                value={settings.captionSuffix}
                                onChange={(e) => handleChange('captionSuffix', e.target.value)}
                                placeholder="e.g., ' (Source: Author)'"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Select
                                value={settings.theme}
                                onValueChange={(value) => handleChange('theme', value)}
                            >
                                <SelectTrigger id="theme">
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex space-x-4">
                            <Button onClick={saveSettings}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Settings
                            </Button>
                            <Button variant="destructive" onClick={resetSettings}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset to Defaults
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}