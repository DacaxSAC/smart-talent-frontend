import { Outlet } from 'react-router-dom'
import { Sidebar } from '../shared/components/Sidebar'

export default function App() {
  return (
    <div className="w-full bg-white dark:bg-black text-foreground h-screen flex font-karla">
      {/* Smart Talent Header */}
      
      <Sidebar />
      <main className='w-full h-screen overflow-y-auto'>
          <Outlet />
      </main>
      
      {/* Smart Talent */}
    </div>
  )
}