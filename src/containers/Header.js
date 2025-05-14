import { themeChange } from 'theme-change';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Heroicons
import { BellIcon, Bars3Icon, MoonIcon, SunIcon, UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

import { openRightDrawer } from '../features/common/rightDrawerSlice';
import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  // Sample notifications for premium demo
  const notifications = [
    { id: 1, message: "New team member request", time: "2 min ago", read: false },
    { id: 2, message: "Project deadline reminder", time: "1 hour ago", read: false },
    { id: 3, message: "New comment on your post", time: "3 hours ago", read: true },
    { id: 4, message: "System maintenance scheduled", time: "Yesterday", read: true }
  ];

  useEffect(() => {
    themeChange(false);
    if (currentTheme === null) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setCurrentTheme('dark');
      } else {
        setCurrentTheme('light');
      }
    }
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
        setNotificationDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currentTheme]);

  // Opening right sidebar for notifications
  const openNotification = () => {
    dispatch(openRightDrawer({ header: 'Notifications', bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION }));
  };

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Logout function with API call
  async function logoutUser() {
    try {
      // Show logout spinner
      setLoading(true);
      
      // await axios.post('/api/logout'); // Replace with your API endpoint
      localStorage.clear();
      
      // Small delay to show the spinner before navigation
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 800);
    } catch (error) {
      setLoading(false);
      console.error('Error during logout:', error.message);
    }
  }
  
  const [loading, setLoading] = useState(false);
  
  // Navigation items for profile dropdown
  const navItems = [
    { name: "Profile", icon: <UserIcon className="h-5 w-5" />, action: () => navigate('/app/profile') },
    { name: "Settings", icon: <Cog6ToothIcon className="h-5 w-5" />, action: () => navigate('/app/settings') },
    { 
      name: "Logout", 
      icon: loading ? 
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : 
        <ArrowRightOnRectangleIcon className="h-5 w-5" />, 
      action: logoutUser 
    }
  ];

  return (
    <div className="sticky top-0 z-30 w-full transition-all duration-300 bg-white dark:bg-gray-900 shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo and mobile menu */}
          <div className="flex items-center">
            <label htmlFor="left-sidebar-drawer" className="p-2 rounded-lg text-gray-600 lg:hidden hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none transition duration-150">
              <Bars3Icon className="h-6 w-6" />
            </label>
            
            <div className="ml-4 flex lg:ml-0">
              <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                {pageTitle}
              </span>
            </div>
          </div>

          {/* Right section - Theme toggle, notifications, profile */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition duration-150"
              aria-label="Toggle theme"
            >
              {currentTheme === 'dark' ? 
                <SunIcon className="h-5 w-5" /> : 
                <MoonIcon className="h-5 w-5" />
              }
            </button>

            {/* Notifications dropdown */}
            <div className="dropdown-container relative">
              <button 
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className="p-2 rounded-full relative bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none transition duration-150"
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                {noOfNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 text-white">
                    {noOfNotifications}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown menu */}
              {notificationDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none">
                  <div className="py-2 px-4 bg-gray-50 dark:bg-gray-900 flex justify-between items-center rounded-t-md">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Notifications</h3>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${notification.read ? '' : 'bg-blue-50 dark:bg-blue-900/20'}`}
                        >
                          <div className="flex items-start">
                            <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${notification.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500'}`}></div>
                            <div className="ml-3 w-full">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="py-2 px-4 bg-gray-50 dark:bg-gray-900 text-center rounded-b-md">
                    <button 
                      onClick={openNotification}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="dropdown-container relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition duration-150">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s"
                    alt="User profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="hidden md:flex md:items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mr-1">John Doe</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
              </button>
              
              {/* Profile dropdown menu */}
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-3 px-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKxfjTf49GAtu0PpFXK7mKBgqyJ5MfJCgQw&s"
                          alt="User profile"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-white">
                          John Doe
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          john.doe@example.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    {navItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDropdownOpen(false);
                          item.action();
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        disabled={item.name === "Logout" && loading}
                      >
                        <span className="mr-3 text-gray-500 dark:text-gray-400">
                          {item.icon}
                        </span>
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;