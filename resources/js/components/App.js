import React from 'react';
import { createRoot } from 'react-dom/client';
import ProductList from './ProductList';
import { FiBox } from 'react-icons/fi';

function App() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
                            <span className="text-white font-bold text-lg">PM</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-none">Product Inventory Manager</h1>
                            <p className="text-xs text-gray-500 mt-1">Complete inventory management</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ProductList />
            </main>

            <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
                <p className="text-sm text-gray-400 flex justify-end items-center gap-2">
                </p>
            </footer>
        </div>
    );
}

export default App;

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
