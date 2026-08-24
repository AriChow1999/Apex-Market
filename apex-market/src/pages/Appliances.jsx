import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Appliances.css';

const fetchAppliancesProducts = async () => {
  const response = await axios.post('http://localhost:5000/api/products', {
    category: 'appliances'
  });
  return response.data;
};

const ITEMS_PER_PAGE = 10;

const Appliances = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const { data: products = [], isLoading: loading, error } = useQuery({
    queryKey: ['products', 'appliances'],
    queryFn: fetchAppliancesProducts,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="apex-sportswear-page">
      {/* Search Header Section */}
      <div className="apex-sportswear-hero">
        <div className="apex-sportswear-search-container">
          <h1>Home Appliances Collection</h1>
          <p>Upgrade your home with modern, efficient, and smart household appliances.</p>
          <div className="apex-search-bar-wrapper">
            <Search size={18} className="apex-search-icon" />
            <input
              type="text"
              placeholder="search in appliances..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="apex-sportswear-search-input"
            />
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="apex-products-container">
        <div className="apex-products-header">
          <h2>Featured Appliances ({filteredProducts.length})</h2>
        </div>

        {loading ? (
          <div className="apex-loading-state">
            <p>Loading appliances...</p>
          </div>
        ) : error ? (
          <div className="apex-error-state">
            <p>{error.response?.data?.message || error.message || 'Failed to fetch appliances products.'}</p>
          </div>
        ) : (
          <>
            <div className="apex-products-grid">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <div 
                    key={product._id || product.id} 
                    className="apex-product-card" 
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="apex-product-image-box">
                      <img
                        src={product.photos && product.photos.length > 0 ? product.photos[0] : ''}
                        alt={product.name}
                      />
                      {product.brand && <span className="apex-product-badge">{product.brand}</span>}
                    </div>

                    <div className="apex-product-content">
                      <div className="apex-product-rating">
                        <Star size={14} fill="#eab308" color="#eab308" />
                        <span>{product.rating || 4.8}</span>
                      </div>
                      <h3>{product.name}</h3>
                      <div className="apex-product-footer">
                        <span className="apex-product-price">₹{product.price}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="apex-no-results">
                  <p>No appliances found matching "{searchQuery}".</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="apex-pagination-container">
                <button
                  className="apex-pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <div className="apex-pagination-numbers">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`apex-page-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="apex-pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Appliances;