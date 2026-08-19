import LegalPage from "./LegalPage";

const sections = [
  {
    title: "Information We Collect",
    body: "We may collect information you provide through contact forms, consultation requests, emails, phone calls, and professional engagements, including your name, contact details, business information, and documents needed to deliver our services.",
  },
  {
    title: "How We Use Information",
    items: [
      "To respond to enquiries and provide accounting, taxation, compliance, audit, and advisory services.",
      "To maintain client records, comply with legal obligations, and improve our service quality.",
      "To send service-related communication, reminders, updates, or requested information.",
    ],
  },
  {
    title: "Confidentiality And Security",
    body: "We treat client information as confidential and use reasonable administrative, technical, and operational safeguards to protect it from unauthorized access, misuse, disclosure, alteration, or loss.",
  },
  {
    title: "Information Sharing",
    body: "We do not sell personal information. We may share information only where required for service delivery, legal compliance, regulatory filings, professional support, or with your instruction or consent.",
  },
  {
    title: "Contact",
    body: "For privacy-related questions, contact ARP Associates at arpassociateshyd@gmail.com.",
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains how ARP Associates handles information shared with us through our website and professional services."
      sections={sections}
    />
  );
}
