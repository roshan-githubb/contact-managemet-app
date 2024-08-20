import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactForm from './components/ContactForm';
import { Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';

const ContactsList = lazy(() => import('.//components/ContactList'));

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-grow p-10 ml-0 md:ml-64 transition-all duration-300">
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
