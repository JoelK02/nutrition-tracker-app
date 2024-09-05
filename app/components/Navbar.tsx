import Link from 'next/link'
import { FaHome, FaBullseye, FaUtensils, FaCog, FaChartLine } from 'react-icons/fa'

export default function Navbar() {
  return (
    <nav className="bg-green-50 h-screen w-64 fixed left-0 top-0 p-4 shadow-lg">
      <div className="mb-8">
        <Link href="/" className="text-green-600 font-bold text-2xl flex items-center">
          <FaChartLine className="mr-2" />
          NutriTrack
        </Link>
      </div>
      <ul className="space-y-4">
        <NavItem href="/" icon={<FaHome />} text="Home" />
        <NavItem href="/goals" icon={<FaBullseye />} text="Goals" />
        <NavItem href="/recipes" icon={<FaUtensils />} text="Recipes" />
        <NavItem href="/settings" icon={<FaCog />} text="Settings" />
      </ul>
    </nav>
  )
}

function NavItem({ href, icon, text, active = false }: { href: string, icon: React.ReactNode, text: string, active?: boolean }) {
  return (
    <li>
      <Link 
        href={href} 
        className={`flex items-center p-2 rounded-lg ${active ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-green-100'}`}
      >
        <span className="mr-3">{icon}</span>
        {text}
      </Link>
    </li>
  )
}