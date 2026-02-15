"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Payments = () => {
    const router = useRouter();

    // products holds the full settings object: { id: "<UPI_ID>", Gpay: bool, Phonepe: bool, ... }
    const [products, setProducts] = useState({ id: "33", Gpay: true });

    // Cart items loaded from localStorage on mount
    const [data133, setdata133] = useState([]);

    const initialTime = 900;
    const [time, setTime] = useState(initialTime);

    // FIX 1: Timer starts once on mount, uses functional updater — no [time] dependency
    useEffect(() => {
        if (time <= 0) return;
        const timer = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // FIX 2: Load cart from localStorage on mount (not in cleanup)
    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) setdata133(JSON.parse(stored));
    }, []);

    // FIX 3: totalMrp derived from actual cart data instead of hardcoded 0
    const totalMrp = data133.reduce(
        (sum, product) => sum + parseInt(product.price * product.quantity),
        0
    );

    const [activeTab, setActiveTab] = useState(3);
    const handleTabClick = (tabNumber) => setActiveTab(tabNumber);

    const [payment, setPayment] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/settings", {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // FIX 4: products is set to data.data.id (the settings object with .id UPI string)
                setProducts(data.data.upi);

                console.log("data.data.upi", data.data.upi);

                // FIX 5: derive default tab from fetched data, not stale state
                setActiveTab(
                    data.data.upi.Gpay === false
                        ? data.data.upi.Phonepe === false
                            ? 4
                            : 3
                        : 2
                );
            } else {
                console.error("Error fetching settings:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    // FIX 6: products.id is the UPI ID string after fetch; depends on products.id correctly
    useEffect(() => {
        if (!products?.id) return;
        const upiId = products.id;
        const amount = Number(totalMrp);

        switch (activeTab) {
            case 4:
                let payload = {
                    contact: {
                        cbsName: "ok",
                        nickName: "demo",
                        vpa: upiId,
                        type: "VPA"
                    },
                    p2pPaymentCheckoutParams: {
                        note: txn_id,
                        isByDefaultKnownContact: true,
                        enableSpeechToText: false,
                        allowAmountEdit: false,
                        showQrCodeOption: false,
                        disableViewHistory: true,
                        shouldShowUnsavedContactBanner: false,
                        isRecurring: false,
                        checkoutType: "DEFAULT",
                        transactionContext: "p2p",
                        initialAmount: amount * 100,
                        // paise
                        disableNotesEdit: true,
                        showKeyboard: true,
                        currency: "INR",
                        shouldShowMaskedNumber: true
                    }
                };

                let jsonString = JSON.stringify(payload);
                let base64Data = btoa(jsonString);
                //redirect_url = createPhonePeIntent(upiId, amt, site_name);
                redirect_url = "phonepe://native?data=" + base64Data + "&id=p2ppayment";


                setPayment(
                    `${redirect_url}`
                );
                break;
            case 1:
                setPayment(
                    `bhim://pay?pa=${upiId}&pn=Online%20Shopping&am=${amount}&tr=H2MkMGf5olejI&mc=8931&cu=INR&tn=Online%20Shopping`
                );
                break;
            case 2:
                setPayment(
                    `tez://upi/pay?pa=${upiId}&pn=Online%20Shopping&am=${amount}&tr=H2MkMGf5olejI&mc=8931&cu=INR&tn=Online%20Shopping`
                );
                break;
            case 3:
                setPayment(
                    `phonepe://pay?pa=${upiId}&pn=KHODIYAR%20ENTERPRISE&mc=&tn=Verified%20Merchant&am=${amount}&cu=INR&url=&mode=02&orgid=159012&mid=&msid=&mtid=&sign=MEQCIB4NcyZl2FEuktegagtryRG1iA1XG9r3tMHCIGZmR0wQAiBPvbuBFfhZjmq3MKMKH/XouOPk2+STl/VwYQTg2Y7vWg==`
                );
                break;
            case 5:
                setPayment(
                    `whatsapp://pay?pa=${upiId}&pn=Online%20Shopping&am=${amount}&tr=H2MkMGf5olejI&mc=8931&cu=INR&tn=Online%20Shopping`
                );
                break;
            default:
                break;
        }
    }, [activeTab, products?.id, totalMrp]);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
        products.id && (
            <>
                <title>Sale Sale Sale - Home</title>
                <meta httpEquiv="Pragma" content="no-cache" />
                <meta httpEquiv="Expires" content={-1} />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="Keywords" content="Maha Sale" />
                <meta name="Description" content="Maha Sale" />
                <meta property="og:title" content="Maha Sale" />
                <meta name="theme-color" content="#9f2089" id="themeColor" />
                <meta name="viewport" content="width=device-width,minimum-scale=1,user-scalable=no" />
                <link rel="shortcut icon" href="https://www.meesho.com/favicon.ico" />
                <link rel="stylesheet" href="/assets/website/css/bootstrap.min.css" />
                <link rel="stylesheet" href="/assets/website/css/custom.css" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                    integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
                <style dangerouslySetInnerHTML={{ __html: "\n        body,\n        a,\n        p,\n        span,\n        div,\n        input,\n        button,\n        h1,\n        h2,\n        h3,\n        h4,\n        h5,\n        h6,\n        button,\n        input,\n        optgroup,\n        select,\n        textarea {\n            font-family: 'Poppins', sans-serif !important;\n        }\n    " }} />
                <noscript>
                    &lt;img height="1" width="1" style="display:none"
                    src="https://www.facebook.com/tr?id=239159289163632&amp;ev=PageView&amp;noscript=1" /&gt;
                </noscript>
                <link rel="stylesheet" href="chrome-extension://mhnlakgilnojmhinhkckjpncpbhabphi/content.css" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" />
                <style id="_goober" dangerouslySetInnerHTML={{ __html: " .go1475592160{height:0;}.go1671063245{height:auto;}.go1888806478{display:flex;flex-wrap:wrap;flex-grow:1;}@media (min-width:600px){.go1888806478{flex-grow:initial;min-width:288px;}}.go167266335{background-color:#313131;font-size:0.875rem;line-height:1.43;letter-spacing:0.01071em;color:#fff;align-items:center;padding:6px 16px;border-radius:4px;box-shadow:0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12);}.go3162094071{padding-left:20px;}.go3844575157{background-color:#313131;}.go1725278324{background-color:#43a047;}.go3651055292{background-color:#d32f2f;}.go4215275574{background-color:#ff9800;}.go1930647212{background-color:#2196f3;}.go946087465{display:flex;align-items:center;padding:8px 0;}.go703367398{display:flex;align-items:center;margin-left:auto;padding-left:16px;margin-right:-8px;}.go3963613292{width:100%;position:relative;transform:translateX(0);top:0;right:0;bottom:0;left:0;min-width:288px;}.go1141946668{box-sizing:border-box;display:flex;max-height:100%;position:fixed;z-index:1400;height:auto;width:auto;transition:top 300ms ease 0ms,right 300ms ease 0ms,bottom 300ms ease 0ms,left 300ms ease 0ms,max-width 300ms ease 0ms;pointer-events:none;max-width:calc(100% - 40px);}.go1141946668 .notistack-CollapseWrapper{padding:6px 0px;transition:padding 300ms ease 0ms;}@media (max-width:599.95px){.go1141946668{width:100%;max-width:calc(100% - 32px);}}.go3868796639 .notistack-CollapseWrapper{padding:2px 0px;}.go3118922589{top:14px;flex-direction:column;}.go1453831412{bottom:14px;flex-direction:column-reverse;}.go4027089540{left:20px;}@media (min-width:600px){.go4027089540{align-items:flex-start;}}@media (max-width:599.95px){.go4027089540{left:16px;}}.go2989568495{right:20px;}@media (min-width:600px){.go2989568495{align-items:flex-end;}}@media (max-width:599.95px){.go2989568495{right:16px;}}.go4034260886{left:50%;transform:translateX(-50%);}@media (min-width:600px){.go4034260886{align-items:center;}}" }} />

                <div id="container" style={{ overflow: "hidden" }}>
                    <div style={{ height: "100%" }} data-reactroot="">
                        <div>
                            {/* FIX 7: Removed duplicate nested _2dxSCm wrapper */}
                            <div className="_2dxSCm">
                                <div className="_3CzzrP" style={{}}>
                                    <div className="_38U37R">
                                        <div>
                                            <div className="_1FWdmb" style={{}}>
                                                <div className="d-flex align-items-center">
                                                    {/* FIX 8: Back button uses router.back() */}
                                                    <a
                                                        className="_3NH1qf"
                                                        id="back-btn"
                                                        style={{ marginTop: 5, cursor: "pointer" }}
                                                        onClick={() => router.back()}
                                                    >
                                                        <svg width={25} height={25} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-gswNZR ffVWIj">
                                                            <path d="M13.7461 2.31408C13.5687 2.113 13.3277 2 13.0765 2C12.8252 2 12.5843 2.113 12.4068 2.31408L6.27783 9.24294C5.90739 9.66174 5.90739 10.3382 6.27783 10.757L12.4068 17.6859C12.7773 18.1047 13.3757 18.1047 13.7461 17.6859C14.1166 17.2671 14.0511 16.5166 13.7461 16.1718L8.29154 9.99462L13.7461 3.82817C13.9684 3.57691 14.1071 2.72213 13.7461 2.31408Z" fill="#666666" />
                                                        </svg>
                                                    </a>
                                                    <a className="_3NH1qf d-none" id="showmenu">
                                                        <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-gswNZR jQgwzc">
                                                            <path d="M2 17.2222C2 17.8359 2.49746 18.3333 3.11111 18.3333H20.8889C21.5025 18.3333 22 17.8359 22 17.2222C22 16.6086 21.5025 16.1111 20.8889 16.1111H3.11111C2.49746 16.1111 2 16.6086 2 17.2222ZM2 11.6667C2 12.2803 2.49746 12.7778 3.11111 12.7778H20.8889C21.5025 12.7778 22 12.2803 22 11.6667C22 11.053 21.5025 10.5556 20.8889 10.5556H3.11111C2.49746 10.5556 2 11.053 2 11.6667ZM3.11111 5C2.49746 5 2 5.49746 2 6.11111C2 6.72476 2.49746 7.22222 3.11111 7.22222H20.8889C21.5025 7.22222 22 6.72476 22 6.11111C22 5.49746 21.5025 5 20.8889 5H3.11111Z" fill="#333333" />
                                                        </svg>
                                                    </a>
                                                    <h4 className="header-title">Payment</h4>
                                                </div>
                                                <div className="header-menu">
                                                    <a className="_3NH1qf" href="#">
                                                        <svg width={24} height={25} fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-gswNZR dJzkYm">
                                                            <path fill="#fff" d="M0 .657h24v24H0z" />
                                                            <path fill="#fff" d="M2 2.657h20v20H2z" />
                                                            <path d="M22 9.174c0 3.724-1.87 7.227-9.67 12.38a.58.58 0 0 1-.66 0C3.87 16.401 2 12.898 2 9.174S4.59 3.67 7.26 3.66c3.22-.081 4.61 3.573 4.74 3.774.13-.201 1.52-3.855 4.74-3.774C19.41 3.669 22 5.45 22 9.174Z" fill="#ED3843" />
                                                        </svg>
                                                    </a>
                                                    <a className="_3NH1qf" href="#">
                                                        <svg width={24} height={25} fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-gswNZR dJzkYm">
                                                            <g clipPath="url(#cart-header_svg__a)">
                                                                <path fill="#fff" d="M2.001 1.368h20v20h-20z" />
                                                                <g clipPath="url(#cart-header_svg__b)">
                                                                    <g clipPath="url(#cart-header_svg__c)">
                                                                        <path d="M6.003 5.183h15.139c.508 0 .908.49.85 1.046l-.762 7.334c-.069.62-.537 1.1-1.103 1.121l-12.074.492-2.05-9.993Z" fill="#C53EAD" />
                                                                        <path d="M11.8 21.367c.675 0 1.22-.597 1.22-1.334 0-.737-.545-1.335-1.22-1.335-.673 0-1.22.598-1.22 1.335s.547 1.334 1.22 1.334ZM16.788 21.367c.674 0 1.22-.597 1.22-1.334 0-.737-.546-1.335-1.22-1.335-.673 0-1.22.598-1.22 1.335s.547 1.334 1.22 1.334Z" fill="#9F2089" />
                                                                        <path d="m2.733 4.169 3.026 1.42 2.528 12.085c.127.609.615 1.036 1.181 1.036h9.615" stroke="#9F2089" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <defs>
                                                                <clipPath id="cart-header_svg__a"><path fill="#fff" transform="translate(2.001 1.368)" d="M0 0h20v20H0z" /></clipPath>
                                                                <clipPath id="cart-header_svg__b"><path fill="#fff" transform="translate(2.001 1.368)" d="M0 0h20v20H0z" /></clipPath>
                                                                <clipPath id="cart-header_svg__c"><path fill="#fff" transform="translate(2.001 3.368)" d="M0 0h20v18H0z" /></clipPath>
                                                            </defs>
                                                        </svg>
                                                        <span className="header__cart-count header__cart-count--floating bubble-count">2</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="search-bar d-none">
                                                <div className="_3QNhdh" id="guidSearch">
                                                    <div className="ORogdv">
                                                        <div className="_1k9EoO">
                                                            <div className="_2d36Hu">
                                                                <a href="javascript:void(0)" className="search-div">
                                                                    <div placeholder="Search for Sarees, Kurtis, Cosmetics, etc." className="sc-eeMvmM fscVpr">
                                                                        <div className="sc-cUEOzv ilUiic">
                                                                            <svg width={20} height={21} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <rect width={20} height={20} transform="translate(0 0.560547)" fill="white" />
                                                                                <g clipPath="url(#clip0_2444_6193)">
                                                                                    <path d="M13.4564 12.0018L11.4426 14.0156L16.3498 18.9228C16.7013 19.2743 17.2711 19.2743 17.6226 18.9228L18.3636 18.1818C18.7151 17.8303 18.7151 17.2604 18.3636 16.909L13.4564 12.0018Z" fill="#ADADC4" />
                                                                                    <path d="M14.7135 8.69842C14.7135 12.3299 11.7696 15.2738 8.13812 15.2738C4.50664 15.2738 1.56274 12.3299 1.56274 8.69842C1.56274 5.06694 4.50664 2.12305 8.13812 2.12305C11.7696 2.12305 14.7135 5.06694 14.7135 8.69842Z" fill="#EAEAF2" stroke="#ADADC4" strokeWidth="1.125" />
                                                                                </g>
                                                                                <defs>
                                                                                    <clipPath id="clip0_2444_6193"><rect width={18} height={18} fill="white" transform="translate(1 1.56055)" /></clipPath>
                                                                                </defs>
                                                                            </svg>
                                                                        </div>
                                                                        <input fontSize="13px" fontWeight="book" type="text" placeholder="Search for Sarees, Kurtis, Cosmetics, etc." readOnly="" className="sc-dkrFOg bWTBPR sc-bCfvAP dsLogY search-input-elm" color="greyBase" defaultValue="" />
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sc-bBXxYQ jMfCEJ" />
                                    <style dangerouslySetInnerHTML={{ __html: '\n        .cart_page_footer {\n            box-shadow: none;\n            position: fixed;\n            bottom: 80px\n        }\n\n        .header-menu {\n            display: none;\n        }\n\n        .cart-list {\n            max-height: max-content;\n        }\n\n        ._1fhgRH {\n            margin-bottom: 250px;\n        }\n\n        .gNFCeh {\n            display: flex;\n            justify-content: space-between;\n            padding: 16px 16px 18px;\n            background-color: #FFFFFF;\n        }\n\n        .fill-grey-t2 {\n            fill: rgb(139, 139, 163);\n        }\n\n        .hEBjyt {\n            color: rgb(53, 53, 67);\n            font-style: normal;\n            font-weight: 700;\n            font-size: 17px;\n            line-height: 20px;\n            margin: 0px;\n            padding: 0px;\n        }\n\n        .cHsEym {\n            padding: 0px 16px 18px;\n            background-color: #FFFFFF;\n        }\n\n        .efQsfx {\n            display: flex;\n            align-items: center;\n            justify-content: start;\n            flex-direction: row;\n            border-radius: 4px;\n            background-color: rgb(231, 238, 255);\n            padding: 6px 12px;\n            gap: 10px;\n        }\n\n        .eVDQPI {\n            display: flex;\n            align-items: center;\n            padding-left: 10px;\n            height: 60px;\n            width: 60px;\n        }\n\n        .cOCnuI {\n            display: flex;\n            align-items: flex-start;\n            justify-content: center;\n            flex-direction: column;\n            max-height: 50px;\n            border-radius: 4px;\n            background-color: rgb(231, 238, 255);\n        }\n\n        .eNkLGR {\n            color: rgb(159, 32, 137);\n            font-style: normal;\n            font-weight: 600;\n            font-size: 15px;\n            line-height: 20px;\n            margin: 0px;\n            padding: 0px;\n        }\n\n        .RrifI {\n            color: rgb(85, 133, 248);\n        }\n\n        .GmPbS {\n            padding: 6px 16px;\n            display: flex;\n            align-items: center;\n            gap: 10px;\n            background-color: #FFFFFF;\n        }\n\n        .GmPbS span {\n            font-weight: 600;\n            font-size: 10px;\n        }\n\n        .GmPbS div {\n            height: 1px;\n            background-color: rgb(206, 206, 222);\n            flex-grow: 1;\n        }\n\n        .cart__footer {\n            position: unset;\n            box-shadow: unset;\n            border-top: 5px solid #eaeaf2;\n            border-bottom: 5px solid #eaeaf2;\n        }\n\n        .error-message {\n            font-size: 14px;\n            color: red;\n            text-align: center;\n            margin-top: 10px;\n        }\n\n        .eGwEyP {\n            padding: 12px 16px;\n            display: flex;\n            justify-content: space-between;\n        }\n\n        .dUijPM {\n            display: flex;\n            flex-direction: column;\n            justify-content: space-between;\n            max-width: 50%;\n            padding-right: 8px;\n        }\n\n        .dUijPM span {\n            color: rgb(53, 53, 67);\n            font-weight: 700;\n            font-size: 17px;\n            line-height: 20px;\n        }\n\n        .ylmAj {\n            color: rgb(159, 32, 137);\n            cursor: pointer;\n            font-style: normal;\n            text-align: center;\n            letter-spacing: 0.0015em;\n            font-size: 13px;\n            font-weight: 700;\n            line-height: 16px;\n            border-radius: 4px;\n            background: inherit;\n            border: none;\n            padding: 0px;\n            white-space: nowrap;\n            overflow: hidden;\n            text-overflow: ellipsis;\n        }\n\n        .iAFVK {\n            width: 50%;\n        }\n\n        .iAFVK button {\n            width: 100%;\n            font-weight: 600;\n        }\n\n        .bwHzRF {\n            cursor: pointer;\n            font-style: normal;\n            text-align: center;\n            letter-spacing: 0.0015em;\n            font-size: 15px;\n            line-height: 20px;\n            border-radius: 4px;\n            color: rgb(255, 255, 255);\n            background: rgb(159, 32, 137);\n            border: none;\n            padding: 12px;\n            font-weight: 500;\n            width: 100%;\n            white-space: nowrap;\n            overflow: hidden;\n            text-overflow: ellipsis;\n        }\n\n        .ixHOyU {\n            position: fixed;\n            width: 100%;\n            max-width: 800px;\n            background-color: rgb(255, 255, 255);\n            bottom: 0px;\n            z-index: 1;\n        }\n\n        .IhlWp {\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            width: 20px;\n            height: 20px;\n            border-radius: 50%;\n            border: 2px solid rgb(85, 133, 248);\n            color: rgb(85, 133, 248);\n            font-size: 11px;\n            font-weight: 700;\n            background-color: rgb(85, 133, 248);\n        }\n    ' }} />
                                    <div id="container">
                                        <div style={{}} data-reactroot="">
                                            <div className="_1fhgRH">
                                                {/* Step indicator */}
                                                <div data-testid="stepper-container" className="sc-geuGuN gqSLnX">
                                                    <div className="sc-kGhOqx chtKwW">
                                                        <ul className="sc-bAKPPm eOmvaT">
                                                            {/* Cart - done */}
                                                            <div className="sc-jZiqTT hGoFZP">
                                                                <div className="sc-bxSTMQ geeMAN">
                                                                    <div data-testid="left-line" className="sc-PJClH lagJzQ" />
                                                                    <div className="sc-iJkHyd IhlWp">
                                                                        <svg width={20} height={20} viewBox="0.5 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <title>check-icon</title>
                                                                            <rect x="1.25" y="0.75" width="18.5" height="18.5" rx="9.25" fill="#5585F8" />
                                                                            <path fillRule="evenodd" clipRule="evenodd" d="M16.6716 7.37285C17.0971 6.96439 17.1108 6.28832 16.7023 5.86289C16.2939 5.43755 15.618 5.4238 15.1926 5.83218L10.9997 9.85723L10.9997 9.85727L9.02229 11.7557L6.82333 9.55674C6.40622 9.13963 5.72995 9.13963 5.31284 9.55674C4.8957 9.97388 4.89573 10.6502 5.31289 11.0673L8.26525 14.0192C8.66883 14.4227 9.32103 14.4293 9.73274 14.0341L10.9998 12.8178V12.8178L16.6716 7.37285Z" fill="white" />
                                                                            <rect x="1.25" y="0.75" width="18.5" height="18.5" rx="9.25" stroke="#5585F8" strokeWidth="1.5" />
                                                                        </svg>
                                                                    </div>
                                                                    <div data-testid="right-line" className="sc-jfdOKL bSausD" />
                                                                </div>
                                                                <div className="sc-jWquRx ezBHwi">Cart</div>
                                                            </div>
                                                            {/* Address - done */}
                                                            <div className="sc-jZiqTT hGoFZP">
                                                                <div className="sc-bxSTMQ geeMAN">
                                                                    <div data-testid="left-line" className="sc-PJClH kHHhBS" />
                                                                    <div className="sc-iJkHyd IhlWp">
                                                                        <svg width={20} height={20} viewBox="0.5 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <title>check-icon</title>
                                                                            <rect x="1.25" y="0.75" width="18.5" height="18.5" rx="9.25" fill="#5585F8" />
                                                                            <path fillRule="evenodd" clipRule="evenodd" d="M16.6716 7.37285C17.0971 6.96439 17.1108 6.28832 16.7023 5.86289C16.2939 5.43755 15.618 5.4238 15.1926 5.83218L10.9997 9.85723L10.9997 9.85727L9.02229 11.7557L6.82333 9.55674C6.40622 9.13963 5.72995 9.13963 5.31284 9.55674C4.8957 9.97388 4.89573 10.6502 5.31289 11.0673L8.26525 14.0192C8.66883 14.4227 9.32103 14.4293 9.73274 14.0341L10.9998 12.8178V12.8178L16.6716 7.37285Z" fill="white" />
                                                                            <rect x="1.25" y="0.75" width="18.5" height="18.5" rx="9.25" stroke="#5585F8" strokeWidth="1.5" />
                                                                        </svg>
                                                                    </div>
                                                                    <div data-testid="right-line" className="sc-jfdOKL bSausD" />
                                                                </div>
                                                                <div className="sc-jWquRx ezBHwi">Address</div>
                                                            </div>
                                                            {/* Payment - active */}
                                                            <div className="sc-jZiqTT hGoFZP">
                                                                <div className="sc-bxSTMQ geeMAN">
                                                                    <div data-testid="left-line" className="sc-PJClH kHHhBS" />
                                                                    <div className="sc-dGHKFW cRaGaC">3</div>
                                                                    <div data-testid="right-line" className="sc-jfdOKL bSausD" />
                                                                </div>
                                                                <div className="sc-jWquRx iefUco">Payment</div>
                                                            </div>
                                                            {/* Summary */}
                                                            <div className="sc-jZiqTT hGoFZP">
                                                                <div className="sc-bxSTMQ geeMAN">
                                                                    <div data-testid="left-line" className="sc-PJClH kHHhBS" />
                                                                    <div className="sc-dGHKFW iefbLi">4</div>
                                                                    <div data-testid="right-line" className="sc-jfdOKL jSyZxf" />
                                                                </div>
                                                                <div className="sc-jWquRx ezBHwi">Summary</div>
                                                            </div>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="sc-bBXxYQ jMfCEJ" />

                                                {/* Payment method header */}
                                                <div className="sc-dwVMhp gNFCeh">
                                                    <h6 fontSize="17px" fontWeight="bold" color="greyBase" className="sc-fnykZs hEBjyt">
                                                        Select Payment Method
                                                    </h6>
                                                    <svg width={80} height={24} viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M11.1172 3C10.3409 3 9.04382 3.29813 7.82319 3.63C6.57444 3.9675 5.31557 4.36687 4.57532 4.60875C4.26582 4.71096 3.99143 4.8984 3.78367 5.14954C3.57591 5.40068 3.44321 5.70533 3.40082 6.0285C2.73032 11.0651 4.28619 14.7979 6.17394 17.2672C6.97447 18.3236 7.92897 19.2538 9.00557 20.0269C9.43982 20.334 9.84257 20.5691 10.1845 20.73C10.4995 20.8785 10.8382 21 11.1172 21C11.3962 21 11.7337 20.8785 12.0498 20.73C12.4621 20.5296 12.8565 20.2944 13.2288 20.0269C14.3054 19.2538 15.2599 18.3236 16.0604 17.2672C17.9482 14.7979 19.504 11.0651 18.8335 6.0285C18.7912 5.70518 18.6586 5.40035 18.4508 5.14901C18.2431 4.89768 17.9686 4.71003 17.659 4.60762C16.5845 4.25529 15.5015 3.92894 14.4112 3.62888C13.1905 3.29925 11.8934 3 11.1172 3Z" fill="#ADC6FF" />
                                                    </svg>
                                                </div>

                                                {/* Offer banner */}
                                                <div className="sc-hKdnnL cHsEym">
                                                    <div className="sc-liHMlC efQsfx">
                                                        <img src="/ezgif-2-aefef6d1c8.gif" width={60} alt="offer" />
                                                        <div className="sc-cuqtlR cOCnuI">
                                                            <span className="sc-fnykZs eNkLGR sc-bTmccw RrifI">
                                                                Pay online &amp; get EXTRA ₹33 off
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* UPI options */}
                                                <div>
                                                    <div data-testid="PAY ONLINE" className="sc-gVAlfg GmPbS">
                                                        <span>PAY ONLINE</span>
                                                        <div />
                                                    </div>
                                                    <ul className="accordion">
                                                        <li className="accordion-item is-active">
                                                            <h3 className="accordion-thumb">
                                                                <div className="flex align-items-center">
                                                                    <img src="https://images.meesho.com/files/headless/upi_ppr.png" width="20px" alt="UPI" />
                                                                    <span className="order-summary px-2">UPI (GPay / PhonePe / Paytm)</span>
                                                                </div>
                                                            </h3>
                                                            <div className="accordion-panel p-0 pt-3" style={{ display: "block" }}>
                                                                <div className="plans">
                                                                    <div
                                                                        className={`form-check available-method ${activeTab === 2 ? "active" : ""}`}
                                                                        onClick={() => handleTabClick(2)}
                                                                    >
                                                                        <label className="form-check-label">
                                                                            <img src="https://cdn141.picsart.com/363807473021211.png" className="pay-logo" alt="GPay" />
                                                                            <span className="unaviablee">G Pay</span>
                                                                        </label>
                                                                    </div>
                                                                    <div
                                                                        className={`form-check available-method ${activeTab === 3 ? "active" : ""}`}
                                                                        onClick={() => handleTabClick(3)}
                                                                    >
                                                                        <label className="form-check-label">
                                                                            <img
                                                                                src="data:image/png;base64,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"
                                                                                className="pay-logo"
                                                                                alt="PhonePe"
                                                                            />
                                                                            <span className="unaviablee">PhonePe</span>
                                                                        </label>
                                                                    </div>
                                                                    <div
                                                                        className={`form-check available-method ${activeTab === 4 ? "active" : ""}`}
                                                                        onClick={() => handleTabClick(4)}
                                                                    >
                                                                        <label className="form-check-label">
                                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" className="pay-logo" alt="Paytm" />
                                                                            <span className="unaviablee">Paytm</span>
                                                                        </label>
                                                                    </div>
                                                                    <div
                                                                        className={`form-check available-method ${activeTab === 1 ? "active" : ""}`}
                                                                        onClick={() => handleTabClick(1)}
                                                                    >
                                                                        <label className="form-check-label">
                                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnMDjlc4aJzqc4vfL9BFw9hxrZk0nRyBAHwc95tUX_rlJMvwdHwHUU4FwuqQ&s" className="pay-logo" alt="BHIM UPI" />
                                                                            <span className="unaviablee">BHIM UPI</span>
                                                                        </label>
                                                                    </div>
                                                                    <div
                                                                        className={`form-check available-method ${activeTab === 5 ? "active" : ""}`}
                                                                        onClick={() => handleTabClick(5)}
                                                                    >
                                                                        <label className="form-check-label">
                                                                            <img src="https://static.xx.fbcdn.net/assets/?revision=1431132240730458&name=Illustrations-Get-Started&density=1" className="pay-logo" alt="WhatsApp Pay" />
                                                                            <span className="unaviablee">WhatsApp Pay</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>

                                                {/* Price summary */}
                                                <div className="cart__footer">
                                                    <div className="cart__price__details">
                                                        <div className="cart__breakup__inner">
                                                            <div className="shipping__total">
                                                                <span>Shipping:</span>
                                                                <span>FREE</span>
                                                            </div>
                                                            <div className="cart__total">
                                                                <span>Total Product Price:</span>
                                                                <span className="cartTotalAmount">₹{totalMrp}.00</span>
                                                            </div>
                                                            <div className="sc-bBXxYQ jMfCEJ mt-3 mb-1" />
                                                            <div className="mc_pay__total">
                                                                <span>Order Total:</span>
                                                                <span className="cartTotalAmount">₹{totalMrp}.00</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* FIX 9: Bottom CTA — <a> wraps button correctly as a link, no onclick string */}
                                                <div className="sc-lgVVsH ixHOyU">
                                                    <div className="sc-hQRsPl eGwEyP">
                                                        <div className="sc-fThYeS dUijPM">
                                                            <span className="cartTotalAmount">₹{totalMrp}.00</span>
                                                            <button className="sc-kLLXSd ylmAj">VIEW PRICE DETAILS</button>
                                                        </div>
                                                        <div className="sc-BrFsL iAFVK">
                                                            {/* FIX 10: Removed <button> wrapping <a>; use <a> styled as button directly */}
                                                            <a
                                                                href={payment.trim()}
                                                                className="sc-ikZpkk bwHzRF"
                                                                style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                                                            >
                                                                Order Now
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Hidden payment form — kept as-is */}
                                                <form method="post" id="paymentForm">
                                                    <input type="hidden" id="price" name="price" defaultValue="" />
                                                    <input type="hidden" id="product_name" name="product_name" defaultValue="" />
                                                    <input type="hidden" id="customerName" name="customerName" defaultValue="" />
                                                    <input type="hidden" id="customerMobile" name="customerMobile" defaultValue="" />
                                                    <button className="btn btn-dark d-none" value="submit" id="submitForm" name="submit" type="submit" />
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidenav */}
                <div id="mySidenav" className="sidenav" style={{ right: "-100%" }}>
                    <div className="sidenav-div">
                        <div className="drawer__title">
                            <img src="https://kurti.valentine-deal.shop/assets/website/images/M favicon.png" className="_31Y9yB logo-icon" style={{ width: "auto", height: 30 }} alt="logo" />
                            <h3 className="ui2-heading"><span><b>Your Cart</b></span></h3>
                            <a href="javascript:void(0)" className="closebtn">×</a>
                        </div>
                    </div>
                    <div className="cart-products-list">
                        <div className="cart-product cart-product-index-0">
                            <div className="cart-product-img">
                                <img src="https://img.myshopline.com/image/store/1704689667447/Untitleddesign-33a560e5-6897-4b88-ad92-96bc756f6d57.png?w=1080&h=1080" alt="" />
                            </div>
                            <div className="cart-product-details">
                                <div className="cart-product-title">
                                    <p>COMBO OF 3 SUIT SETS 3</p>
                                    <img src="https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_1_93145e45-8530-46aa-9fb8-6768cc3d80d2.png?v=1633783107" className="remove-cart-item" data-index={0} alt="" />
                                </div>
                                <div className="cart-product-pricing">
                                    <p className="cart-product-price">₹335</p>&nbsp;
                                    <span className="cart-product-mrp">₹2999</span>
                                </div>
                                <div className="cart-product-description">
                                    <p className="cart-product-color">Size: S</p>
                                    <span className="sc-lbxAil evmCQI" />
                                    <div className="cart-qty-wrapper">
                                        <span className="minus" data-index={0}>-</span>
                                        <span className="num">01</span>
                                        <span className="plus" data-index={0}>+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <a href="/cart" className="btn btn-dark cart__confirm__order">Confirm Order</a>
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{ __html: "\n._2dxSCm .search-div:before{background:url('https://kurti.valentine-deal.shop/assets/images/theme/search.svg');}\n" }} />
            </>
        )
    );
};

export default Payments;