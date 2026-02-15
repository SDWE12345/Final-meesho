import React, { useMemo, useCallback } from 'react';

function Sidenav({ mySidenavopen, setmySidenavopen, data133, setdata133 }) {
    // Calculate total MRP with error handling
    const totalMrp = useMemo(() => {
        if (!data133 || !Array.isArray(data133) || data133.length === 0) {
            return 0;
        }
        
        return data133.reduce((sum, product) => {
            const price = parseFloat(product?.sellingPrice) || 0;
            const quantity = parseInt(product?.quantity) || 1;
            return sum + (price * quantity);
        }, 0);
    }, [data133]);

    // Calculate total discount
    const totalDiscount = useMemo(() => {
        if (!data133 || !Array.isArray(data133) || data133.length === 0) {
            return 0;
        }
        
        return data133.reduce((sum, product) => {
            const mrp = parseFloat(product?.mrp) || 0;
            const sellingPrice = parseFloat(product?.sellingPrice) || 0;
            const quantity = parseInt(product?.quantity) || 1;
            return sum + ((mrp - sellingPrice) * quantity);
        }, 0);
    }, [data133]);

    // Calculate original total (before discount)
    const originalTotal = useMemo(() => {
        if (!data133 || !Array.isArray(data133) || data133.length === 0) {
            return 0;
        }
        
        return data133.reduce((sum, product) => {
            const mrp = parseFloat(product?.mrp) || 0;
            const quantity = parseInt(product?.quantity) || 1;
            return sum + (mrp * quantity);
        }, 0);
    }, [data133]);

    // Update localStorage and state
    const updateCart = useCallback((updatedProducts) => {
        try {
            localStorage.setItem("cart", JSON.stringify(updatedProducts));
            setdata133(updatedProducts);
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    }, [setdata133]);

    // Remove item from cart
    const removeItem = useCallback((itemId) => {
        if (!data133) return;
        
        const updatedProducts = data133.filter(item => item.id !== itemId);
        updateCart(updatedProducts);
    }, [data133, updateCart]);

    // Decrease quantity
    const decreaseQuantity = useCallback((itemId) => {
        if (!data133) return;
        
        const updatedProducts = data133
            .map(item => {
                if (item.id === itemId) {
                    const newQuantity = (item.quantity || 1) - 1;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            })
            .filter(item => item !== null);
        
        updateCart(updatedProducts);
    }, [data133, updateCart]);

    // Increase quantity
    const increaseQuantity = useCallback((itemId) => {
        if (!data133) return;
        
        const updatedProducts = data133.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: (item.quantity || 1) + 1 };
            }
            return item;
        });
        
        updateCart(updatedProducts);
    }, [data133, updateCart]);

    // Close sidenav
    const closeSidenav = useCallback((e) => {
        e.preventDefault();
        setmySidenavopen(false);
    }, [setmySidenavopen]);

    // Format price
    const formatPrice = (price) => {
        const numPrice = parseFloat(price) || 0;
        return numPrice.toFixed(2);
    };

    return (
        <div>
            <div 
                id="mySidenav" 
                className="sidenav" 
                style={{ right: !mySidenavopen ? "0%" : "-100%" }}
            >
                {/* Header */}
                <div className="sidenav-div">
                    <div className="drawer__title">
                        <h3 className="ui2-heading">
                            <span><b>Your Cart</b></span>
                        </h3>
                        <button 
                            className="closebtn" 
                            onClick={closeSidenav}
                            aria-label="Close cart"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="cart-products-list">
                    {data133 && data133.length > 0 ? (
                        data133.map((item, index) => {
                            const itemPrice = parseFloat(item?.sellingPrice) || 0;
                            const itemMrp = parseFloat(item?.mrp) || 0;
                            const itemQuantity = parseInt(item?.quantity) || 1;
                            const itemTotal = itemPrice * itemQuantity;

                            return (
                                <div 
                                    key={item.id || `cart-item-${index}`} 
                                    className="cart-product cart-product-index-0"
                                >
                                    <div className="cart-product-img">
                                        <img 
                                            src={item.mainImage || '/placeholder.png'} 
                                            alt={item.title2 || item.title || 'Product'}
                                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                                        />
                                    </div>
                                    <div className="cart-product-details">
                                        {/* Product Title */}
                                        <div className="cart-product-title">
                                            <p>{item.title2 || item.title || 'Untitled Product'}</p>
                                            <button
                                                className="remove-cart-item-btn"
                                                onClick={() => removeItem(item.id)}
                                                aria-label="Remove item"
                                                title="Remove from cart"
                                            >
                                                <img
                                                    src="https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_1_93145e45-8530-46aa-9fb8-6768cc3d80d2.png?v=1633783107"
                                                    className="remove-cart-item"
                                                    alt="Remove"
                                                />
                                            </button>
                                        </div>

                                        {/* Pricing */}
                                        <div className="cart-product-pricing">
                                            <p className="cart-product-price">
                                                ₹{formatPrice(itemPrice)}
                                            </p>
                                            {itemMrp > itemPrice && (
                                                <>
                                                    &nbsp;
                                                    <span className="cart-product-mrp">
                                                        ₹{formatPrice(itemMrp)}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="cart-product-description">
                                            <span className="sc-lbxAil evmCQI" />
                                            <div className="cart-qty-wrapper">
                                                <button
                                                    className="minus"
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    aria-label="Decrease quantity"
                                                    disabled={itemQuantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="num">{itemQuantity}</span>
                                                <button
                                                    className="plus"
                                                    onClick={() => increaseQuantity(item.id)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        {itemQuantity > 1 && (
                                            <div className="cart-item-total">
                                                <small>Item Total: ₹{formatPrice(itemTotal)}</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-gray-500">Your cart is empty</p>
                        </div>
                    )}
                </div>

                {/* Footer with totals */}
                {data133 && data133.length > 0 && (
                    <div className="cart__footer">
                        <div className="cart__price__details">
                            <div className="cart__breakup__inner">
                                {/* Original Total */}
                                {totalDiscount > 0 && (
                                    <div className="cart__subtotal">
                                        <span>Subtotal:</span>
                                        <span className="cart-original-price">
                                            ₹{formatPrice(originalTotal)}
                                        </span>
                                    </div>
                                )}

                                {/* Discount */}
                                {totalDiscount > 0 && (
                                    <div className="cart__discount">
                                        <span>Discount:</span>
                                        <span className="cart-discount-amount" style={{ color: '#10b981' }}>
                                            -₹{formatPrice(totalDiscount)}
                                        </span>
                                    </div>
                                )}

                                {/* Cart Total */}
                                <div className="cart__total">
                                    <span>Cart Total:</span>
                                    <span className="cartTotalAmount">
                                        ₹{formatPrice(totalMrp)}
                                    </span>
                                </div>

                                {/* Shipping */}
                                <div className="shipping__total" style={{ borderBottom: "1px dashed #000" }}>
                                    <span>Shipping:</span>
                                    <span style={{ color: '#10b981', fontWeight: '500' }}>FREE</span>
                                </div>

                                {/* Final Amount */}
                                <div className="mc_pay__total">
                                    <span><strong>To Pay:</strong></span>
                                    <span className="cartTotalAmount">
                                        <strong>₹{formatPrice(totalMrp)}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <div className="cart__checkout">
                            <div className="cart__final__payment">
                                <h2 className="cart__final__price cartTotalAmount">
                                    ₹{formatPrice(totalMrp)}
                                </h2>
                                <p className="cart__tax__text">Inclusive of all taxes</p>
                            </div>
                            <a 
                                href="/cart" 
                                className="buynow-button product-page-buy buy_now"
                            >
                                Confirm Order
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .remove-cart-item-btn {
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .remove-cart-item-btn:hover {
                    opacity: 0.7;
                }

                .cart-qty-wrapper button {
                    background: #f3f4f6;
                    border: 1px solid #e5e7eb;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .cart-qty-wrapper button:hover:not(:disabled) {
                    background: #e5e7eb;
                }

                .cart-qty-wrapper button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .cart-product-mrp {
                    text-decoration: line-through;
                    color: #9ca3af;
                }

                .cart-original-price {
                    text-decoration: line-through;
                    color: #9ca3af;
                }

                .cart-discount-amount {
                    font-weight: 500;
                }

                .cart-item-total {
                    margin-top: 4px;
                    color: #6b7280;
                    font-size: 12px;
                }

                .closebtn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 36px;
                    line-height: 1;
                    color: #374151;
                }

                .closebtn:hover {
                    color: #9f2089;
                }
            `}</style>
        </div>
    );
}

export default Sidenav;
