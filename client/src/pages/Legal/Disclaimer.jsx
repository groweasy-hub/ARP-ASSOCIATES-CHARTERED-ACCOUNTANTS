import LegalPage from "./LegalPage";

const sections = [
  {
    title: "General Information Only",
    body: "The information on this website is provided for general awareness and should not be considered professional advice for your specific facts or circumstances.",
  },
  {
    title: "No Substitute For Advice",
    body: "Tax, audit, accounting, compliance, and business advisory matters depend on individual circumstances and applicable law. Please consult us directly before acting on any information from this website.",
  },
  {
    title: "Accuracy And Updates",
    body: "We make reasonable efforts to keep website information accurate, but laws, regulations, and professional standards may change. We do not guarantee that all content is complete, current, or error-free at all times.",
  },
  {
    title: "External Links",
    body: "This website may contain links to third-party websites or resources. ARP Associates is not responsible for their content, availability, policies, or accuracy.",
  },
  {
    title: "Professional Relationship",
    body: "Viewing this website or contacting us through it does not automatically create a client, advisor, or professional relationship.",
  },
];

export default function Disclaimer() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="Please read this disclaimer before relying on any information published on the ARP Associates website."
      sections={sections}
    />
  );
}
