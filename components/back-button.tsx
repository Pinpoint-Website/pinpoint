'use client';

// This was fully written by Gemini

import React from 'react';

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6"
    >
      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      Go Back
    </button>
  );
}