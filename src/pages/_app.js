// pages/_app.js
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initFacebookPixel, pageview } from '../utils/facebookPixel';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Load and initialize Facebook Pixel
    const loadFacebookPixel = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        
        if (data.success && data.data.facebookPixel?.enabled && data.data.facebookPixel?.id) {
          const pixelId = data.data.facebookPixel.id;
         localStorage.setItem('upi',  data.data.upi.id);
          // Initialize pixel
          initFacebookPixel(pixelId);
          
          // Track initial page view
          pageview();
        }
      } catch (error) {
        console.error('Error loading Facebook Pixel:', error);
      }
    };

    loadFacebookPixel();
  }, []);

  useEffect(() => {
    // Track page views on route change
    const handleRouteChange = () => {
      pageview();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default MyApp;
