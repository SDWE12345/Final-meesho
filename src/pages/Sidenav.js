import React from 'react'

function Sidenav({ mySidenavopen, setmySidenavopen, data133, setdata133 }) {
    const totalMrp = 0
    //  data133 === undefined ? 0 : data133?.reduce(
    //     (sum, product) => sum + parseInt((product?.price || 0) * (product?.quantity || 1)),
    //     0
    // ) || 0;

    return (
        <div><div id="mySidenav" className="sidenav" style={{ right: !mySidenavopen ? "0%" : "-100%" }}>
            <div className="sidenav-div">
                <div className="drawer__title">
                    <h3 className="ui2-heading">
                        <span><b>Your Cart</b></span>
                    </h3>
                    <a className="closebtn" onClick={(e) => { e.preventDefault(); setmySidenavopen(!mySidenavopen); }}>×</a>
                </div>
            </div>

            <div className="cart-products-list">
                {data133 && data133.length > 0 ? data133.map((el, index) => (
                    <div key={el.id || index} className="cart-product cart-product-index-0">
                        <div className="cart-product-img">
                            <img src={el.image} alt={el.title2 || el.title} />
                        </div>
                        <div className="cart-product-details">
                            <div className="cart-product-title">
                                <p>{el.title2 || el.title}</p>
                                <img
                                    src="https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_1_93145e45-8530-46aa-9fb8-6768cc3d80d2.png?v=1633783107"
                                    className="remove-cart-item"
                                    data-index={index}
                                    alt="Remove"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const updatedProducts = data133.filter(ela => ela.id !== el.id);
                                        localStorage.setItem("cart", JSON.stringify(updatedProducts));
                                        setdata133(updatedProducts);
                                        window.dispatchEvent(new Event('storage'));
                                    }}
                                />
                            </div>
                            <div className="cart-product-pricing">
                                <p className="cart-product-price">₹{el.price || 0}</p>&nbsp;
                                <span className="cart-product-mrp">₹{el.cancelprice || el.mrp || 0}</span>
                            </div>
                            <div className="cart-product-description">
                                <span className="sc-lbxAil evmCQI" />
                                <div className="cart-qty-wrapper">
                                    <span className="minus" data-index={index} onClick={(e) => {
                                        e.preventDefault();
                                        const updatedProducts = data133.map(ela => {
                                            if (ela.id === el.id && ela.quantity > 1) {
                                                return { ...ela, quantity: ela.quantity - 1 };
                                            }
                                            return ela;
                                        }).filter(item => item.quantity > 0);
                                        localStorage.setItem("cart", JSON.stringify(updatedProducts));
                                        setdata133(updatedProducts);
                                        window.dispatchEvent(new Event('storage'));
                                    }}>-</span>
                                    <span className="num">{el.quantity || 1}</span>
                                    <span className="plus" data-index={index} onClick={(e) => {
                                        e.preventDefault();
                                        const updatedProducts = data133.map(ela => {
                                            if (ela.id === el.id) {
                                                return { ...ela, quantity: (ela.quantity || 1) + 1 };
                                            }
                                            return ela;
                                        });
                                        localStorage.setItem("cart", JSON.stringify(updatedProducts));
                                        setdata133(updatedProducts);
                                        window.dispatchEvent(new Event('storage'));
                                    }}>+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-5">
                        <p className="text-gray-500">Your cart is empty</p>
                    </div>
                )}
            </div>

            {data133 && data133.length > 0 && (
                <div className="cart__footer">
                    <div className="cart__price__details">
                        <div className="cart__breakup__inner">
                            <div className="cart__total">
                                <span>Cart Total:</span>
                                <span className="cartTotalAmount">₹{totalMrp}.00</span>
                            </div>
                            <div className="shipping__total" style={{ borderBottom: "1px dashed #000" }}>
                                <span>Shipping:</span>
                                <span>FREE</span>
                            </div>
                            <div className="mc_pay__total">
                                <span>To Pay:</span>
                                <span className="cartTotalAmount">₹{totalMrp}.00</span>
                            </div>
                        </div>
                    </div>
                    <div className="cart__checkout">
                        <div className="cart__final__payment">
                            <h2 className="cart__final__price cartTotalAmount">₹{totalMrp}.00</h2>
                            <p className="cart__tax__text">Inclusive of all taxes</p>
                        </div>
                        <a href="/cart" className="buynow-button product-page-buy buy_now">
                            Confirm Order
                        </a>
                    </div>
                </div>
            )}
        </div></div>
    )
}

export default Sidenav