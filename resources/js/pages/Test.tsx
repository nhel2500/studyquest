// resources/js/Pages/Test.tsx
import React from 'react';

export default function Test({ message }) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Test Page</h1>
                <p>{message}</p>
            </div>
        </div>
    );
}