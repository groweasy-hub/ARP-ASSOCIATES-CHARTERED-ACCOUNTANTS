import LegalPage from "./LegalPage";

const sections = [
  {
    title: "Use Of This Website",
    body: "By using this website, you agree to use it only for lawful purposes and in a manner that does not disrupt, damage, or impair the website or its availability.",
  },
  {
    title: "No Professional Engagement By Website Use",
    body: "Accessing this website, submitting a form, or reading content does not create a client relationship. A professional engagement begins only after mutual acceptance and applicable documentation.",
  },
  {
    title: "Website Content",
    body: "Content on this website is provided for general information. While we aim to keep information accurate and current, it should not be treated as specific accounting, tax, audit, legal, or financial advice.",
  },
  {
    title: "Intellectual Property",
    body: "Website content, branding, layout, text, and design elements belong to ARP Associates or are used with permission. You may not copy, republish, or commercially reuse them without prior consent.",
  },
  {
    title: "Limitation Of Liability",
    body: "ARP Associates is not liable for losses arising from reliance on general website content, temporary unavailability, external links, or technical issues outside our reasonable control.",
  },
];

export default function TermsOfUse() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="These terms govern your use of the ARP Associates website and its publicly available content."
      sections={sections}
    />
  );
}
