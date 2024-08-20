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
        const pictureRef = ref(storage, `pictures/${picture.name}`);
        await uploadBytes(pictureRef, picture);
        pictureUrl = await getDownloadURL(pictureRef);
      }

      await addDoc(collection(db, 'contacts'), {
        name,
        email,
        phoneNumber,
        pictureUrl,
      });

      toast.success('Contact saved successfully!');

      setName('');
      setEmail('');
      setPhoneNumber('');
      setPicture(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
      }
    } catch (error) {
      console.error('Error adding contact: ', error);
      toast.error('Failed to save contact.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept: 'image/*', 
    noClick: true, 
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        onPaste={handlePaste}
        className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Add Contact</h2>
      
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder='Enter a name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder='Enter an email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            placeholder='Enter a phone'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Picture</label>
          <div
            {...getRootProps({
              className: `mt-1 p-4 border-2 border-dashed rounded-md ${
                isDragActive ? 'border-blue-500' : 'border-gray-300'
              } cursor-pointer`
            })}
            onClick={() => fileInputRef.current.click()} 
          >
            <input {...getInputProps()} ref={fileInputRef} style={{ display: 'none' }} />
            {picture ? (
              <p className="text-gray-700">{picture.name}</p>
            ) : (
              <p className="text-gray-500">Drag 'n' drop a file here, or click to select one. You can also paste an image.</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {uploading ? 'Saving...' : 'Save Contact'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ContactForm;
