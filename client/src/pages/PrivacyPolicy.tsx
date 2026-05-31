import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const sections = [
  {
    title: "1. Introduction",
    content: `Autonex AI Pvt. Ltd. ("Autonex AI", "we", "us", or "our") is committed to protecting your privacy and the privacy of your organisation's operational data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our industrial AI products and services, including V.I.G.I.L, WIL, Digital Twin, and AI ERP / eBMR (collectively, "Services").

By using our Services, you agree to the collection and use of information in accordance with this Policy. If you do not agree, please discontinue use of the Services.`,
  },
  {
    title: "2. Information We Collect",
    content: `We collect the following categories of information:

Operational Data: Video feeds, sensor readings, machine telemetry, production logs, weighment data, inventory movements, and ERP transaction records processed by our products.

Account Information: Name, email address, job title, company name, and contact details of users and administrators.

Usage Data: Logs of interactions with our software dashboards, feature usage statistics, error reports, and performance metrics.

Device and Network Data: IP addresses, browser type, operating system, and device identifiers used to access our web-based interfaces.`,
  },
  {
    title: "3. How We Use Your Information",
    content: `We use collected information to:

(a) Provide, operate, and maintain the Services you have subscribed to.
(b) Process and analyse your operational data to generate AI-driven insights, alerts, and recommendations.
(c) Monitor and improve the performance, accuracy, and reliability of our AI models.
(d) Send you technical notices, updates, security alerts, and administrative messages.
(e) Respond to your comments, questions, and requests for support.
(f) Comply with applicable laws, regulations, and legal obligations.
(g) Prevent fraud, abuse, and security incidents.

We do not sell your data to third parties. We do not use your operational camera feeds or production data for advertising purposes.`,
  },
  {
    title: "4. Data Processing and Storage",
    content: `Edge Processing: Where technically feasible, Autonex AI processes video and sensor data locally on hardware deployed at your facility. Raw video streams are not transmitted to Autonex AI's cloud infrastructure.

Cloud Storage: Aggregated metrics, alerts, model outputs, and anonymised performance data may be stored on secure cloud infrastructure (AWS, Google Cloud, or equivalent providers) in data centres located in India or as specified in your service agreement.

Retention: Operational data is retained for the period specified in your service agreement, typically 90 days for video-derived data and up to 7 years for ERP-related records to meet statutory requirements. After the retention period, data is securely deleted or anonymised.`,
  },
  {
    title: "5. Data Security",
    content: `We implement industry-standard technical and organisational measures to protect your data against unauthorised access, alteration, disclosure, or destruction. These include:

Encryption at rest (AES-256) and in transit (TLS 1.2+) for all data transferred to our cloud infrastructure. Role-based access controls limiting employee access to customer data on a need-to-know basis. Regular security assessments and penetration testing of our platform. Audit logging of all access to customer data. Multi-factor authentication for administrative access.

No method of electronic transmission or storage is 100% secure. If you believe your data has been compromised, please contact us immediately at security@autonexai360.com.`,
  },
  {
    title: "6. Data Sharing and Disclosure",
    content: `We do not sell, trade, or rent your personal or operational data to third parties. We may share information in the following limited circumstances:

Service Providers: We engage trusted third-party vendors (such as cloud infrastructure providers and analytics tools) who process data on our behalf under strict data processing agreements.

Legal Requirements: We may disclose information when required by law, court order, or government authority, or when necessary to protect the rights, property, or safety of Autonex AI, our customers, or the public.

Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our assets, customer data may be transferred as part of that transaction, subject to the same privacy protections.

Aggregated Analytics: We may share anonymised, aggregated industry benchmarks that do not identify any individual or organisation.`,
  },
  {
    title: "7. Your Rights",
    content: `Depending on your location and applicable law, you may have the following rights regarding your data:

Access: Request a copy of personal data we hold about your users.
Correction: Request correction of inaccurate or incomplete data.
Deletion: Request deletion of personal data, subject to legal retention obligations.
Portability: Request your data in a structured, machine-readable format.
Objection: Object to certain processing activities.
Restriction: Request we restrict processing in specific circumstances.

To exercise any of these rights, please contact us at privacy@autonexai360.com. We will respond within 30 days. Note that these rights apply to personal data about individuals; operational production and factory data is governed by your service agreement.`,
  },
  {
    title: "8. Cookies and Tracking",
    content: `Our web-based dashboards and marketing website use cookies and similar tracking technologies to:

Maintain your session and authentication state. Remember your preferences and settings. Analyse usage patterns to improve user experience. Monitor platform performance.

Essential cookies cannot be disabled as they are required for the Services to function. You may disable analytics cookies through your browser settings or our cookie preference centre. We do not use third-party advertising cookies.`,
  },
  {
    title: "9. Children's Privacy",
    content: `Our Services are designed for use by industrial businesses and are not directed at individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected such information, please contact us and we will promptly delete it.`,
  },
  {
    title: "10. Third-Party Integrations",
    content: `Our Services integrate with third-party ERP systems (SAP, Oracle, Tally, and others) and may connect to your existing CCTV infrastructure, weighing scales, and IoT sensors. This Policy does not cover the data practices of these third-party systems. Please review the privacy policies of your existing software and hardware providers.`,
  },
  {
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or applicable law. We will notify you of material changes by posting the new policy on our website with an updated effective date, and where required by law, by sending email notification. Your continued use of the Services after changes are posted constitutes your acceptance of the updated Policy.`,
  },
  {
    title: "12. Governing Law",
    content: `This Privacy Policy is governed by the laws of India, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra, India.`,
  },
  {
    title: "13. Contact Us",
    content: `For any privacy-related questions, concerns, or requests, please contact our Data Protection Officer:

Autonex AI Pvt. Ltd.
Attn: Privacy Team
Email: query@autonexai360.com
General: nikhilg@autonexai360.com
Website: www.autonexai360.com

We aim to respond to all privacy enquiries within 5 business days.`,
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ background: "var(--background, #060d1f)", minHeight: "100vh" }}>
      <Header />

      {/* Hero */}
      <section
        className="relative pt-40 pb-16 text-center px-4 overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(22,55,145,0.12) 0%, transparent 100%)" }}
      >
        {/* Glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, left: "50%", transform: "translateX(-50%)",
            width: "60%", height: 320,
            background: "radial-gradient(ellipse at 50% 0%, rgba(98,170,222,0.14) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
            style={{ background: "rgba(98,170,222,0.1)", border: "1px solid rgba(98,170,222,0.25)", color: "#62AADE" }}
          >
            Legal
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-5"
            style={{ letterSpacing: "-0.025em" }}
          >
            Privacy Policy
          </h1>
          <p className="text-base text-white/50 max-w-xl mx-auto">
            Last updated: May 2025 &nbsp;·&nbsp; Effective immediately
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 pb-32">
        {/* Intro box */}
        <div
          className="rounded-2xl p-6 mb-10"
          style={{ background: "rgba(98,170,222,0.06)", border: "1px solid rgba(98,170,222,0.15)" }}
        >
          <p className="text-white/70 text-sm leading-relaxed">
            Your privacy matters. Autonex AI is an industrial AI company. We process factory video feeds,
            sensor data, and production telemetry to power our products — not to build ad profiles.
            This policy explains exactly what we collect, how we use it, and the controls you have.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2
                className="text-lg font-black text-white mb-3"
                style={{ letterSpacing: "-0.01em" }}
              >
                {s.title}
              </h2>
              <div
                className="h-px mb-4"
                style={{ background: "linear-gradient(to right, rgba(98,170,222,0.3), transparent)" }}
              />
              <p className="text-white/60 text-[14px] leading-relaxed whitespace-pre-line">
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer hideCta />
    </div>
  );
}
