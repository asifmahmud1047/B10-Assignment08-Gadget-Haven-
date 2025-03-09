import React from "react";
import "./AdditionalPage.css";

const AdditionalPage = () => {
  return (
    <div className="additional-page">
      <h1 className="additional-page-title">About GadgetHaven</h1>
      <p className="additional-page-text">
        Welcome to GadgetHaven! We are your one-stop destination for the latest
        and greatest gadgets. From computers and phones to smart watches and
        power banks, we bring you a curated selection of top-quality gadgets at
        unbeatable prices. Our mission is to make the latest technology
        accessible to everyone.
      </p>
      <p className="additional-page-text">
        At GadgetHaven, customer satisfaction is our top priority. We are
        committed to providing a seamless shopping experience with a dedicated
        support team ready to assist you.
      </p>
      <h2 className="additional-page-subtitle">Why Choose Us?</h2>
      <ul className="additional-page-list">
        <li>Wide selection of high-quality gadgets</li>
        <li>Competitive prices</li>
        <li>Secure payment and fast delivery</li>
        <li>Excellent customer service</li>
      </ul>
      <p className="additional-page-text">
        Thank you for choosing GadgetHaven. We look forward to serving you with
        the best in tech!
      </p>
    </div>
  );
};

export default AdditionalPage;
