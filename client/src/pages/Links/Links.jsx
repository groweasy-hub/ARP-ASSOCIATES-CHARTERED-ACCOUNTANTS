import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faBuildingColumns,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";

import {
  DottedDecor,
  HeroContent,
  HeroDescription,
  HeroTitle,
  LinkTable,
  LinkTableCard,
  LinkTableHeader,
  LinksHero,
  LinksPage,
  TableIcon,
} from "./Links.styles";

const governmentLinks = [
  ["Central board of Direct Taxes", "https://www.incometaxindia.gov.in/pages/default.aspx"],
  ["Central board of Indirect Taxes & Customs", "https://www.cbic.gov.in"],
  ["Ministry of Corporate Affairs", "https://www.mca.gov.in/content/mca/global/en/home.html"],
  ["Provident Fund", "https://www.epfindia.gov.in/site_en/index.html"],
  ["Employee State Insurance Corporation", "https://www.esic.nic.in/"],
  ["GST", "https://www.gst.gov.in/"],
  ["Reserve Bank of India", "https://www.rbi.org.in"],
  ["Securities Exchange Board of India", "https://www.sebi.gov.in/"],
  ["Direct Taxes E-Filing", "https://www.incometax.gov.in/iec/foportal"],
  ["National Securities Depositories Ltd", "https://www.nsdl.co.in/"],
  ["Central Depository Services (India) Ltd", "https://www.cdslindia.com/"],
  ["Comptroller and Auditor General of India", "https://cag.gov.in/en"],
  ["Government e-Marketplace (GeM)", "https://gem.gov.in/"],
];

const professionalLinks = [
  ["Bombay Chartered Accountant's Society", "https://www.bcasonline.org/"],
  ["Institute of Chartered Accountants of India", "https://www.icai.org/"],
  ["Institute of Company Secretaries of India", "https://www.icsi.edu/home/"],
  ["Institute of Cost Accountants of India", "https://icmai.in/icmai/index.html"],
  ["The Information System Audit & Control Association", "https://www.isaca.org/"],
  ["Central Indian Regional Council of India (ICAI)-CIRC", "https://circ.icai.org/"],
  ["Eastern Indian Regional Council of India (ICAI)-EIRC", "https://eirc-icai.org/home.php"],
  ["Western Indian Regional Council of India (ICAI)-WIRC", "https://www.wirc-icai.org/"],
  ["Southern Indian Regional Council of India (ICAI)-SIRC", "http://www.sirc-icai.org/"],
  ["Northern Indian Regional Council of India (ICAI)-NIRC", "https://nirc.icai.org/"],
];

function ResourceTable({ icon, title, items }) {
  return (
    <LinkTableCard>
      <LinkTableHeader>
        <TableIcon aria-hidden="true">
          <FontAwesomeIcon icon={icon} />
        </TableIcon>
        <h2>{title}</h2>
      </LinkTableHeader>

      <LinkTable>
        <thead>
          <tr>
            <th>#</th>
            <th>Organization</th>
            <th>Website</th>
            <th aria-label="Open link" />
          </tr>
        </thead>
        <tbody>
          {items.map(([name, url], index) => (
            <tr key={name}>
              <td>{index + 1}.</td>
              <td>{name}</td>
              <td>
                <a href={url} target="_blank" rel="noreferrer">
                  {url}
                </a>
              </td>
              <td>
                <a href={url} target="_blank" rel="noreferrer" aria-label={`Open ${name}`}>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </LinkTable>
    </LinkTableCard>
  );
}

function Links() {
  return (
    <LinksPage aria-labelledby="links-title">
      <LinksHero>
        <DottedDecor $position="left" aria-hidden="true" />
        <DottedDecor $position="right" aria-hidden="true" />
        <HeroContent>
          <HeroTitle id="links-title">Links to external websites</HeroTitle>
          <HeroDescription>
            Useful links to Government Bodies and Professional Bodies for quick
            access to important resources.
          </HeroDescription>
        </HeroContent>
      </LinksHero>

      <ResourceTable
        icon={faBuildingColumns}
        title="Government Bodies"
        items={governmentLinks}
      />
      <ResourceTable
        icon={faPeopleGroup}
        title="Professional Bodies"
        items={professionalLinks}
      />
    </LinksPage>
  );
}

export default Links;
