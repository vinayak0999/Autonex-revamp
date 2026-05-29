import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildApiUrl } from "@/lib/apiConfig";
import heroImg from "@assets/generated_images/Industrial_monitoring_dashboard_mockup_02e09966.jpeg";
import { Sparkles } from "lucide-react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function NewContact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    subject: "",
    service: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    const dataToSend = {
      ...formValues,
      inquiryType: activeTab,
    };

    try {
      const response = await fetch(buildApiUrl("/api/send-email"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setFormStatus("success");
        setTimeout(() => {
          setFormValues({
            name: "",
            email: "",
            company: "",
            phone: "",
            message: "",
            subject: "",
            service: "",
          });
          formRef.current?.reset();
          setFormStatus("idle");
        }, 2500);
      } else {
        setFormStatus("error");
        setTimeout(() => setFormStatus("idle"), 4000);
      }
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 4000);
    }
  };

  useEffect(() => {
    setFormValues({
      name: "",
      email: "",
      company: "",
      phone: "",
      message: "",
      subject: "",
      service: "",
    });
    formRef.current?.reset();
    setFormStatus("idle");
  }, [activeTab]);

  const keyframesCSS = `
    @keyframes rotateAurora { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
    @keyframes rotateBadgeBorder { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
    @keyframes spin-horizontal { from { transform: rotateX(75deg) rotateZ(0); } to { transform: rotateX(75deg) rotateZ(360deg); } }
    @keyframes spin-vertical { from { transform: rotateY(75deg) rotateZ(0); } to { transform: rotateY(75deg) rotateZ(-360deg); } }
    @keyframes pulse-out { 0% { transform: scale(0.3); opacity: 0.8; } 100% { transform: scale(1.2); opacity: 0; } }
  `;

  return (
    <div>
      <Header />

      <div className="relative w-full flex justify-center pt-20 pb-6">
        <style>{keyframesCSS}</style>
        <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 pointer-events-none select-none">
          <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50%" cy="50%" r="35%" className="stroke-secondary/10" strokeWidth="1" />
              <circle cx="50%" cy="50%" r="25%" className="stroke-secondary/10" strokeWidth="1" />
            </svg>
          </div>
          <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-secondary/30 to-tertiary/20 shadow-[0_0_40px_8px_rgba(98,170,222,0.4)] animate-pulse border border-tertiary/30">
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-secondary/40 to-tertiary/30 shadow-[inset_0_0_15px_rgba(98,170,222,0.5)] flex items-center justify-center text-tertiary font-bold text-3xl sm:text-4xl drop-shadow-[0_0_10px_rgba(98,170,222,0.6)]">AI</div>
          </div>
          <div className="absolute inset-[20%] border border-tertiary/30 rounded-full" style={{ transform: 'rotateX(75deg)', animation: 'spin-horizontal 10s linear infinite' }} />
          <div className="absolute inset-[20%] border border-tertiary/30 rounded-full" style={{ transform: 'rotateY(75deg)', animation: 'spin-vertical 12s linear infinite' }} />
          <div className="absolute inset-0 border border-tertiary/25 rounded-full" style={{ animation: 'pulse-out 3s ease-out infinite' }} />
        </div>
      </div>

      <main>
        <div className="relative min-h-screen" ref={containerRef}>
          <div className="relative z-10 container mx-auto px-4 py-8">
            <motion.div
              className="text-center max-w-4xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative inline-flex items-center justify-center p-0.5 mb-3 overflow-hidden rounded-full">
                {/* Animated border glow with rotating conic gradient */}
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[400%]" style={{ background: 'conic-gradient(from 0deg at 50% 50%, rgba(98, 170, 222, 0.5), rgba(22, 55, 145, 0.3), rgba(98, 170, 222, 0.5))', animation: 'rotateBadgeBorder 4s linear infinite' }} />
                {/* Badge container */}
                <div className="relative flex items-center px-5 py-2.5 rounded-full border border-secondary/30 bg-card/90 backdrop-blur-sm shadow-lg shadow-black/50 z-10">
                  {/* Sparkles icon */}
                  <Sparkles className="w-4 h-4 mr-2 text-tertiary drop-shadow-[0_0_4px_rgba(98,170,222,0.6)]" />
                  {/* Badge text */}
                  <span className="text-sm font-semibold tracking-wider uppercase text-foreground drop-shadow-lg">
                    Get in Touch
                  </span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                Let's Start a <span className="text-secondary">Conversation</span>
              </h1>
              <p className="text-lg text-muted-foreground md:px-12">
                We're eager to understand your business challenges and explore how we can help. Let's connect and create something amazing together.
              </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <motion.div
                className="flex-1 w-full lg:w-3/5"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="group relative h-full overflow-hidden border border-secondary/20 bg-card/20 backdrop-blur-xl hover:border-secondary/30 hover:bg-card/30 transition-all duration-500 shadow-lg shadow-black/50">
                  <CardHeader className="pb-6 relative">
                    <div className="mb-8 flex overflow-x-auto no-scrollbar">
                      {[
                        { id: "general", label: "General Inquiry" },
                        { id: "business", label: "Business Partnership" },
                        { id: "support", label: "Technical Support" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-4 py-2 mr-2 whitespace-nowrap rounded-full text-sm font-medium transition-all ${activeTab === tab.id
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-card/30 text-foreground/70 hover:bg-card/40 border border-secondary/20"
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-6">
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {activeTab === "general" && "Tell us about your project"}
                          {activeTab === "business" && "Partner with us"}
                          {activeTab === "support" && "Get technical assistance"}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {activeTab === "general" && "Fill out the form below and we'll get back to you within 24 hours."}
                          {activeTab === "business" && "Interested in becoming a partner? Let us know how we can collaborate."}
                          {activeTab === "support" && "Facing technical issues? Describe your problem and our team will assist you."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                            Name <span className="text-primary">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-card/30 backdrop-blur-sm border border-secondary/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary/40 focus:bg-card/40 transition-all"
                            placeholder="Your full name"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                            Email <span className="text-primary">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-card/30 backdrop-blur-sm border border-secondary/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary/40 focus:bg-card/40 transition-all"
                            placeholder="your.email@example.com"
                          />
                        </div>

                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formValues.company}
                            onChange={handleChange}
                            className="w-full bg-card/30 backdrop-blur-sm border border-secondary/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary/40 focus:bg-card/40 transition-all"
                            placeholder="Your company name"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formValues.phone}
                            onChange={handleChange}
                            className="w-full bg-card/30 backdrop-blur-sm border border-secondary/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary/40 focus:bg-card/40 transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>

                        {activeTab === "general" && (
                          <div className="md:col-span-2">
                            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                              Subject <span className="text-primary">*</span>
                            </label>
                            <input
                              type="text"
                              id="subject"
                              name="subject"
                              value={formValues.subject}
                              onChange={handleChange}
                              required={activeTab === "general"}
                              className="w-full bg-card/30 backdrop-blur-sm border border-secondary/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary/40 focus:bg-card/40 transition-all"
                              placeholder="What is your inquiry about?"
                            />
                          </div>
                        )}

                        {(activeTab === "business" || activeTab === "support") && (
                          <div className="md:col-span-2">
                            <label htmlFor="service" className="block text-sm font-medium text-foreground mb-1">
                              {activeTab === "business" ? "Partnership Type" : "Issue Category"} <span className="text-primary">*</span>
                            </label>
                            <select
                              id="service"
                              name="service"
                              value={formValues.service}
                              onChange={handleChange}
                              required={activeTab === "business" || activeTab === "support"}
                              className="w-full bg-card/30 backdrop-blur-sm border border-secondary/20 rounded-lg px-4 py-3 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary/40 focus:bg-card/40 transition-all"
                            >
                              {activeTab === "business" && (
                                <>
                                  <option value="" disabled>
                                    Select partnership type
                                  </option>
                                  <option value="reseller">Reseller Partnership</option>
                                  <option value="technology">Technology Partner</option>
                                  <option value="implementation">Implementation Partner</option>
                                  <option value="consulting">Consulting Partner</option>
                                  <option value="other">Other</option>
                                </>
                              )}
                              {activeTab === "support" && (
                                <>
                                  <option value="" disabled>
                                    Select issue type
                                  </option>
                                  <option value="installation">Installation/Setup</option>
                                  <option value="error">Error/Bug</option>
                                  <option value="performance">Performance Issue</option>
                                  <option value="upgrade">Upgrade Assistance</option>
                                  <option value="integration">Integration Problem</option>
                                  <option value="other">Other</option>
                                </>
                              )}
                            </select>
                          </div>
                        )}

                        <div className="md:col-span-2">
                          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                            Message <span className="text-primary">*</span>
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formValues.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full bg-card/30 backdrop-blur-sm border border-secondary/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary/40 focus:bg-card/40 transition-all resize-none"
                            placeholder={
                              activeTab === "general"
                                ? "Tell us about your project, goals, and requirements..."
                                : activeTab === "business"
                                  ? "Describe how you'd like to partner with us..."
                                  : "Please describe the issue you're experiencing in detail..."
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {formStatus === "error" && (
                          <p className="text-sm text-destructive">
                            Could not send message. Check configuration and try again.
                          </p>
                        )}
                        <button
                          type="submit"
                          disabled={formStatus === "submitting" || formStatus === "success"}
                          className={`group relative overflow-hidden px-6 py-3 rounded-lg font-medium text-primary-foreground transition-all ${formStatus === "submitting" || formStatus === "success"
                              ? "bg-muted cursor-not-allowed"
                              : "bg-secondary hover:brightness-110"
                            }`}
                        >
                          {formStatus === "submitting"
                            ? "Sending..."
                            : formStatus === "success"
                              ? "Message Sent!"
                              : "Send Message"}
                          <span className="absolute inset-0 h-full w-full bg-white/30 scale-0 rounded-lg transition-all group-active:scale-100 opacity-0 group-active:opacity-100 duration-300" />
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                className="flex-1 w-full lg:w-2/5 space-y-8"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="group relative h-full overflow-hidden border border-secondary/20 bg-card/20 backdrop-blur-xl hover:border-secondary/30 hover:bg-card/30 transition-all duration-500 shadow-lg shadow-black/50">
                  <CardHeader className="pb-6 relative">
                    <CardTitle className="text-xl text-card-foreground group-hover:text-secondary transition-colors duration-300">
                      Connect With Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-6">
                    {[
                      {
                        title: "Email Us",
                        value: "nikhilg@autonexai360.com",
                        icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )
                      },
                      {
                        title: "Call Us",
                        value: "+91 99307 69905",
                        icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        )
                      },
                      {
                        title: "Visit Us",
                        value: (
                          <>
                            Saki Vihar Rd, Opposite Mtnl Off, Tunga Village, Chandivali, Powai,
                            <br />
                            Mumbai, Maharashtra 400072
                          </>
                        ),
                        icon: (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                          {item.icon}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-muted-foreground">{item.title}</h4>
                          <p className="text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}

                    <div className="mt-8 pt-6 border-t border-secondary/20">
                      <h4 className="text-sm font-medium text-muted-foreground mb-4">Follow Us</h4>
                      <div className="flex space-x-4">
                        {[
                          {
                            name: "LinkedIn",
                            url: "https://www.linkedin.com/company/autonex-ai/posts/?feedView=all",
                            icon: (
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            ),
                          },
                        ].map((platform, index) => (
                          <a
                            key={index}
                            href={platform.url}
                            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-secondary/20 hover:text-secondary transition-colors"
                            aria-label={`Follow us on ${platform.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {platform.icon}
                          </a>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative h-full overflow-hidden border border-secondary/20 bg-card/20 backdrop-blur-xl hover:border-secondary/30 hover:bg-card/30 transition-all duration-500 shadow-lg shadow-black/50">
                  <CardHeader className="pb-6 relative">
                    <CardTitle className="text-xl text-card-foreground group-hover:text-secondary transition-colors duration-300">
                      Our Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-6">
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted relative">
                      <iframe
                        className="w-full h-full absolute inset-0 rounded-lg"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.116099205!2d72.74109995!3d19.0822508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1620030700000!5m2!1sen!2sin"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Office Location Map"
                      />
                    </div>
                    <div className="mt-6 pt-4 border-t border-secondary/20">
                      <h4 className="text-sm font-medium text-muted-foreground mb-4">Business Hours</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monday - Friday</span>
                          <span className="text-foreground">9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saturday</span>
                          <span className="text-foreground">10:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sunday</span>
                          <span className="text-foreground">Closed</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>



            <div className="relative w-full min-h-[50vh] flex items-center justify-center overflow-hidden mt-32">
              <div className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, hsl(var(--background)/0.1) 15%, hsl(var(--card)/0.2) 30%, hsl(220, 73%, 33%, 0.15) 50%, hsl(220, 73%, 33%, 0.3) 75%, hsl(220, 73%, 33%, 0.5) 100%)"
                }}
              />
              <div className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(45deg, transparent 0%, hsl(220, 73%, 33%, 0.05) 50%, transparent 100%)",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 100%)"
                }}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-hsl(var(--background)) to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(60%_100%_at_50%_100%,hsl(220, 73%, 33%, 0.15),transparent_70%)]" />

              <motion.div
                className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative mx-auto p-10 md:p-14">
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
                    Stay <span className="text-secondary">Updated</span>
                  </h2>
                  <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                    Subscribe to our newsletter to receive the latest updates, insights,
                    and news about our services and technologies.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 text-white/80">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span>No spam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span>Unsubscribe anytime</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span>Max twice a month</span>
                    </div>
                  </div>

                  <div className="flex w-full max-w-md mx-auto items-center space-x-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-grow bg-zinc-900/70 backdrop-blur-sm border border-secondary/40 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary/70 focus:border-secondary/70 shadow-xl focus:shadow-2xl transition-all duration-300"
                    />
                    <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105">
                      Subscribe
                    </button>
                  </div>

                  <p className="text-sm text-white/60 mt-4 max-w-md mx-auto text-left">
                    By subscribing, you agree to our <a href="#" className="text-secondary hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 h-24" style={{
                background: "linear-gradient(180deg, transparent 0%, hsl(var(--background)/0.6) 50%, hsl(var(--background)/0.3) 100%)",
                clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)"
              }} />
            </div>
          </div>
        </div>
      </main>
      <Footer hideCta />
    </div>
  );
}

const FaqAccordion = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "What services do you offer?", a: "Precision-driven multimodal annotation for physical AI—expert labeling across computer vision, sensor fusion, and more to power your training pipeline with quality-controlled data." },
    { q: "How long does a project typically take?", a: "Project timelines vary based on complexity and scope, but we always aim for efficient delivery." },
    { q: "What is your pricing model?", a: "We offer flexible pricing models, including fixed-price and time & materials, tailored to your project needs." },
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-secondary/20 rounded-lg">
          <button
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
            className="w-full flex justify-between items-center p-4 text-left text-foreground hover:bg-black/20 transition-colors"
          >
            <span className="font-medium">{faq.q}</span>
            <span className="text-secondary text-xl">{openFaq === index ? '-' : '+'}</span>
          </button>
          {openFaq === index && (
            <div className="p-4 border-top border-secondary/20 text-muted-foreground bg-card/10">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};