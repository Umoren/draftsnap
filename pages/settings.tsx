import AppLayout from '../components/Layout'
import SettingsPage from '@/components/Settings'

export default function Home() {
    return (
        <AppLayout title='Application Settings'>
            <SettingsPage />
        </AppLayout>
    )
}
