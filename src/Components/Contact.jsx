import React, { useState, useEffect, useRef } from 'react';
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | success
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.target);
    const contactData = Object.fromEntries(formData.entries());

    try {
      await addDoc(collection(db, "contacts"), {
        ...contactData,
        createdAt: serverTimestamp()
      });
      setStatus("success");
      e.target.reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("idle");
      alert("Failed to send message. Please try again.");
    }
  };

  const contactCards = [
    {
      href: "https://wa.me/message/HJDPGMFFZNI3H1",
      icon: "💬",
      iconBg: "bg-gradient-to-br from-green-400 to-green-600",
      label: "WhatsApp",
      value: "Chat Now",
      borderColor: "border-green-100 hover:border-green-300"
    },
    {
      href: "https://www.instagram.com/tourpanda_official/",
      icon: "📸",
      iconBg: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500",
      label: "Instagram",
      value: "Follow Us",
      borderColor: "border-pink-100 hover:border-pink-300"
    },
    {
      href: "https://www.facebook.com/tourpanda.pk",
      icon: "f",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
      label: "Facebook",
      value: "Join Community",
      borderColor: "border-blue-100 hover:border-blue-300",
      isText: true
    },
    {
      href: "https://maps.google.com/?q=Garden+Town,+Lahore",
      icon: "📍",
      iconBg: "bg-gradient-to-br from-nature-green to-green-600",
      label: "Head Office",
      value: "Garden Town, Lahore",
      borderColor: "border-gray-100 hover:border-nature-green"
    }
  ];

  return (
    <section ref={sectionRef} id="contact" className="bg-gradient-to-b from-white to-bg-light relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-nature-green/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 py-20 lg:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left Side: Info & Socials */}
          <div className={`space-y-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Get In Touch
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-nature-green mb-4 leading-tight">
                Ready for your <br />
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-primary animate-gradient-flow italic">
                    next adventure?
                  </span>
                </span>
              </h2>
              <p className="text-gray-600 text-lg font-medium max-w-md">
                Contact TourPanda.pk for custom itineraries or support regarding your next nature escape.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactCards.map((card, index) => {
                const CardWrapper = card.href ? 'a' : 'div';
                const cardProps = card.href ? {
                  href: card.href,
                  target: "_blank",
                  rel: "noreferrer"
                } : {};

                return (
                  <CardWrapper
                    key={index}
                    {...cardProps}
                    className={`group flex items-center gap-4 p-5 bg-white rounded-2xl border-2 ${card.borderColor} transition-all duration-300 hover:shadow-xl ${card.href ? 'cursor-pointer' : ''}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className={`${card.iconBg} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      {card.isText ? (
                        <span className="font-bold text-2xl">{card.icon}</span>
                      ) : (
                        <span>{card.icon}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{card.label}</p>
                      <p className="text-nature-black font-bold text-lg">{card.value}</p>
                    </div>
                    {card.href && (
                      <svg className="w-5 h-5 text-gray-300 ml-auto transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </CardWrapper>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-gradient-to-br from-nature-green/5 to-primary/5 rounded-2xl border border-nature-green/10">
              <a href="tel:+923001261257" className="flex items-center gap-3 group hover:bg-white/50 p-2 rounded-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-nature-green to-nature-green-light rounded-xl flex items-center justify-center shadow-lg shadow-nature-green/20 group-hover:scale-110 transition-transform">
                  <span className="text-white text-xl">📞</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Helpline</p>
                  <p className="text-nature-green font-black text-lg">0300 126 1257</p>
                </div>
              </a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=Tourpandaofficial@gmail.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 group hover:bg-white/50 p-2 rounded-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                  <span className="text-white text-xl">📧</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Email Us</p>
                  <p className="text-nature-black font-bold text-sm">Tourpandaofficial@gmail.com</p>
                </div>
              </a>
              <div className="flex items-center gap-3 p-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white text-xl">⏰</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Working Hours</p>
                  <p className="text-nature-green font-bold">Mon - Sat: 9AM - 6PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white text-xl">🆔</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Identification No</p>
                  <p className="text-nature-black font-bold">0243143</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Decorative background blur */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-nature-green/10 rounded-[3rem] blur-2xl opacity-50" />

              <div className="relative bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
                {/* Form Header */}
                <div className="mb-8">
                  <h3 className="text-2xl lg:text-3xl font-black text-nature-green mb-2">Drop us a message</h3>
                  <p className="text-gray-500">We'll get back to you within 24 hours</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative group">
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      className="w-full p-4 bg-gray-50/80 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white text-nature-black font-medium outline-none transition-all duration-300 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="relative group">
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      className="w-full p-4 bg-gray-50/80 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white text-nature-black font-medium outline-none transition-all duration-300 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="relative group">
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      className="w-full p-4 bg-gray-50/80 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white text-nature-black font-medium outline-none transition-all duration-300 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="relative group">
                    <textarea
                      required
                      name="message"
                      rows="4"
                      placeholder="How can we help you?"
                      className="w-full p-4 bg-gray-50/80 rounded-xl border-2 border-transparent focus:border-primary focus:bg-white text-nature-black font-medium outline-none transition-all duration-300 resize-none placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status !== "idle"}
                    className={`group relative w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 transform flex items-center justify-center gap-3 shadow-xl overflow-hidden ${status === "success"
                      ? "bg-green-500 text-white"
                      : status === "sending"
                        ? "bg-gray-400 text-white cursor-wait"
                        : "bg-gradient-to-r from-nature-green to-nature-green-light text-white hover:shadow-2xl hover:-translate-y-0.5"
                      }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {status === "idle" && (
                        <>
                          Send Message
                          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}

                      {status === "sending" && (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      )}

                      {status === "success" && (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Message Sent!
                        </>
                      )}
                    </span>
                    {status === "idle" && (
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </button>
                </form>

                {/* Security Note */}
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Your information is secure and will not be shared
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-6 pb-20 lg:pb-28">
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Map Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-nature-green mb-2">Visit Our Office</h2>
              <p className="text-gray-500 font-medium">Come say hello at our headquarters</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Open Now
            </div>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl lg:rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
            <iframe
              title="TourPanda Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217759.9938085377!2d74.19430294116246!3d31.482635232140445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc202c60775199.3ad!2sLahore%2C%20Punjab!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="transition-all duration-500 group-hover:scale-105"
            ></iframe>

            {/* Map Overlay Card */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl max-w-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-nature-green rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">📍</span>
                </div>
                <div>
                  <h4 className="font-bold text-nature-black">TourPanda Head Office</h4>
                  <p className="text-gray-500 text-sm">Garden Town, Lahore, Pakistan</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-sm font-bold hover:underline mt-1 inline-block"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}