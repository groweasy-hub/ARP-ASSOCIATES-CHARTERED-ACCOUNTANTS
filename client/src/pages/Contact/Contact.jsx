import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faClock,
  faEnvelope,
  faHeadset,
  faLocationDot,
  faPaperPlane,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import {
  BranchCard,
  BranchGrid,
  ContactCard,
  ContactGrid,
  ContactHero,
  ContactPage,
  DottedDecor,
  FormGrid,
  FormPanel,
  FormStatus,
  HelpBand,
  HelpItem,
  HeroContent,
  HeroDescription,
  HeroTitle,
  IconCircle,
  InfoLine,
  MapCard,
  MapFrame,
  MapLocation,
  MapPanel,
  MessageMapGrid,
  SectionHeader,
  SectionIntro,
  SectionTitle,
  SubmitButton,
} from "./Contact.styles";

const initialFormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const API_ROOT = (
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");
const API_BASE = API_ROOT.endsWith("/api") ? API_ROOT : `${API_ROOT}/api`;

const contactCards = [
  { title: "Call Us", value: "+91 9032576131", icon: faPhone },
  { title: "Email Us", value: "arpassociateshyd@gmail.com", icon: faEnvelope },
  {
    title: "Hyderabad Branch Partner",
    value: "ANOOP KUMAR SHAH",
    meta: "Partner",
    phone: "+91 7013785840",
    icon: faUser,
  },
];

const branches = [
  {
    title: "Kolkata Branch",
    address: [
      "133/1A, Pushka Bhavan, SN Banerjee Road",
      "4th Floor, Kolkata - 700013.",
    ],
    partner: "ADHIR KUMAR PAUL",
    phone: "+91 9032576131",
    email: "arpkolkata@gmail.com",
  },
  {
    title: "Hyderabad Branch",
    address: [
      "1-11-122, Shyamlal Buildings, Begumpet,",
      "Hyderabad, Telangana - 500016.",
    ],
    partner: "ANOOP KUMAR SHAH",
    phone: "+91 7013785840",
    email: "arpassociateshyd@gmail.com",
  },
];

function Contact() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formStatus, setFormStatus] = useState({
    type: "idle",
    message: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus({ type: "loading", message: "" });

    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await res.json();
      if (data.success) {
        setFormValues(initialFormValues);
        setFormStatus({
          type: "success",
          message:
            "Thank you for reaching out! We have received your message and will get back to you shortly.",
        });
      } else {
        setFormStatus({
          type: "error",
          message: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setFormStatus({
        type: "error",
        message: "Unable to send message. Please try again later.",
      });
    }
  };

  return (
    <ContactPage aria-labelledby="contact-title">
      <ContactHero>
        <DottedDecor $position="left" aria-hidden="true" />
        <DottedDecor $position="right" aria-hidden="true" />
        <HeroContent>
          <HeroTitle id="contact-title">Get In Touch With Us</HeroTitle>
          <HeroDescription>
            We are here to help you. Reach out to us for any queries, assistance
            or professional support.
          </HeroDescription>
        </HeroContent>
      </ContactHero>

      <ContactGrid>
        {contactCards.map((item) => (
          <ContactCard key={item.title}>
            <IconCircle aria-hidden="true">
              <FontAwesomeIcon icon={item.icon} />
            </IconCircle>
            <h2>{item.title}</h2>
            <strong>{item.value}</strong>
            {item.meta && <span>{item.meta}</span>}
            {item.phone && <strong>{item.phone}</strong>}
          </ContactCard>
        ))}
      </ContactGrid>

      <SectionHeader>
        <SectionTitle>Our Branches</SectionTitle>
        <SectionIntro>
          We have a strong presence in two major cities to serve you better.
        </SectionIntro>
      </SectionHeader>

      <BranchGrid>
        {branches.map((branch) => (
          <BranchCard key={branch.title}>
            <IconCircle aria-hidden="true">
              <FontAwesomeIcon icon={faBuilding} />
            </IconCircle>
            <div>
              <h2>{branch.title}</h2>
              <InfoLine>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>
                  {branch.address.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </InfoLine>
              {branch.partner && (
                <>
                  <hr />
                  <InfoLine>
                    <FontAwesomeIcon icon={faUser} />
                    <span>
                      <small>Branch Partner</small>
                      <strong>{branch.partner}</strong>
                    </span>
                  </InfoLine>
                  <InfoLine>
                    <FontAwesomeIcon icon={faPhone} />
                    <strong>{branch.phone}</strong>
                  </InfoLine>
                  <InfoLine>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <strong>{branch.email}</strong>
                  </InfoLine>
                </>
              )}
            </div>
          </BranchCard>
        ))}
      </BranchGrid>

      <MessageMapGrid>
        <FormPanel as="form" onSubmit={handleSubmit}>
          <h2>Send Us a Message</h2>
          <p>Fill in the details below and we will get back to you shortly.</p>
          <FormGrid>
            <input
              aria-label="Your Name"
              name="name"
              placeholder="Your Name*"
              value={formValues.name}
              onChange={handleInputChange}
              required
            />
            <input
              aria-label="Your Email"
              name="email"
              type="email"
              placeholder="Your Email*"
              value={formValues.email}
              onChange={handleInputChange}
              required
            />
            <input
              aria-label="Your Phone Number"
              name="phone"
              type="tel"
              placeholder="Your Phone Number*"
              value={formValues.phone}
              onChange={handleInputChange}
              required
            />
            <input
              aria-label="Subject"
              name="subject"
              placeholder="Subject*"
              value={formValues.subject}
              onChange={handleInputChange}
              required
            />
            <textarea
              aria-label="Your Message"
              name="message"
              placeholder="Your Message*"
              value={formValues.message}
              onChange={handleInputChange}
              rows="6"
              required
            />
          </FormGrid>
          <SubmitButton type="submit" disabled={formStatus.type === "loading"}>
            <FontAwesomeIcon icon={faPaperPlane} />
            {formStatus.type === "loading" ? "Sending…" : "Send Message"}
          </SubmitButton>
          {formStatus.message && (
            <FormStatus $type={formStatus.type}>
              {formStatus.message}
            </FormStatus>
          )}
        </FormPanel>

        <MapPanel>
          <h2>Our Locations</h2>
          <MapCard>
            <MapFrame
              title="ARP Associates Kolkata and Hyderabad locations on Google Maps"
              src="https://www.google.com/maps?q=India&z=5&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <MapLocation $top="33%" $left="70%">
              <FontAwesomeIcon icon={faLocationDot} />
              <div>
                <h3>Kolkata Branch</h3>
                <p>
                  133/1A, Pushka Bhavan, SN Banerjee Road, 4th Floor, Kolkata -
                  700013.
                </p>
              </div>
            </MapLocation>
            <MapLocation $top="63%" $left="42%">
              <FontAwesomeIcon icon={faLocationDot} />
              <div>
                <h3>Hyderabad Branch</h3>
                <p>
                  1-11-122, Shyamlal Buildings, Begumpet, Hyderabad, Telangana -
                  500016.
                </p>
              </div>
            </MapLocation>
          </MapCard>
        </MapPanel>
      </MessageMapGrid>

      <HelpBand>
        <HelpItem>
          <IconCircle aria-hidden="true">
            <FontAwesomeIcon icon={faClock} />
          </IconCircle>
          <div>
            <h2>Office Hours</h2>
            <p>Monday - Saturday</p>
            <p>10:00 AM - 6:00 PM</p>
          </div>
        </HelpItem>
        <HelpItem>
          <IconCircle aria-hidden="true">
            <FontAwesomeIcon icon={faHeadset} />
          </IconCircle>
          <div>
            <h2>We&apos;re Here to Help</h2>
            <p>
              Our team is committed to providing you the best professional
              services and support.
            </p>
          </div>
        </HelpItem>
      </HelpBand>
    </ContactPage>
  );
}

export default Contact;
