import React, { useEffect } from "react";
import './footerpages.css'
const TermsConditions = () => {
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
    })
  const data = [
    {
      heading: "General Information",
      listItems: [
        "These terms govern your use of Cake Crazzy's website and the purchase of products offered through it.",
        "The website is operated by Cake Crazzy, located at [Your Address].",
      ],
    },
    {
      heading: "Ordering Policy",
      listItems: [
        "By accessing our website or making a purchase, you confirm that you accept these terms and conditions.",
        "If you do not agree to these terms, please do not use our website or services.",
      ],
    },
    {
      heading: "Orders and Payments",
      listItems: [
        "All orders are subject to availability and acceptance. Prices are subject to change without notice.",
        "You must ensure that all information provided during the ordering process is accurate and complete.",
        "Once an order is confirmed, changes or cancellations may not be possible, depending on the production stage."
      ],
    },
    {
      heading: "Payment Terms",
      listItems: [
        "Payments must be made in full at the time of placing the order.",
        "Cake Crazzy accepts payments via [list payment methods: credit/debit cards, UPI, wallets, etc.].",
        "All payment details are handled securely, and we do not store your payment information."
      ],
    },
    {
      heading: "Product Details",
      listItems: [
        "Cake Crazzy specializes in freshly made cakes and baked goods. However, due to the handcrafted nature of our products, slight variations in design, color, or size may occur.",
        "Some products may contain allergens such as nuts, dairy, or gluten. It is your responsibility to review the product descriptions for allergen information.",
      ],
    },
    {
      heading: "Delivery and Pickup",
      listItems: [
        "Delivery: We offer delivery within specific locations. Delivery charges and timelines will be communicated during checkout.",
        "Pickup: You may choose to collect your order from our store at no additional cost.",
        "We are not liable for delays caused by incorrect address details or events beyond our control (e.g., weather, traffic).",
      ],
    },
    {
      heading: "Cancellations and Refunds",
      listItems: [
        "Cancellations: Orders can be canceled within 24 hours of placement if production has not begun.",
        "Refunds: Refunds are available for defective or damaged products only. Any issues must be reported within 12 hours of delivery or pickup, accompanied by photographic evidence.",
        "Refunds will be processed within 7-10 business days after approval.",
      ],
    },
    {
      heading: "Customer Responsibilities",
      listItems: [
        "You agree to use the Cake Crazzy website for lawful purposes only and to avoid activities that harm our business, website, or other users.",
        "Any attempt to disrupt, hack, or misuse our website is strictly prohibited and may lead to legal action.",
      ],
    },
    {
      heading: "Intellectual Property",
      listItems: [
        "All content on the Cake Crazzy website, including logos, images, and text, is protected by copyright laws.",
        "You may not use, copy, or reproduce any content without prior written permission from Cake Crazzy.",
      ],
    },
    {
      heading: "Limitation of Liability",
      listItems: [
        "Cake Crazzy is not responsible for any indirect, incidental, or consequential damages resulting from the use of our products or website, except as required by applicable law.",
      ],
    },
    {
      heading: "Amendments to Terms",
      listItems: [
        "Cake Crazzy reserves the right to update these Terms and Conditions at any time. Changes will be effective upon posting on our website.",
        "Continued use of the website after changes implies your acceptance of the revised Terms.",
      ],
    }
  ];

  return (
    <>
        <div className="termsConditions">
      <div className="container">
        <div className="termsConditionsContent">
          <h3>Cake Crazzy</h3>
          <h1>Terms of Services</h1>
          <hr />
          <p className="introText">
            Welcome to{" "}
            <span className="highlighted">Cake Crazzy</span>. By using our
            website and services, you agree to comply with and be bound by the
            following terms and conditions. Please review them carefully as they
            outline your rights and obligations when purchasing from us.
          </p>
          <div className="lastUpdate">
            Last Updated:{" "}
            <span>{new Date("2024-01-12").toLocaleDateString()}</span>
          </div>
          {data.map((item, index) => (
            <section key={index} className="termsSection">
              <h4>{item.heading}</h4>
              <ul>
                {item.listItems.map((listItem, listIndex) => (
                  <li key={listIndex}>{listItem}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default TermsConditions;
