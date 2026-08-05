import {
  faBullseye,
  faBuilding,
  faChartLine,
  faGlobe,
  faHandshake,
  faLocationDot,
  faPeopleGroup,
  faTrophy,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

export const teamStats = [
  { value: "30+", label: "Years of Experience", icon: faUserGroup },
  { value: "500+", label: "Clients Served", icon: faPeopleGroup },
  { value: "2+", label: "Countries", icon: faGlobe },
];

export const officeTeams = [
  {
    name: "Kolkata Team",
    address:
      "133/1A, Pushka Bhavan, SN Banerjee Road, 4th Floor, Kolkata - 700013.",
    icon: faBuilding,
    members: [
      {
        name: "CA. Deep Agarwal",
        role: "Chartered Accountant",
        initials: "DA",
        linkedIn: "#",
      },
      {
        name: "Rajender Agarwal",
        role: "Team Member",
        initials: "RA",
        linkedIn: "#",
      },
      {
        name: "Sandeep",
        role: "Team Member",
        initials: "S",
        linkedIn: "#",
      },
      {
        name: "Biswajeet Sathapathy",
        role: "Team Member",
        initials: "BS",
        linkedIn: "#",
      },
    ],
  },
  {
    name: "Hyderabad Team",
    address:
      "1-11-122, Shyamlal Buildings, Begumpet, Hyderabad, Telangana - 500016.",
    icon: faBuilding,
    members: [
      {
        name: "CA. Uday Kiran",
        role: "Chartered Accountant",
        initials: "UK",
        linkedIn: "#",
      },
      {
        name: "Sandeep Naidu.B",
        role: "Paid Assistant",
        initials: "SN",
        linkedIn: "#",
      },
      {
        name: "Lalita Kadiyam",
        role: "Accountant",
        initials: "LK",
        linkedIn: "#",
      },
    ],
  },
];

export const partners = [
  {
    name: "CA. Adhir kumar paul",
    role: "Founder & chairman",
    text: "Expert in audit and assurance with a strong focus on client success and sustainable growth.",
    initials: "Ak",
    image: "",
    linkedIn: "https://www.linkedin.com/",
  },
  {
    name: "CA. Anoop Kumar Shah",
    role: "Founder & Managing Partner",
    text: "Visionary leader with over a decade of experience in assurance, advisory and business consulting.",
    initials: "Ak",
    image: "./images/Anoop-kumar.jpg",
    linkedIn: "https://www.linkedin.com/in/anoop-kumar-shah-6318b9117/",
  },
];

export const values = [
  {
    title: "People First",
    text: "Our people are our greatest asset.",
    icon: faUser,
  },
  {
    title: "Integrity",
    text: "We uphold the highest standards of ethics.",
    icon: faBullseye,
  },
  {
    title: "Excellence",
    text: "We are committed to quality in everything we do.",
    icon: faTrophy,
  },
  {
    title: "Collaboration",
    text: "We believe in teamwork and mutual respect.",
    icon: faHandshake,
  },
  {
    title: "Growth Mindset",
    text: "We embrace change and continuous learning.",
    icon: faChartLine,
  },
];

export const locationIcon = faLocationDot;
