import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

const Spinner = () => (
  <div className="flex justify-center py-6">
    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
  </div>
);

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const loadContacts = async () => {
    const q = lastDoc
      ? query(collection(db, 'contacts'), orderBy('name'), startAfter(lastDoc), limit(10))
      : query(collection(db, 'contacts'), orderBy('name'), limit(10));

    const documentSnapshots = await getDocs(q);
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);

    if (documentSnapshots.docs.length < 10) {
      setHasMore(false);
    }

    const newContacts = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    
    console.log("Contacts before sorting:", newContacts.map(contact => contact.name));

    
    setContacts((prevContacts) => {
      const contactIds = new Set(prevContacts.map((contact) => contact.id));
      const filteredContacts = newContacts.filter((contact) => !contactIds.has(contact.id));
      const allContacts = [...prevContacts, ...filteredContacts];

      
      const sortedContacts = allContacts.sort((a, b) =>
        a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())
      );

      
      console.log("Contacts after sorting:", sortedContacts.map(contact => contact.name));

      return sortedContacts;
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
          onClick={() => navigate('/')} 
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add New Contact
        </button>
        <h2 className="text-3xl font-bold text-center flex-grow">Your Contacts</h2>
        <div className="w-32"></div> 
      </div>
      <div className="max-w-3xl mx-auto p-6">
        <InfiniteScroll
          pageStart={0}
          loadMore={loadContacts}
          hasMore={hasMore}
          loader={<Spinner key={0} />}
        >
          {contacts.map((contact) => (
            <div key={contact.id} className="p-4 bg-white rounded-lg shadow-md mb-4 flex items-center space-x-4">
              {contact.pictureUrl ? (
                <img
                  src={contact.pictureUrl}
                  alt={contact.name}
                  className="w-16 h-16 rounded-full border border-gray-300"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full border border-gray-300">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400 text-3xl" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{contact.name}</h3>
                <p className="text-gray-600">{contact.email}</p>
                <p className="text-gray-600">{contact.phoneNumber}</p>
              </div>
            </div>
          ))}
        </InfiniteScroll>
        {!hasMore && <p className="text-center text-gray-500 mt-4">No more contacts</p>}
      </div>
    </>
  );
};

export default ContactsList;
