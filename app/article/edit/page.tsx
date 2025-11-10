'use client';

import React, { useState, useEffect } from 'react';

import { useSearchParams, useRouter } from 'next/navigation';
import SidebarAction from '../_components/SidebarActions';
import DetailForm from '../_components/DetailForms';
import MessageBoard from '../_components/MessageBoard';
import StatusDisplay from '../_components/StatusDisplay';
import { API_SERVER } from '@/app/config/api-path';
import Link from 'next/link';

interface ArticleFormData {
  userId: string;
  title: string;
  location: string;
  content: string;
  photos: File | null;
}

export default function ArticleForm() {
  const [formData, setFormData] = useState<ArticleFormData>({
    userId: '',
    title: '',
    location: '',
    content: '',
    photos: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 🔹 Handle Input Change ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- 🔹 Handle File Upload ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      photos: file,
    }));
  };

  // --- 🔹 Handle Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append('userId', formData.userId);
      form.append('title', formData.title);
      form.append('location', formData.location);
      form.append('content', formData.content);
      if (formData.photos) form.append('photos', formData.photos);

      const res = await fetch('https://localhost:3001/article/create', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) throw new Error('Failed to submit data');

      alert('✅ Article submitted successfully!');
      setFormData({
        userId: '',
        title: '',
        location: '',
        content: '',
        photos: null,
      });
    } catch (err) {
      console.error(err);
      alert('❌ Failed to submit article');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 🔹 UI ---
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        📝 Edit Article 編輯文章
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* User name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            User 使用者
          </label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your user ID"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter article title"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Location 地點
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter location"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Content 內容
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
            placeholder="Write your article here..."
            required
          ></textarea>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Photos</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-gray-700"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Article'}
        </button>
      </form>
    </div>
  );
}

// export interface PageProps {

// }

// export default function EditPage({  }: PageProps) {
//   return (
//     <>
//       <div>Page</div>
//     </>
//   );
// }
