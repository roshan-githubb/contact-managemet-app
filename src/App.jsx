import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import ContactForm from './components/ContactForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAddressBook } from '@fortawesome/free-solid-svg-icons';

const ContactsList = lazy(() => import('./components/ContactList'));

const Sidebar = () => {
  const location = useLocation();

  const getLinkClass = (path) =>
    `flex items-center space-x-3 p-2 rounded-lg ${
      location.pathname === path ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-green-700 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-green-800 text-white flex flex-col items-start p-6 h-screen fixed overflow-y-auto">
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
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-grow ml-64 p-10">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<ContactForm />} />
              <Route
                path="/contacts"
                element={
                  <Suspense fallback={<div className="text-center">Loading contacts...</div>}>
                    <ContactsList />
                  </Suspense>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
