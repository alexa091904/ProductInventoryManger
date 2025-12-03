import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import { FiSearch, FiPlus, FiFilter, FiEdit2, FiTrash2, FiBox } from 'react-icons/fi';
import api from '../api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/products/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/products?search=${search}&category=${selectedCategory}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, selectedCategory]);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/api/products/${id}`);
                fetchProducts();
                fetchCategories(); // Refresh categories in case the last item of a category was deleted
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
        fetchCategories(); // Refresh categories in case a new one was added
    };

    // Calculate Stats
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity)), 0);
    const lowStockCount = products.filter(p => p.quantity < 10).length;
    const totalCategories = categories.length;

    // CSV export removed

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
                    <h3 className="text-3xl font-bold text-gray-900">{totalProducts}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Value</p>
                    <h3 className="text-3xl font-bold text-gray-900">₱{totalValue.toFixed(2)}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Low Stock</p>
                    <h3 className="text-3xl font-bold text-gray-900">{lowStockCount}</h3>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        className="w-full pl-11 pr-4 py-3 border-none rounded-lg focus:ring-0 text-sm bg-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto p-2">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border-none text-sm text-gray-600 focus:ring-0 bg-transparent cursor-pointer hover:text-gray-900"
                    >
                        <option value="All Categories">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    {/* CSV export button removed */}
                </div>
            </div>

            {/* Add Product Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                    <FiPlus /> Add Product
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="bg-gray-50 p-6 rounded-full mb-6">
                        <FiBox className="text-4xl text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm">Get started by adding your first product to the inventory.</p>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
                    >
                        <FiPlus /> Add Product
                    </button>
                </div>
            ) : (
                /* Product Table */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        {product.quantity < 10 ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                                In Stock
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600 text-sm">
                                            {product.category || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">
                                        {product.quantity}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        ₱{Number(product.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <ProductForm
                    product={editingProduct || {}}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProductList;
