import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';
import axios from 'axios';
import { toast } from "react-toastify";
import './ProductPage.css';
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : import.meta.env.VITE_API_URL;

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/product/${id}`);
        setProduct(response.data);
        if (response.data.photos && response.data.photos.length > 0) {
          setSelectedImage(response.data.photos[0]);
        }
      } catch (err) {
        console.error('Fetch Product Error:', err);
        setError(err.response?.data?.error || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

const handleAddToCart = async () => {
  try {
    const token = localStorage.getItem('token');
    
    await axios.post(
      `${API_BASE_URL}/api/cart`,
      { 
        productId: product.id, 
        action: 'increase' 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setAddedToCart(true);
    toast.success("Product Added!!")
    setTimeout(() => setAddedToCart(false), 2500);
  } catch (err) {
    console.error('Add to Cart Error:', err);
    alert(err.response?.data?.error || 'Failed to add product to cart');
  }
};

  if (loading) {
    return (
      <div className="apex-product-page">
        <div className="apex-loading-state">
          <div className="apex-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="apex-product-page">
        <div className="apex-error-state">
          <p>{error || 'Product not found.'}</p>
        </div>
      </div>
    );
  }

  const images = product.photos && product.photos.length > 0 ? product.photos : [];
  const hasMultipleImages = images.length > 1;
  const productIdDisplay = product.id;

  return (
    <div className="apex-product-page">
      <div className="apex-product-container">

        {/* Left Side: Images Gallery Section */}
        <div className="apex-product-gallery">
          <div className="apex-main-image-frame">
            <img
              src={selectedImage}
              alt={product.name}
              className="apex-main-image"
            />
          </div>

          {/* Thumbnail Scrolling Strip */}
          {hasMultipleImages && (
            <div className="apex-thumbnail-scroll-strip">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`apex-thumb-btn ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Actions */}
        <div className="apex-product-details-pane">
          
          {/* Product ID Badge / SKU */}
          <div className="apex-product-meta-header">
            <span className="apex-product-id-badge">ID: {productIdDisplay}</span>
          </div>

          <h1 className="apex-product-title">{product.name}</h1>

          {/* Reviews Row */}
          <div className="apex-product-rating-row">
            <div className="apex-stars">
              <Star size={15} fill="#eab308" color="#eab308" />
              <span className="apex-rating-score">{product.rating || 4.8}</span>
            </div>
            <span className="apex-divider">•</span>
            <span className="apex-verified-text">Verified Quality Item</span>
          </div>

          {/* Pricing */}
          <div className="apex-product-price-tag">
            ₹{product.price ? product.price.toFixed(2) : '0.00'}
          </div>

          {/* Description */}
          <div className="apex-description-box">
            <h3>Description</h3>
            <p>{product.description || 'No description available for this item.'}</p>
          </div>

          {/* Add to Cart Action */}
          <div className="apex-action-group">
            <button
              onClick={handleAddToCart}
              className={`apex-add-cart-btn ${addedToCart ? 'success' : ''}`}
            >
              {addedToCart ? <Check size={18} /> : <ShoppingCart size={18} />}
              <span>{addedToCart ? 'Successfully Added!' : 'Add to Cart'}</span>
            </button>
          </div>

          {/* Trust Perks */}
          <div className="apex-perks-grid">
            <div className="apex-perk-item">
              <Truck size={20} className="apex-perk-icon" />
              <span>Free Global Shipping</span>
            </div>
            <div className="apex-perk-item">
              <ShieldCheck size={20} className="apex-perk-icon" />
              <span>2-Year Full Warranty</span>
            </div>
            <div className="apex-perk-item">
              <RotateCcw size={20} className="apex-perk-icon" />
              <span>30-Day Easy Returns</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductPage;