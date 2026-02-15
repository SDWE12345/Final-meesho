import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Sidenav from '../Sidenav';
import SimilarProducts from '../SimilarProducts';

// =============================================
// HELPER FUNCTIONS
// =============================================
const getSizeLabel = (sizeNum) => {
  const sizes = { 1: 's', 2: 'm', 3: 'l', 4: 'xl', 5: '2xl' };
  return sizes[sizeNum] || 's';
};

const getCartData = () => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem("cart");

  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};


const saveCartData = (data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem("cart", JSON.stringify(data));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

// =============================================
// SKELETON LOADER
// =============================================
const ProductSkeleton = () => (
  <div className="skeleton-container">
    <div className="skeleton-header">
      <div className="skeleton-back"></div>
      <div className="skeleton-logo"></div>
      <div className="skeleton-actions">
        <div className="skeleton-icon"></div>
        <div className="skeleton-icon"></div>
      </div>
    </div>
    <div className="skeleton-slider"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-title short"></div>
      <div className="skeleton-price-group">
        <div className="skeleton-price"></div>
        <div className="skeleton-price"></div>
      </div>
      <div className="skeleton-badges">
        <div className="skeleton-badge"></div>
        <div className="skeleton-badge"></div>
      </div>
    </div>

    <style jsx>{`
      .skeleton-container { background: #fff; min-height: 100vh; animation: fadeIn 0.3s; }
      .skeleton-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f0f0f0; }
      .skeleton-back, .skeleton-logo, .skeleton-icon { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
      .skeleton-back { width: 30px; height: 30px; border-radius: 50%; }
      .skeleton-logo { width: 90px; height: 24px; }
      .skeleton-actions { display: flex; gap: 15px; }
      .skeleton-icon { width: 24px; height: 24px; border-radius: 50%; }
      .skeleton-slider { width: 100%; height: 360px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
      .skeleton-content { padding: 16px; }
      .skeleton-title { height: 18px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 10px; }
      .skeleton-title.short { width: 70%; }
      .skeleton-price-group { display: flex; gap: 10px; margin: 16px 0; }
      .skeleton-price { height: 24px; width: 70px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
      .skeleton-badges { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-top: 20px; }
      .skeleton-badge { height: 60px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
      @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    `}</style>
  </div>
);

// =============================================
// CUSTOM IMAGE SLIDER
// =============================================
const CustomImageSlider = ({ images = [], title = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = (index) => {
    if (!isTransitioning) {
      setCurrentIndex(index);
    }
  };

  const goToPrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) goToNext();
    if (touchStart - touchEnd < -75) goToPrevious();
  };

  if (!images || images.length === 0) {
    return (
      <div style={{ width: '100%', height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
        <p style={{ color: '#999', fontSize: '14px' }}>No images available</p>
      </div>
    );
  }

  return (
    <div className="image-slider-wrapper">
      <div
        className="image-slider-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="image-slider-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <div key={index} className="image-slide">
              <img
                src={image}
                alt={`${title} - Image ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23f5f5f5" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className="slider-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .image-slider-wrapper {
          position: relative;
          width: 100%;
          background: #fff;
        }
        
        .image-slider-container {
          position: relative;
          width: 100%;
          height: 360px;
          overflow: hidden;
          background: #fff;
        }
        
        .image-slider-track {
          display: flex;
          height: 100%;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .image-slide {
          min-width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #fff;
        }
        
        .image-slide img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          user-select: none;
        }
        
        .slider-indicators {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
          background: rgba(255, 255, 255, 0.85);
          padding: 6px 12px;
          border-radius: 16px;
          backdrop-filter: blur(4px);
        }
        
        .indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d0d0d0;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        
        .indicator.active {
          width: 20px;
          border-radius: 3px;
          background: #9f2089;
        }
      `}</style>
    </div>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================
function ProductDetails() {
  const [loading, setLoading] = useState(true);
  const [data133, setData133] = useState([]);
  const [data1, setData1] = useState({});
  const [mySidenavopen, setmySidenavopen] = useState(true);
  const [size, setSize] = useState(1);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const cartData = getCartData();
    setData133(cartData);

    const handleStorage = () => {
      setData133(getCartData());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!router.query.id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${router.query.id}`);
        const result = await response.json();

        if (result.success && result.data) {
          setData1(result.data);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [router.query.id]);

  const addToCart = (buyNow = false) => {
    if (!data1) return;

    const storedData = getCartData();
    const existingProducts = Array.isArray(storedData) ? storedData : [];

    const productId = data1?._id || data1?.id;
    if (!productId) return;

    const existingProductIndex = existingProducts.findIndex(
      product => (product?._id || product?.id) === productId
    );

    if (existingProductIndex !== -1) {
      existingProducts[existingProductIndex].quantity =
        (existingProducts[existingProductIndex].quantity || 0) + 1;
    } else {
      existingProducts.push({
        ...data1,
        quantity: 1,
      });
    }

    saveCartData(existingProducts);
    setData133(existingProducts);
    if (buyNow) {
      router?.push?.("/cart");
    } else {
      setmySidenavopen?.(false);
    }
  };

  const calculateDiscount = () => {
    const mrp = data1.mrp || data1.cancelprice || 0;
    const selling = data1.sellingPrice || data1.price || 0;
    if (mrp > 0) {
      return Math.round(((mrp - selling) / mrp) * 100);
    }
    return 0;
  };

  if (loading) return <ProductSkeleton />;

  if (error || !data1 || (!data1._id && !data1.id)) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <Link href="/">
          <span className="go-home-btn">Go Home</span>
        </Link>

        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            padding: 20px;
            text-align: center;
          }
          
          .error-container h2 {
            margin-bottom: 20px;
            font-size: 20px;
            color: #333;
          }
          
          .go-home-btn {
            padding: 12px 30px;
            background: #9f2089;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: inline-block;
          }
        `}</style>
      </div>
    );
  }

  const productImages = data1.images || data1.slider || [];

  return (
    <>
      <Head>
        <title>{data1.title || data1.title2 || 'Product'} - Meesho</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <div className="product-page">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <Link href="/" className="back-btn">
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.7461 2.31408C13.5687 2.113 13.3277 2 13.0765 2C12.8252 2 12.5843 2.113 12.4068 2.31408L6.27783 9.24294C5.90739 9.66174 5.90739 10.3382 6.27783 10.757L12.4068 17.6859C12.7773 18.1047 13.3757 18.1047 13.7461 17.6859C14.1166 17.2671 14.0511 16.5166 13.7461 16.1718L8.29154 9.99462L13.7461 3.82817C13.9684 3.57691 14.1071 2.72213 13.7461 2.31408Z" fill="#666666" />
              </svg>
            </Link>
            <Link href="/" className="logo">
              <svg viewBox="0 0 156 36" fill="none" xmlns="http://www.w3.org/2000/svg" height={22}>
                <g clipPath="url(#meeshoLogo_svg__a)">
                  <path d="M56.307 23.698c.38-.29.568-.707.568-1.253 0-1.731-.237-3.288-.707-4.675-.47-1.383-1.154-2.56-2.053-3.535a8.967 8.967 0 0 0-3.235-2.232c-1.262-.515-2.685-.774-4.264-.774-2.157 0-4.08.492-5.767 1.48-1.687.99-3.007 2.35-3.969 4.08-.957 1.732-1.436 3.755-1.436 6.063 0 2.372.492 4.42 1.481 6.157.989 1.731 2.394 3.069 4.22 4.013 1.825.944 3.995 1.414 6.518 1.414 1.186 0 2.47-.161 3.852-.479 1.383-.318 2.604-.814 3.669-1.48.546-.336.935-.73 1.163-1.186.228-.457.313-.904.25-1.347a2.007 2.007 0 0 0-.523-1.119c-.29-.304-.675-.478-1.163-.523-.488-.045-1.047.112-1.687.479a9.65 9.65 0 0 1-2.805 1.024c-.989.197-1.88.295-2.667.295-2.281 0-4.004-.613-5.176-1.847-.926-.976-1.481-2.358-1.673-4.125h13.78c.707 0 1.244-.144 1.624-.43Zm-12.72-7.705c.895-.595 1.982-.89 3.262-.89 1.154 0 2.12.25 2.894.752.774.5 1.37 1.226 1.777 2.165.34.783.532 1.732.59 2.828H40.93c.107-.864.304-1.655.603-2.349.475-1.078 1.16-1.915 2.054-2.505ZM81.13 23.698c.38-.29.568-.707.568-1.253 0-1.731-.237-3.288-.707-4.675-.47-1.383-1.154-2.56-2.054-3.535a8.966 8.966 0 0 0-3.234-2.232c-1.262-.515-2.685-.774-4.264-.774-2.157 0-4.08.492-5.767 1.48-1.687.99-3.007 2.35-3.969 4.08-.957 1.732-1.436 3.755-1.436 6.063 0 2.372.492 4.42 1.48 6.157.99 1.731 2.394 3.069 4.22 4.013 1.825.944 3.995 1.414 6.519 1.414 1.185 0 2.47-.161 3.852-.479 1.383-.318 2.604-.814 3.669-1.48.546-.336.935-.73 1.163-1.186.228-.457.313-.904.25-1.347a2.008 2.008 0 0 0-.523-1.119c-.29-.304-.675-.478-1.163-.523-.488-.045-1.047.112-1.687.479a9.65 9.65 0 0 1-2.805 1.024c-.989.197-1.88.295-2.667.295-2.282 0-4.004-.613-5.176-1.847-.931-.976-1.481-2.358-1.674-4.125h13.78c.703 0 1.245-.144 1.625-.43Zm-12.72-7.705c.895-.595 1.982-.89 3.261-.89 1.155 0 2.121.25 2.895.752.774.5 1.37 1.226 1.776 2.165.34.783.533 1.732.591 2.828h-11.18c.106-.864.303-1.655.603-2.349.47-1.078 1.154-1.915 2.054-2.505ZM97.993 21.394l-4.559-.868c-.881-.152-1.535-.438-1.96-.868-.425-.425-.64-.957-.64-1.597 0-.85.358-1.535 1.07-2.054.716-.514 1.816-.774 3.306-.774.792 0 1.62.108 2.483.318.868.215 1.772.564 2.712 1.047.514.241.98.326 1.391.25a1.71 1.71 0 0 0 1.025-.595 2.47 2.47 0 0 0 .546-1.096 1.975 1.975 0 0 0-.112-1.208c-.166-.394-.479-.716-.935-.957a13.835 13.835 0 0 0-3.396-1.347c-1.173-.29-2.425-.434-3.763-.434-1.852 0-3.494.29-4.926.868-1.427.577-2.546 1.4-3.351 2.46-.805 1.066-1.208 2.327-1.208 3.786 0 1.61.492 2.926 1.48 3.942.99 1.02 2.426 1.709 4.31 2.076l4.559.867c.94.184 1.646.466 2.12.842.47.38.707.921.707 1.62 0 .818-.358 1.48-1.07 1.981-.715.501-1.798.752-3.26.752-1.034 0-2.081-.112-3.146-.34-1.065-.228-2.206-.63-3.418-1.208-.488-.242-.936-.318-1.347-.228-.412.09-.747.29-1.002.59-.26.305-.412.662-.457 1.074a2.24 2.24 0 0 0 .228 1.23c.197.412.542.77 1.025 1.07 1.154.671 2.46 1.14 3.92 1.414 1.458.273 2.84.411 4.147.411 2.886 0 5.199-.63 6.93-1.892 1.732-1.262 2.6-3.002 2.6-5.222 0-1.642-.51-2.948-1.526-3.919-1.011-.957-2.51-1.624-4.483-1.99ZM125.603 12.32c-1.155-.666-2.631-1.002-4.421-1.002-1.794 0-3.396.416-4.81 1.253a7.254 7.254 0 0 0-2.483 2.443V4.437c0-.944-.25-1.656-.751-2.143-.501-.488-1.208-.73-2.121-.73s-1.611.242-2.099.73c-.487.487-.729 1.199-.729 2.143v27.082c0 .944.242 1.664.729 2.165.488.501 1.186.752 2.099.752 1.915 0 2.872-.97 2.872-2.917v-9.986c0-1.732.492-3.123 1.481-4.17.989-1.047 2.318-1.575 3.991-1.575 1.369 0 2.38.393 3.034 1.185.653.792.979 2.054.979 3.786v10.76c0 .944.251 1.664.752 2.165.501.501 1.208.752 2.121.752s1.611-.25 2.098-.752c.488-.5.729-1.221.729-2.165V20.486c0-2.067-.29-3.777-.867-5.128-.582-1.355-1.446-2.367-2.604-3.038ZM150.618 12.642c-1.7-.944-3.709-1.413-6.018-1.413-1.731 0-3.297.268-4.698.796-1.396.532-2.599 1.306-3.601 2.326-1.003 1.02-1.772 2.233-2.305 3.647-.532 1.414-.796 3.015-.796 4.81 0 2.37.47 4.429 1.414 6.178.939 1.75 2.264 3.092 3.968 4.036 1.701.944 3.709 1.414 6.018 1.414 1.732 0 3.297-.269 4.698-.797 1.396-.532 2.599-1.306 3.602-2.326 1.002-1.02 1.771-2.242 2.304-3.669.532-1.427.796-3.038.796-4.832 0-2.371-.47-4.42-1.414-6.156-.944-1.736-2.264-3.074-3.968-4.014Zm-1.07 14.201c-.469 1.079-1.132 1.893-1.982 2.439-.85.546-1.838.818-2.961.818-1.701 0-3.07-.613-4.103-1.847-1.034-1.23-1.548-3.047-1.548-5.45 0-1.61.237-2.957.707-4.036.469-1.078 1.132-1.883 1.982-2.416.85-.532 1.839-.796 2.962-.796 1.7 0 3.069.6 4.102 1.799 1.034 1.199 1.548 3.015 1.548 5.45 0 1.614-.237 2.961-.707 4.04ZM15.512 34.431c-1.387 0-2.555-1.167-2.555-2.554V20.18c.013-2.165-1.79-3.915-3.924-3.879-2.134-.036-3.932 1.718-3.924 3.88v11.695a2.557 2.557 0 0 1-2.554 2.554C1.18 34.431 0 33.246 0 31.877V20.22a8.993 8.993 0 0 1 2.649-6.389 8.998 8.998 0 0 1 6.384-2.648 9.012 9.012 0 0 1 6.483 2.742A8.997 8.997 0 0 1 22 11.184a8.982 8.982 0 0 1 6.385 2.648 9.008 9.008 0 0 1 2.649 6.39v11.654c0 1.37-1.181 2.555-2.555 2.555a2.557 2.557 0 0 1-2.555-2.554V20.18c.014-2.165-1.79-3.915-3.924-3.879-2.134-.036-3.932 1.718-3.923 3.88v11.695c-.01 1.387-1.177 2.554-2.564 2.554Z" fill="#570D48" />
                </g>
              </svg>
            </Link>
          </div>
          <div className="header-right">
            <Link href="/wishlist" className="icon-btn">
              <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 9.174c0 3.724-1.87 7.227-9.67 12.38a.58.58 0 0 1-.66 0C3.87 16.401 2 12.898 2 9.174S4.59 3.67 7.26 3.66c3.22-.081 4.61 3.573 4.74 3.774.13-.201 1.52-3.855 4.74-3.774C19.41 3.669 22 5.45 22 9.174Z" fill="#ED3843" />
              </svg>
            </Link>
            <button className="icon-btn cart-btn" onClick={(e) => { e.preventDefault(); setmySidenavopen(!mySidenavopen); }}>
              <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.003 5.183h15.139c.508 0 .908.49.85 1.046l-.762 7.334c-.069.62-.537 1.1-1.103 1.121l-12.074.492-2.05-9.993Z" fill="#C53EAD" />
                <path d="M11.8 21.367c.675 0 1.22-.597 1.22-1.334 0-.737-.545-1.335-1.22-1.335-.673 0-1.22.598-1.22 1.335s.547 1.334 1.22 1.334ZM16.788 21.367c.674 0 1.22-.597 1.22-1.334 0-.737-.546-1.335-1.22-1.335-.673 0-1.22.598-1.22 1.335s.547 1.334 1.22 1.334Z" fill="#9F2089" />
                <path d="m2.733 4.169 3.026 1.42 2.528 12.085c.127.609.615 1.036 1.181 1.036h9.615" stroke="#9F2089" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {data133?.length > 0 && (
                <span className="cart-badge">{data133.length}</span>
              )}
            </button>
          </div>
        </div>

        <Sidenav mySidenavopen={mySidenavopen} setmySidenavopen={setmySidenavopen} data133={data133} setdata133={setData133} />

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="separator">/</span>
          <span className="current">{data1.title2 || data1.title}</span>
        </div>

        {/* Image Slider */}
        <CustomImageSlider images={productImages} title={data1.title || data1.title2} />

        {/* Product Info */}
        <div className="product-info">
          <h1 className="product-title m-0">{data1.title2 || data1.title}</h1>

          <div className="price-section">
            <div className="price-row">
              <span className="current-price">₹{data1.sellingPrice || data1.price}</span>
              <span className="original-price">₹{data1.mrp || data1.cancelprice}</span>
              <span className="discount-badge">{calculateDiscount()}% off</span>
            </div>
            {data1.mrp && data1.sellingPrice && (
              <p className="savings-text">Save ₹{(data1.mrp - data1.sellingPrice).toLocaleString()} with 2 special offer</p>
            )}
          </div>

          <div className="delivery-badge">
            <span>Free Delivery</span>
          </div>

          {data1.rating && (
            <div className="rating-section">
              <div className="rating-badge">
                <span className="rating-value">{data1.rating}</span>
                <svg width={12} height={12} viewBox="0 0 12 12" fill="white">
                  <path d="M6 1l1.545 3.13L11 4.635 8.5 7.07l.59 3.43L6 8.885 2.91 10.5l.59-3.43L1 4.635l3.455-.505L6 1z" />
                </svg>
              </div>
              <span className="rating-text">{data1.reviewCount?.toLocaleString()} Ratings, {data1.reviewCount?.toLocaleString()} Reviews</span>
            </div>
          )}
        </div>

        {/* Similar Products */}
        <SimilarProducts currentProductId={data1._id || data1.id} />

        {/* Product Details */}
        {(data1.description || data1.highlight || data1.features) && (
          <div className="product-details">
            <h3 className="details-title">Product Details</h3>
            {data1.features && (
              <div className="features-section" >
                {data1.features && <div dangerouslySetInnerHTML={{ __html: data1.features }} />}
              </div>
            )}
            {data1.highlight && <div dangerouslySetInnerHTML={{ __html: data1.highlight }} />}
            {data1.description && <div dangerouslySetInnerHTML={{ __html: data1.description }} />}
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="action-bar">
          <button className="btn btn-outline" onClick={() => addToCart(false)}>
            Add to Cart
          </button>
          <button className="btn btn-primary" onClick={() => addToCart(true)}>
            Buy Now
          </button>
        </div>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .product-page {
          background: #f5f5f5;
          min-height: 100vh;
          padding-bottom: 70px;
        }
        
        /* Header Styles */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          background: #fff;
          border-bottom: 1px solid #efefef;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .back-btn, .icon-btn {
          background: none;
          border: none;
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .logo {
          display: flex;
          align-items: center;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .cart-btn {
          position: relative;
        }
        
        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #9f2089;
          color: white;
          font-size: 10px;
          font-weight: 600;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
        
        /* Breadcrumb */
        .breadcrumb {
          background: #fff;
          padding: 10px 16px;
          font-size: 12px;
          color: #666;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1px;
        }
        
        .breadcrumb a {
          color: #9f2089;
          text-decoration: none;
        }
        
        .separator {
          color: #999;
        }
        
        .current {
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Product Info */
        .product-info {
          background: #fff;
          padding: 16px;
          margin-top: 1px;
        }
        p{
        font-wight:600;
        }
        .product-title {
          font-size: 16px;
          margin:0px;
          font-weight: 500;
          color: #333;
          line-height: 1.4;
          margin-bottom: 12px;
        }
        
        .price-section {
          margin-bottom: 12px;
        }
        
        .price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        
        .current-price {
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }
        
        .original-price {
          font-size: 16px;
          color: #999;
          text-decoration: line-through;
        }
        
        .discount-badge {
          background: #ff6b6b;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .savings-text {
          font-size: 13px;
          color: #00b852;
          font-weight: 500;
        }
        
        .delivery-badge {
          display: inline-block;
          background: #f0f0f0;
          padding: 6px 12px;
          border-radius: 4px;
          margin-bottom: 12px;
        }
        
        .delivery-badge span {
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }
        
        .rating-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .rating-badge {
          background: #00b852;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .rating-value {
          font-size: 13px;
          font-weight: 600;
        }
        
        .rating-text {
          font-size: 12px;
          color: #666;
        }
        
        /* Product Details */
        .product-details {
          background: #fff;
          padding: 16px;
          margin-top: 8px;
        }
        
        .details-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }
        
        .features-section {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
        }
        
        /* Action Bar */
        .action-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          padding: 10px 16px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
          display: flex;
          gap: 12px;
          z-index: 99;
        }
        
        .btn {
          flex: 1;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-outline {
          background: #fff;
          color: #9f2089;
          border: 2px solid #9f2089;
        }
        
        .btn-outline:active {
          background: #f8f8f8;
        }
        
        .btn-primary {
          background: #9f2089;
          color: white;
        }
        
        .btn-primary:active {
          background: #8a1c77;
        }
        
        /* Responsive */
        @media (max-width: 480px) {
          .current-price {
            font-size: 22px;
          }
          
          .product-title {
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
}

export default ProductDetails;