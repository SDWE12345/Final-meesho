"use client";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Address = () => {
  const router = useRouter();
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
  }, []);


  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      fname: "",
      mobile: "",
      pincode: "",
      city: "",
      state: "",
      house: "",
      colonny: "",
    },
    onSubmit: () => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          address: values.house,
          name: values.fname,
          phone: Number(values.mobile),
        })
      );
      router.push("/payment");
    },
  });

  // Map full state name → select option value
  const STATE_MAP = {
    "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR", "Assam": "AS",
    "Bihar": "BR", "Chhattisgarh": "CT", "Goa": "GA", "Gujarat": "GJ",
    "Haryana": "HR", "Himachal Pradesh": "HP", "Jammu and Kashmir": "JK",
    "Jammu & Kashmir": "JK", "Jharkhand": "JH", "Karnataka": "KA",
    "Kerala": "KL", "Madhya Pradesh": "MP", "Maharashtra": "MH",
    "Manipur": "MN", "Meghalaya": "ML", "Mizoram": "MZ", "Nagaland": "NL",
    "Odisha": "OR", "Punjab": "PB", "Rajasthan": "RJ", "Sikkim": "SK",
    "Tamil Nadu": "TN", "Telangana": "TS", "Tripura": "TR",
    "Uttarakhand": "UK", "Uttar Pradesh": "UP", "West Bengal": "WB",
    "Andaman and Nicobar Islands": "AN", "Andaman & Nicobar": "AN",
    "Chandigarh": "CH", "Dadra and Nagar Haveli": "DN",
    "Daman and Diu": "DD", "Daman & Diu": "DD", "Delhi": "DL",
    "Lakshadweep": "LD", "Puducherry": "PY", "Pondicherry": "PY",
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using OpenStreetMap Nominatim (free, no API key needed)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr = data.address || {};

          const city =
            addr.city || addr.town || addr.village || addr.county || "";
          const stateName = addr.state || "";
          const pincode = addr.postcode || "";
          const colony =
            addr.suburb || addr.neighbourhood || addr.road || "";
          const house =
            addr.house_number
              ? `${addr.house_number}${addr.road ? ", " + addr.road : ""}`
              : addr.road || "";

          const stateCode = STATE_MAP[stateName] || "";

          setFieldValue("city", city);
          setFieldValue("state", stateCode);
          setFieldValue("pincode", pincode);
          if (colony) setFieldValue("colonny", colony);
          if (house) setFieldValue("house", house);
        } catch (err) {
          console.error("Reverse geocode failed:", err);
          setLocationError("Could not fetch address. Please fill manually.");
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationError(
          "Location access denied. Please allow location permission."
        );
        setLocationLoading(false);
      },
      { timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div>
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
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html:
              "\n        body,\n        a,\n        p,\n        span,\n        div,\n        input,\n        button,\n        h1,\n        h2,\n        h3,\n        h4,\n        h5,\n        h6,\n        button,\n        input,\n        optgroup,\n        select,\n        textarea {\n            font-family: 'Poppins', sans-serif !important;\n        }\n    ",
          }}
        />
        {/* Meta Pixel Code */}
        <noscript>
          &lt;img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=239159289163632&amp;ev=PageView&amp;noscript=1"
          /&gt;
        </noscript>
        {/* End Meta Pixel Code */}
        <link
          rel="stylesheet"
          href="chrome-extension://mhnlakgilnojmhinhkckjpncpbhabphi/content.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
        />
        <style
          id="_goober"
          dangerouslySetInnerHTML={{
            __html:
              " .go1475592160{height:0;}.go1671063245{height:auto;}.go1888806478{display:flex;flex-wrap:wrap;flex-grow:1;}@media (min-width:600px){.go1888806478{flex-grow:initial;min-width:288px;}}.go167266335{background-color:#313131;font-size:0.875rem;line-height:1.43;letter-spacing:0.01071em;color:#fff;align-items:center;padding:6px 16px;border-radius:4px;box-shadow:0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12);}.go3162094071{padding-left:20px;}.go3844575157{background-color:#313131;}.go1725278324{background-color:#43a047;}.go3651055292{background-color:#d32f2f;}.go4215275574{background-color:#ff9800;}.go1930647212{background-color:#2196f3;}.go946087465{display:flex;align-items:center;padding:8px 0;}.go703367398{display:flex;align-items:center;margin-left:auto;padding-left:16px;margin-right:-8px;}.go3963613292{width:100%;position:relative;transform:translateX(0);top:0;right:0;bottom:0;left:0;min-width:288px;}.go1141946668{box-sizing:border-box;display:flex;max-height:100%;position:fixed;z-index:1400;height:auto;width:auto;transition:top 300ms ease 0ms,right 300ms ease 0ms,bottom 300ms ease 0ms,left 300ms ease 0ms,max-width 300ms ease 0ms;pointer-events:none;max-width:calc(100% - 40px);}.go1141946668 .notistack-CollapseWrapper{padding:6px 0px;transition:padding 300ms ease 0ms;}@media (max-width:599.95px){.go1141946668{width:100%;max-width:calc(100% - 32px);}}.go3868796639 .notistack-CollapseWrapper{padding:2px 0px;}.go3118922589{top:14px;flex-direction:column;}.go1453831412{bottom:14px;flex-direction:column-reverse;}.go4027089540{left:20px;}@media (min-width:600px){.go4027089540{align-items:flex-start;}}@media (max-width:599.95px){.go4027089540{left:16px;}}.go2989568495{right:20px;}@media (min-width:600px){.go2989568495{align-items:flex-end;}}@media (max-width:599.95px){.go2989568495{right:16px;}}.go4034260886{left:50%;transform:translateX(-50%);}@media (min-width:600px){.go4034260886{align-items:center;}}",
          }}
        />

        {/* Page styles — same classes as original, improved spacing/sizing only */}
        <style dangerouslySetInnerHTML={{ __html: `
          .header-menu { display: none; }

          .save-address {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-style: normal;
            text-align: center;
            letter-spacing: 0.0015em;
            font-size: 15px;
            line-height: 20px;
            border-radius: 4px;
            color: rgb(255, 255, 255);
            background: rgb(159, 32, 137);
            border: none;
            padding: 14px 12px;
            font-weight: 600;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 52px;
          }

          .save-address:disabled {
            opacity: 0.65;
            cursor: not-allowed;
          }

          .izYblt {
            margin-bottom: 8px;
            background-color: rgb(255, 255, 255);
            padding: 20px 16px 100px;
          }

          .lcYQRo {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
          }

          .iZWODx { display: flex; }

          .gANwSd {
            color: rgb(53, 53, 67);
            font-weight: 700;
            font-size: 16px;
            flex-grow: 1;
          }

          .card-footer {
            position: fixed;
            width: 95%;
            max-width: 800px;
            background-color: rgb(255, 255, 255);
            bottom: 0px;
            z-index: 1;
            right: 50%;
            transform: translate(50%, 0px);
            padding: 10px 0 14px;
          }

          /* Tighten Bootstrap floating labels */
          .form-floating > .form-control,
          .form-floating > .form-select {
            height: 52px;
            font-size: 13px;
            padding-top: 18px;
            padding-bottom: 4px;
          }

          .form-floating > label {
            font-size: 12px;
            padding-top: 10px;
            color: #888;
          }

          .form-floating > .form-control:focus,
          .form-floating > .form-select:focus {
            border-color: #9f2089;
            box-shadow: 0 0 0 0.15rem rgba(159,32,137,0.15);
          }

          .form-floating.mb-3 { margin-bottom: 10px !important; }

          /* Location button */
          .location-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: 100%;
            padding: 10px 14px;
            border: 1.5px dashed #9f2089;
            border-radius: 8px;
            background: #fdf3fc;
            color: #9f2089;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 16px;
            margin-top: 4px;
            transition: background 0.2s;
          }

          .location-btn:hover { background: #f7e0f5; }
          .location-btn:disabled { opacity: 0.6; cursor: not-allowed; }

          .location-error {
            font-size: 11px;
            color: #d32f2f;
            margin-top: -10px;
            margin-bottom: 10px;
            padding: 0 2px;
          }

          /* Section divider */
          .section-divider {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 4px 0 14px;
            color: #bbb;
            font-size: 11px;
          }
          .section-divider::before,
          .section-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #eaeaf2;
          }

          /* Row fix for city/state */
          .row.mb-3 { margin-bottom: 10px !important; }
          .row.mb-3 .col-6 { padding-right: 6px; }
          .row.mb-3 .col-6:last-child { padding-left: 6px; padding-right: 12px; }
        ` }} />

        <div id="container" style={{ overflow: "hidden" }}>
          <div style={{ height: "100%" }} data-reactroot="">
            <div>
              <div className="_2dxSCm">
                <div className="_3CzzrP" style={{}}>
                  <div className="_38U37R">
                    <div>
                      <div className="_1FWdmb" style={{}}>
                        <div className="d-flex align-items-center">
                          <Link
                            href="/"
                            className="_3NH1qf"
                            id="back-btn"
                            style={{ marginTop: 5 }}
                          >
                            <svg width={25} height={25} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sc-gswNZR ffVWIj">
                              <path d="M13.7461 2.31408C13.5687 2.113 13.3277 2 13.0765 2C12.8252 2 12.5843 2.113 12.4068 2.31408L6.27783 9.24294C5.90739 9.66174 5.90739 10.3382 6.27783 10.757L12.4068 17.6859C12.7773 18.1047 13.3757 18.1047 13.7461 17.6859C14.1166 17.2671 14.0511 16.5166 13.7461 16.1718L8.29154 9.99462L13.7461 3.82817C13.9684 3.57691 14.1071 2.72213 13.7461 2.31408Z" fill="#666666" />
                            </svg>
                          </Link>
                          <h4 className="header-title">Add delivery address</h4>
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
                            <span className="header__cart-count header__cart-count--floating bubble-count">
                              {typeof localStorage !== "undefined" &&
                                localStorage.getItem("cart") &&
                                JSON.parse(localStorage.getItem("cart")).length}
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sc-bBXxYQ jMfCEJ" />

                  <div id="container">
                    <div style={{ height: "100%" }} data-reactroot="">
                      <div className="_1fhgRH">
                        <div className="card py-1 max-height">

                          {/* Step indicator */}
                          <div data-testid="stepper-container" className="sc-geuGuN gqSLnX">
                            <div className="sc-kGhOqx chtKwW">
                              <ul className="sc-bAKPPm eOmvaT">
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
                                <div className="sc-jZiqTT hGoFZP">
                                  <div className="sc-bxSTMQ geeMAN">
                                    <div data-testid="left-line" className="sc-PJClH kHHhBS" />
                                    <div className="sc-dGHKFW cRaGaC">2</div>
                                    <div data-testid="right-line" className="sc-jfdOKL bSausD" />
                                  </div>
                                  <div className="sc-jWquRx iefUco">Address</div>
                                </div>
                                <div className="sc-jZiqTT hGoFZP">
                                  <div className="sc-bxSTMQ geeMAN">
                                    <div data-testid="left-line" className="sc-PJClH kHHhBS" />
                                    <div className="sc-dGHKFW iefbLi">3</div>
                                    <div data-testid="right-line" className="sc-jfdOKL bSausD" />
                                  </div>
                                  <div className="sc-jWquRx ezBHwi">Payment</div>
                                </div>
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

                          {/* Form */}
                          <div className="sc-fjqEFS pt-3">
                            <div className="sc-bfKFlL beUHuI">
                              <div className="sc-bcSJjp izYblt m-0 p-0" style={{ padding: "0 16px 100px" }}>

                                {/* Section header */}
                                <div className="sc-eBxihg lcYQRo" style={{ padding: "16px 0 8px" }}>
                                  <span className="sc-eEpejC iZWODx">
                                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width={20} height={20} fill="white" />
                                      <path d="M15.2565 17.8276C15.2565 19.0296 12.9683 19.9999 10.1588 19.9999C7.34922 19.9999 5.06104 19.0296 5.06104 17.8276C5.07552 17.6683 5.14793 17.4945 5.22034 17.3642C5.72722 16.3794 7.75472 15.6553 10.1877 15.6553C12.6207 15.6553 14.6483 16.3794 15.1406 17.3642C15.2131 17.4945 15.2565 17.6683 15.2565 17.8276Z" fill="#3A66CF" />
                                      <path d="M17.0527 6.4301C16.5313 -0.0434386 10.1157 7.62167e-06 10.1157 7.62167e-06C10.1157 7.62167e-06 3.6711 -0.0434386 3.14974 6.4301C2.70079 12.1651 8.49367 16.9152 9.82603 17.929C9.89844 17.9869 9.99982 18.0159 10.1012 18.0159C10.2026 18.0159 10.2895 17.9869 10.3764 17.929C11.7087 16.9152 17.5161 12.1651 17.0527 6.4301ZM10.1157 9.71756C9.57984 9.71756 9.05848 9.55826 8.62401 9.26861C8.17506 8.97897 7.82749 8.55899 7.62474 8.06659C7.42199 7.5742 7.36406 7.03835 7.46544 6.517C7.56681 5.99564 7.82749 5.51772 8.20403 5.14119C8.58056 4.76465 9.05848 4.50397 9.57984 4.4026C10.1012 4.30122 10.637 4.34467 11.1294 4.54742C11.6218 4.75017 12.0418 5.09774 12.3459 5.53221C12.6356 5.98116 12.7949 6.50251 12.7949 7.02387C12.7949 7.7335 12.5197 8.41416 12.0128 8.92104C11.506 9.42792 10.8253 9.71756 10.1157 9.71756Z" fill="#90B1FB" />
                                    </svg>
                                  </span>
                                  <span className="sc-hFvvYD gANwSd">Delivery Address</span>
                                </div>

                                {/* Use Current Location button */}
                                <button
                                  type="button"
                                  className="location-btn"
                                  onClick={handleUseCurrentLocation}
                                  disabled={locationLoading}
                                >
                                  {locationLoading ? (
                                    <>
                                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: "spin 1s linear infinite" }}>
                                        <circle cx="12" cy="12" r="10" stroke="#9f2089" strokeWidth="3" strokeDasharray="30 60" />
                                      </svg>
                                      Detecting location…
                                    </>
                                  ) : (
                                    <>
                                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#9f2089" />
                                      </svg>
                                      Use Current Location
                                    </>
                                  )}
                                </button>
                                <style dangerouslySetInnerHTML={{ __html: "@keyframes spin { to { transform: rotate(360deg); } }" }} />

                                {locationError && (
                                  <p className="location-error">⚠ {locationError}</p>
                                )}

                                <div className="section-divider">or fill manually</div>

                                {/* Personal details */}
                                <div className="form-floating mb-3">
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="fname"
                                    name="fname"
                                    placeholder="Full name"
                                    value={values.fname}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="fname">Full Name</label>
                                </div>

                                <div className="form-floating mb-3">
                                  <input
                                    className="form-control"
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    placeholder="Mobile number"
                                    maxLength={10}
                                    value={values.mobile}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="mobile">Mobile Number</label>
                                </div>

                                <div className="form-floating mb-3">
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    placeholder="PIN code"
                                    maxLength={6}
                                    value={values.pincode}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="pincode">Pincode</label>
                                </div>

                                {/* City + State row */}
                                <div className="row mb-3">
                                  <div className="col-6 form-floating">
                                    <input
                                      className="form-control"
                                      type="text"
                                      id="city"
                                      name="city"
                                      placeholder="Town/City"
                                      value={values.city}
                                      onChange={handleChange}
                                    />
                                    <label htmlFor="city">City</label>
                                  </div>
                                  <div className="col-6 form-floating">
                                    <select
                                      className="form-select"
                                      id="state"
                                      name="state"
                                      value={values.state}
                                      onChange={handleChange}
                                    >
                                      <option value="">Select State</option>
                                      <option value="AP">Andhra Pradesh</option>
                                      <option value="AR">Arunachal Pradesh</option>
                                      <option value="AS">Assam</option>
                                      <option value="BR">Bihar</option>
                                      <option value="CT">Chhattisgarh</option>
                                      <option value="GA">Goa</option>
                                      <option value="GJ">Gujarat</option>
                                      <option value="HR">Haryana</option>
                                      <option value="HP">Himachal Pradesh</option>
                                      <option value="JK">Jammu &amp; Kashmir</option>
                                      <option value="JH">Jharkhand</option>
                                      <option value="KA">Karnataka</option>
                                      <option value="KL">Kerala</option>
                                      <option value="MP">Madhya Pradesh</option>
                                      <option value="MH">Maharashtra</option>
                                      <option value="MN">Manipur</option>
                                      <option value="ML">Meghalaya</option>
                                      <option value="MZ">Mizoram</option>
                                      <option value="NL">Nagaland</option>
                                      <option value="OR">Odisha</option>
                                      <option value="PB">Punjab</option>
                                      <option value="RJ">Rajasthan</option>
                                      <option value="SK">Sikkim</option>
                                      <option value="TN">Tamil Nadu</option>
                                      <option value="TS">Telangana</option>
                                      <option value="TR">Tripura</option>
                                      <option value="UK">Uttarakhand</option>
                                      <option value="UP">Uttar Pradesh</option>
                                      <option value="WB">West Bengal</option>
                                      <option value="AN">Andaman &amp; Nicobar</option>
                                      <option value="CH">Chandigarh</option>
                                      <option value="DN">Dadra and Nagar Haveli</option>
                                      <option value="DD">Daman &amp; Diu</option>
                                      <option value="DL">Delhi</option>
                                      <option value="LD">Lakshadweep</option>
                                      <option value="PY">Puducherry</option>
                                    </select>
                                    <label htmlFor="state">State</label>
                                  </div>
                                </div>

                                <div className="form-floating mb-3">
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="house"
                                    name="house"
                                    placeholder="Flat, House no, Building"
                                    value={values.house}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="house">House No., Building Name</label>
                                </div>

                                <div className="form-floating mb-3">
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="colonny"
                                    name="colonny"
                                    placeholder="Area, Colony, Street"
                                    value={values.colonny}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="colonny">Road name, Area, Colony</label>
                                </div>

                                {/* Fixed bottom CTA */}
                                <div className="card-footer px-0">
                                  <button
                                    type="button"
                                    className="btn btn-dark save-address"
                                    onClick={handleSubmit}
                                  >
                                    Save Address and Continue
                                  </button>
                                </div>

                              </div>
                            </div>
                          </div>
                          <img
                            src="https://images.meesho.com/images/marketing/1588578650850.webp"
                            alt="Secure checkout"
                            style={{ width: "100%", display: "block", marginTop: 4 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
   </>
    </div>
  );
};

export default Address;