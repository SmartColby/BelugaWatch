import React, { useState } from 'react';
import '../styles/ContactPage.css';
import twitterLogo from '../assets/twitter-icon.png'; // Add the path to your logo files
import facebookLogo from '../assets/facebook-icon.png';
import instagramLogo from '../assets/instagram-icon.png';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [faqOpen, setFaqOpen] = useState(null);
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [testimonials] = useState([
    { name: "Emily Johnson", stars: 5, message: "Beluga Watch is an amazing initiative! I learned so much about these beautiful creatures." },
    { name: "Michael Brown", stars: 4, message: "Great platform for raising awareness about beluga whales. Keep up the good work!" },
    { name: "Sophia Martinez", stars: 5, message: "I love how interactive and educational this site is. My kids are now beluga fans!" },
    { name: "Liam Smith", stars: 4, message: "The tracking feature is incredible. It’s fascinating to see belugas in their natural habitat." },
    { name: "Olivia Carter", stars: 5, message: "The newsletter keeps me updated on conservation efforts. Highly recommend subscribing!" },
    { name: "James Anderson", stars: 5, message: "Beluga Watch is a fantastic resource for learning about these beautiful creatures!" }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent!');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleSubscription = (e) => {
    e.preventDefault();
    alert(`Subscribed with email: ${subscriptionEmail}`);
    setSubscriptionEmail('');
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="contact-page">
      {/* Mission Statement */}
      <div className="mission-statement">
        <h1>Our Mission</h1>
        <p>
          At Beluga Watch, our mission is to protect and preserve beluga whales through education, conservation, and community engagement. 
          We aim to inspire people to take action and ensure a thriving future for these majestic creatures.
        </p>
      </div>

      {/* Contact Form */}
      <div className="contact-form">
        <h2>Get in Touch</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Send Message</button>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item" onClick={() => toggleFaq(0)}>
          <h3>How can I help protect Beluga Whales?</h3>
          {faqOpen === 0 && <p>You can help by donating, spreading awareness, and supporting conservation efforts in your community.</p>}
        </div>
        <div className="faq-item" onClick={() => toggleFaq(1)}>
          <h3>Where are Beluga Whales found?</h3>
          {faqOpen === 1 && <p>Beluga Whales are primarily found in Arctic and sub-Arctic waters, including the Cook Inlet and Hudson Bay.</p>}
        </div>
        <div className="faq-item" onClick={() => toggleFaq(2)}>
          <h3>What are the biggest threats to Beluga Whales?</h3>
          {faqOpen === 2 && <p>Climate change, pollution, and human activities such as shipping and oil drilling are major threats to Beluga Whales.</p>}
        </div>
        <div className="faq-item" onClick={() => toggleFaq(3)}>
          <h3>How can I track Beluga Whales?</h3>
          {faqOpen === 3 && <p>Our Whale Tracking feature allows you to upload videos and analyze beluga movements using AI-powered tools.</p>}
        </div>
        <div className="faq-item" onClick={() => toggleFaq(4)}>
          <h3>What is the purpose of this website?</h3>
          {faqOpen === 4 && <p>This website is dedicated to raising awareness about beluga whales, providing educational resources, and supporting conservation efforts.</p>}
        </div>
        <div className="faq-item" onClick={() => toggleFaq(5)}>
          <h3>How can I subscribe to the newsletter?</h3>
          {faqOpen === 5 && <p>Scroll down to the newsletter section, enter your email, and click "Subscribe" to stay updated on the latest news and conservation efforts.</p>}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2>What People Are Saying</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <h3>{testimonial.name}</h3>
              <p className="stars">
                {"★".repeat(testimonial.stars)}
                {"☆".repeat(5 - testimonial.stars)}
              </p>
              <p>{testimonial.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="newsletter-section">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Stay updated on the latest news and conservation efforts for Beluga Whales.</p>
        <form onSubmit={handleSubscription}>
          <input
            type="email"
            placeholder="Enter your email"
            value={subscriptionEmail}
            onChange={(e) => setSubscriptionEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>

      {/* Social Media Links */}
      <div className="social-media-section">
        <h2>Follow Us</h2>
        <p>Stay connected and join the conversation on our social media platforms:</p>
        <div className="social-icons">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={twitterLogo} alt="Twitter" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebookLogo} alt="Facebook" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagramLogo} alt="Instagram" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
