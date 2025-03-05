import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  School, 
  CreditCard, 
  Settings, 
  LogOut, 
  FileText, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Search, 
  Home, 
  Book, 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart2,
  HelpCircle
} from "lucide-react";
import { Database } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

interface NavDropdownProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

interface NavLinkProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  badge?: number;
}

// Navigation dropdown component
const NavDropdown: React.FC<NavDropdownProps> = ({ 
  title, 
  icon, 
  isOpen, 
  onClick, 
  children 
}) => {
  return (
    <li className="relative">
      <button
        onClick={onClick}
        className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between rounded-md transition-colors
          ${isOpen 
            ? "text-indigo-700 bg-indigo-50" 
            : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
          }`}
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          <span>{title}</span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="pl-4 pr-2 py-2 space-y-1">
          {children}
        </div>
      )}
    </li>
  );
};

// Navigation link component
const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, onClick, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "text-indigo-700 bg-indigo-50 font-semibold"
          : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon && <span className="mr-3">{icon}</span>}
        <span>{label}</span>
      </div>
      {badge !== undefined && (
        <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

// Main Layout Component
const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; text: string; isRead: boolean }[]>([
    { id: 1, text: "New student registration", isRead: false },
    { id: 2, text: "Fee payment reminder", isRead: false },
    { id: 3, text: "Staff meeting at 3:00 PM", isRead: true }
  ]);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left section - Logo and toggle */}
            <div className="flex items-center">
              <button
                onClick={toggleMobileSidebar}
                className="p-2 rounded-md text-gray-500 lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMobileSidebarOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
              
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 lg:px-0">
                <School className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 hidden md:block">
                  School Management
                </span>
              </div>
            </div>

            {/* Center section - Search */}
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full">
                <div className="relative">
                  <div className="flex items-center">
                    {isSearchOpen ? (
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search for students, classes, etc..."
                        className="block w-full bg-gray-100 border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 ease-in-out"
                      />
                    ) : (
                      <div className="hidden md:block">
                        <button
                          onClick={toggleSearch}
                          className="p-2 flex items-center text-sm text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          <span>Search...</span>
                        </button>
                      </div>
                    )}
                    {isSearchOpen && (
                      <button
                        onClick={toggleSearch}
                        className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                    {!isSearchOpen && (
                      <button
                        onClick={toggleSearch}
                        className="md:hidden p-2 text-gray-500 hover:text-gray-600"
                      >
                        <Search className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right section - Notifications and Profile */}
            <div className="flex items-center">
              {/* Notifications */}
              <div className="relative ml-3" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <div className="relative">
                    <Bell className="h-6 w-6" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </div>
                </button>

                {/* Notifications dropdown */}
                {isNotificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-2 px-4 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                        <button className="text-xs text-indigo-600 hover:text-indigo-800">
                          Mark all as read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-8 px-4 text-center">
                          <p className="text-sm text-gray-500">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                              !notification.isRead ? 'bg-indigo-50' : ''
                            }`}
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                                !notification.isRead ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                              }`}>
                                <Bell className="h-4 w-4" />
                              </div>
                              <div className="ml-3 w-0 flex-1">
                                <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                  {notification.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  2 hours ago
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="py-2 px-4 border-t border-gray-100 text-center">
                      <Link to="/notifications" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="ml-3 relative" ref={profileDropdownRef}>
                <div>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center space-x-2">
                      <img
                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="User avatar"
                      />
                      <span className="hidden md:block text-sm font-medium text-gray-700">John Doe</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </button>
                </div>
                
                {isProfileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">admin@school.edu</p>
                    </div>

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-3" />
                        Your Profile
                      </div>
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </div>
                    </Link>
                    
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
            onClick={toggleMobileSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <div
          ref={dropdownRef}
          className={`bg-white shadow-lg fixed lg:sticky top-0 lg:top-16 h-full z-30 w-64 lg:w-56 xl:w-64 transform ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col lg:h-[calc(100vh-4rem)]`}
        >
          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 px-2 space-y-1">
              {/* Dashboard Link */}
              <NavLink 
                to="/" 
                icon={<Home className="h-5 w-5" />} 
                label="Dashboard" 
                onClick={() => setIsMobileSidebarOpen(false)}
              />

              {/* Master Dropdown */}
              <NavDropdown 
                title="Master Data" 
                icon={<Database className="h-5 w-5" />}
                isOpen={activeDropdown === "master"} 
                onClick={() => toggleDropdown("master")}
              >
                <NavLink 
                  to="/master" 
                  label="Master Dashboard" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <NavLink 
                  to="/master/classes" 
                  label="Classes & Sections" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <NavLink 
                  to="/master/subjects" 
                  label="Subjects" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              </NavDropdown>

              {/* Students Dropdown */}
              <NavDropdown 
                title="Students" 
                icon={<Users className="h-5 w-5" />}
                isOpen={activeDropdown === "students"} 
                onClick={() => toggleDropdown("students")}
              >
                <NavLink 
                  to="/students" 
                  label="Student Directory" 
                  badge={158}
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <NavLink 
                  to="/students/admission" 
                  label="New Admission" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <NavLink 
                  to="/students/attendance" 
                  label="Attendance" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              </NavDropdown>

              {/* Staff Dropdown */}
              <NavDropdown 
                title="Staff" 
                icon={<Users className="h-5 w-5" />}
                isOpen={activeDropdown === "staff"} 
                onClick={() => toggleDropdown("staff")}
              >
                <NavLink 
                  to="/staff" 
                  label="Staff Directory" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <NavLink 
                  to="/staff/attendance" 
                  label="Attendance" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              </NavDropdown>

              {/* Fees Dropdown */}
              <NavDropdown 
                title="Finance" 
                icon={<DollarSign className="h-5 w-5" />}
                isOpen={activeDropdown === "fees"} 
                onClick={() => toggleDropdown("fees")}
              >
                <NavLink 
                  to="/fee-structure" 
                  label="Fee Structure" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <NavLink 
                  to="/fee-collection" 
                  label="Fee Collection" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <NavLink 
                  to="/accounts" 
                  label="Accounts" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              </NavDropdown>

              {/* Examination System Dropdown */}
              <NavDropdown 
                title="Examinations" 
                icon={<FileText className="h-5 w-5" />}
                isOpen={activeDropdown === "examination"} 
                onClick={() => toggleDropdown("examination")}
              >
                <NavLink 
                  to="/examination-system" 
                  label="Exam Dashboard" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <NavLink 
                  to="/examination/schedule" 
                  label="Exam Schedule" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <NavLink 
                  to="/examination/results" 
                  label="Results" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              </NavDropdown>

              {/* Academics */}
              <NavDropdown 
                title="Academics" 
                icon={<Book className="h-5 w-5" />}
                isOpen={activeDropdown === "academics"} 
                onClick={() => toggleDropdown("academics")}
              >
                <NavLink 
                  to="/timetable" 
                  label="Timetable" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <NavLink 
                  to="/syllabus" 
                  label="Syllabus" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              </NavDropdown>

              {/* Reports */}
              <NavLink 
                to="/reports" 
                icon={<BarChart2 className="h-5 w-5" />} 
                label="Reports" 
                onClick={() => setIsMobileSidebarOpen(false)}
              />

              {/* Calendar */}
              <NavLink 
                to="/calendar" 
                icon={<Calendar className="h-5 w-5" />} 
                label="Calendar" 
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-200 p-4">
            <Link 
              to="/help" 
              className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Help & Support
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};


export default Layout;