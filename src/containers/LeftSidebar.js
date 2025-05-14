import routes from '../routes/sidebar'
import { NavLink, Link, useLocation } from 'react-router-dom'
import SidebarSubmenu from './SidebarSubmenu'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useDispatch } from 'react-redux'

function LeftSidebar() {
  const location = useLocation()
  const dispatch = useDispatch()

  const close = () => {
    document.getElementById('left-sidebar-drawer').click()
  }

  return (
    <div className="drawer-side z-30">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <div className="menu w-80 min-h-full bg-gradient-to-b from-base-200 to-base-100 text-base-content shadow-xl">
        {/* Close button */}
        <button 
          className="btn btn-circle btn-sm absolute top-4 right-4 bg-base-300 hover:bg-base-400 border-none shadow-md lg:hidden" 
          onClick={close}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>

        {/* Logo area */}
        <div className="px-6 py-8 border-b border-base-300">
          <Link 
            to="/app/welcome" 
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-content font-bold text-xl">DM</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Dev Market</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="overflow-y-auto py-6 px-4">
          <ul className="space-y-1">
            {routes.map((route, k) => (
              <li key={k} className="my-1">
                {route.submenu ? (
                  <SidebarSubmenu {...route} />
                ) : (
                  <NavLink
                    end
                    to={route.path}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-primary bg-opacity-10 text-primary font-medium' 
                        : 'hover:bg-base-300 hover:bg-opacity-50'
                      }
                    `}
                  >
                    <div className={`w-5 h-5 mr-3 ${location.pathname === route.path ? 'text-primary' : 'text-base-content text-opacity-70'}`}>
                      {route.icon}
                    </div>
                    <span>{route.name}</span>
                    {location.pathname === route.path && (
                      <span 
                        className="absolute left-0 h-8 w-1 bg-primary rounded-r-md" 
                        aria-hidden="true"
                      ></span>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar