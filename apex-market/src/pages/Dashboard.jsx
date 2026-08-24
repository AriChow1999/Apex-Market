import { useState } from 'react';
import { Upload, Plus, Trash2, Package } from 'lucide-react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useQueryClient } from '@tanstack/react-query';
import './Dashboard.css';
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const queryClient = useQueryClient();
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productRating, setProductRating] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('sportswear');
    const [productPhotos, setProductPhotos] = useState([]);

    // State for deletion
    const [deleteId, setDeleteId] = useState('');

    const categories = [
        'sportswear',
        'electronics',
        'appliances',
        'mobiles'
    ];

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const remainingSlots = 4 - productPhotos.length;
        const allowedFiles = files.slice(0, remainingSlots);

        const newPhotos = allowedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setProductPhotos(prev => [...prev, ...newPhotos]);
    };

    const handleRemovePhoto = (index) => {
        setProductPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', productId);
        formData.append('name', productName);
        formData.append('price', productPrice);
        formData.append('rating', productRating);
        formData.append('description', productDescription);
        formData.append('category', productCategory);

        productPhotos.forEach((photoObj) => {
            formData.append('photos', photoObj.file);
        });

        try {
            const response = await axios.post(`${API_BASE_URL}/products-upload`, formData);

            console.log('Server Response:', response.data);
            toast.success('Product uploaded successfully!');

            await queryClient.invalidateQueries({
                queryKey: ['products', productCategory]
            });

            setProductId('');
            setProductName('');
            setProductPrice('');
            setProductRating('');
            setProductDescription('');
            setProductCategory('sportswear');
            setProductPhotos([]);

        } catch (error) {
            console.error('Upload Error:', error);
            const errorMessage = error.response?.data?.error || 'Something went wrong during upload.';
            toast.error(errorMessage);
        }
    };

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        if (!deleteId.trim()) return;

        try {
            const response = await axios.delete(`${API_BASE_URL}/products/${deleteId}`);

            toast.success(response.data.message);

            // Invalidate all product queries to refresh lists across categories
            await queryClient.invalidateQueries({
                queryKey: ['products',response.data.category]
            });

            setDeleteId('');
        } catch (error) {
            console.error('Delete Error:', error);
            const errorMessage = error.response?.data?.error || 'Failed to delete product.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="apex-dashboard-page">
            <div className="apex-dashboard-container">
                <div className="apex-dashboard-header">
                    <h1><Package size={28} /> Admin Dashboard</h1>
                    <p>Upload new items and manage your inventory store-wide.</p>
                </div>

                {/* Add Product Card */}
                <div className="apex-dashboard-card">
                    <h2>Add New Product</h2>
                    <form onSubmit={handleSubmit} className="apex-dashboard-form">

                        <div className="apex-form-grid">
                            <div className="apex-field">
                                <label>Product ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. PROD-8841"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="apex-field">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Wireless Gaming Mouse"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="apex-field">
                                <label>Product Price (INR)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={productPrice}
                                    onChange={(e) => setProductPrice(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="apex-field">
                                <label>Product Rating (1.0 - 5.0)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="1.0"
                                    max="5.0"
                                    placeholder="e.g. 4.8"
                                    value={productRating}
                                    onChange={(e) => setProductRating(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="apex-field apex-span-field">
                                <label>Product Category</label>
                                <select
                                    value={productCategory}
                                    onChange={(e) => setProductCategory(e.target.value)}
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="apex-field">
                            <label>Product Description</label>
                            <textarea
                                rows="4"
                                placeholder="Provide a detailed description of the product..."
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="apex-field">
                            <label>Product Photos (Max 4)</label>
                            <div className="apex-photo-upload-area">
                                {productPhotos.length < 4 && (
                                    <label className="apex-upload-box">
                                        <Upload size={20} />
                                        <span>Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotoUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                )}

                                <div className="apex-preview-list">
                                    {productPhotos.map((photo, index) => (
                                        <div key={index} className="apex-preview-thumb">
                                            <img src={photo.preview} alt="Upload preview" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePhoto(index)}
                                                className="apex-thumb-remove"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="apex-submit-btn">
                            <Plus size={18} /> Publish Item
                        </button>

                    </form>
                </div>

                {/* Delete Product Card */}
                <div className="apex-dashboard-card" style={{ marginTop: '30px' }}>
                    <h2>Delete Product</h2>
                    <form onSubmit={handleDeleteSubmit} className="apex-dashboard-form">
                        <div className="apex-field">
                            <label>Product ID to Delete</label>
                            <input
                                type="text"
                                placeholder="e.g. PROD-8841"
                                value={deleteId}
                                onChange={(e) => setDeleteId(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="apex-submit-btn" style={{ backgroundColor: '#ef4444' }}>
                            <Trash2 size={18} /> Delete Item
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;