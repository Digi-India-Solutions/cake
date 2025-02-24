import React, { useEffect } from 'react'
import "./footerpages.css";

const FAQ = () => {
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
    })
     // FAQ content stored in an array
  const faqContent = [
    {
      question: "What is Cake Crazzy?",
      answer: "Cake Crazzy is an online bakery that specializes in freshly made cakes and baked goods, offering delivery and pickup services. We focus on providing high-quality products that meet your specific needs.",
    },
    {
      question: "How do I place an order?",
      answer: "You can place an order directly on our website by selecting your desired products and filling out the necessary details at checkout. Once you complete your order, you will receive an email confirmation.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods including credit/debit cards, UPI, and various digital wallets. All payments are processed securely.",
    },
    {
      question: "Do you offer delivery?",
      answer: "Yes, we offer delivery to specific locations. Delivery charges and estimated delivery times will be shown at checkout. You can also choose to pick up your order from our store at no additional cost.",
    },
    {
      question: "Can I cancel or change my order?",
      answer: "Orders can be canceled within 24 hours if production has not begun. If you need to make changes to your order, please contact us as soon as possible, and we will do our best to accommodate your request.",
    },
    {
      question: "How can I contact Cake Crazzy?",
      answer: "You can contact us via email at support@cakecrazzy.com, or reach us through our customer service phone number at +123-456-7890.",
    },
    {
      question: "Do you offer custom cakes?",
      answer: "Yes, we offer custom cakes for special occasions. You can provide us with your design and preferences, and our team will work with you to create the perfect cake.",
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is dispatched, you will receive an email with tracking details. You can use this to track your order's status.",
    },
    {
      question: "Is there a delivery fee?",
      answer: "Yes, delivery charges vary based on your location. The exact fee will be displayed during checkout before you finalize your order.",
    },
  ];
  return (
    <div>
         <div className="faqPage">
      <div className="container">
        <div className="faqContent">
          <h3>Cake Crazzy</h3>
          <h1>Frequently Asked Questions</h1>
          <hr />
          <div>
            {faqContent.map((faq, index) => (
              <div key={index} className="faqSection">
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default FAQ