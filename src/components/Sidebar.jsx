import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAddressBook, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const getLinkClass = (path) =>
    `flex items-center space-x-3 p-2 rounded-lg ${
      location.pathname === path ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-green-700 hover:text-white'
    }`;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 text-white bg-green-800 p-3 rounded-md md:hidden"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
      </button>

      <aside
        className={`fixed top-0 left-0 bg-green-800 text-white flex flex-col items-start p-6 h-screen overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64 z-30`} 
         >
        <Link to="/" className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <FontAwesomeIcon icon={faAddressBook} className="text-3xl" />
          <span>Contact Manager</span>
        </Link>
        <nav className="flex flex-col space-y-2">
          <Link to="/" className={getLinkClass('/')}>
            <FontAwesomeIcon icon={faHome} />
            <span>Home</span>
          </Link>
          <Link to="/contacts" className={getLinkClass('/contacts')}>
            <FontAwesomeIcon icon={faAddressBook} />
            <span>Contacts</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
