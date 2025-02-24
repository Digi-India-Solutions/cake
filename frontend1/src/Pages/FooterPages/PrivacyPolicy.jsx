import React, { useEffect } from "react";
import "./footerpages.css";

const PrivacyPolicy = () => {
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
    })
  // Privacy Policy content stored in an array
  const privacyPolicyContent = [
    {
      heading: "Introduction",
      text: "At Cake Crazzy, we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.",
    },
    {
      heading: "Information We Collect",
      list: [
        "Personal details like name, email, and phone number.",
        "Order details, including delivery address and payment method.",
        "Device information such as IP address, browser type, and cookies.",
      ],
    },
    {
      heading: "How We Use Your Information",
      list: [
        "To process and deliver your orders.",
        "To improve our website and services.",
        "To send you promotional offers (with your consent).",
      ],
    },
    {
      heading: "Cookies Policy",
      text: "Our website uses cookies to enhance your browsing experience by remembering your preferences and tracking website performance. You can manage cookie preferences through your browser settings.",
    },
    {
      heading: "Data Sharing and Disclosure",
      text: "We may share your data with trusted third parties such as payment processors and delivery partners, only when necessary and in compliance with industry standards.",
    },
    {
      heading: "Data Security",
      text: "We implement advanced security measures to protect your data from unauthorized access, alteration, or disclosure.",
    },
    {
      heading: "User Rights",
      text: "You have the right to access, update, or delete your personal information. Please contact us if you wish to exercise these rights.",
    },
    {
      heading: "Changes to This Policy",
      text: "We may update this Privacy Policy from time to time. The latest version will always be available on this page, and we encourage you to review it periodically.",
    },
    {
      heading: "Contact Information",
      text: "If you have any questions or concerns, please reach out to us at privacy@cakecrazzy.com.",
    },
  ];

  return (
    <div className="privacyPolicy">
      <div className="container">
        <div className="privacyPolicyContent">
          <h3>Cake Crazzy</h3>
          <h1>Privacy Policy</h1>
          <hr />
          {privacyPolicyContent.map((section, index) => (
            <div key={index} className="privacySection">
              <h4>{section.heading}</h4>
              {section.text && <p>{section.text}</p>}
              {section.list && (
                <ul>
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
