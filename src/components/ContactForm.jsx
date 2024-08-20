import React, { useState, useRef } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import 'react-toastify/dist/ReactToastify.css';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [picture, setPicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileDrop = (acceptedFiles) => {
    if (acceptedFiles[0]) {
      setPicture(acceptedFiles[0]);
    }
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        setPicture(item.getAsFile());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let pictureUrl = '';
      if (picture) {
        const storageRef = ref(storage, `contacts/${picture.name}`);
        await uploadBytes(storageRef, picture);
        pictureUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'contacts'), {
        name,
        email,
        phoneNumber,
        pictureUrl,
      });

      toast.success('Contact added successfully');
      setName('');
      setEmail('');
      setPhoneNumber('');
      setPicture(null);
      fileInputRef.current.value = '';
    } catch (error) {
      toast.error('Failed to add contact');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileDrop,
    accept: 'image/*',
    noClick: true,
  });

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative z-20 md:z-30">
        <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Picture</label>
          <div
            {...getRootProps()}
            className="border-2 border-gray-300 border-dashed p-4 rounded cursor-pointer relative z-20"
            onClick={() => fileInputRef.current.click()} 
          >
            <input
              {...getInputProps()}
              ref={fileInputRef}
              style={{ display: 'none' }} 
            />
            {picture ? (
              <p className="text-gray-600">{picture.name}</p>
            ) : (
              <p className="text-gray-600">Drag & drop an image here, or click to select</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
        >
          {uploading ? 'Adding...' : 'Add Contact'}
        </button>
      </form>
    </>
  );
};

export default ContactForm;
