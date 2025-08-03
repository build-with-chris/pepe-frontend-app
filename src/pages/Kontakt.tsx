

import React, { useState } from 'react';

const Kontakt: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Platzhalter: Nachricht würde an info@pepearts.de und chris@pepearts.de gesendet
    console.log('Formulardaten:', formData);
    alert('Danke für deine Nachricht! Wir melden uns bei dir.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Kontaktiere uns</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Dein Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Deine E-Mail"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required
        />
        <textarea
          name="message"
          placeholder="Deine Nachricht"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Nachricht senden
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Deine Nachricht geht an <strong>info@pepearts.de</strong> und <strong>chris@pepearts.de</strong>.
      </p>
    </div>
  );
};

export default Kontakt;