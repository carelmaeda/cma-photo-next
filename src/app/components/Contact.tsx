"use client"; // Indicate it's a client component

import React, { useState } from "react";
import emailjs from "emailjs-com";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const templateParams = {
      to_name: "Carel Maeda", 
      from_name: name, // Sender's name
      from_email: email, // Sender's email
      message,
    };
    

    console.log("Template Params:", templateParams); // Debugging

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response.status, response.text);
          setSuccessMessage("Your message has been sent successfully!");
          setName("");
          setEmail("");
          setMessage("");
          setErrorMessage("");
        },
        (error) => {
          console.error("Failed to send email:", error);
          setErrorMessage("Failed to send your message. Please try again later.");
          setSuccessMessage("");
        }
      );
  };

  return (
    <div className="section-wrapper justify-items-center">
      <h2 className="text-center mb-3">Contact Me</h2>
      <form onSubmit={sendEmail} className="mx-auto">
        <div className="form-group mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Enter your name"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Enter your email"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            className="form-control"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            aria-label="Enter your message"
          />
        </div>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <button type="submit" className="btn btn-dark w-100">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
