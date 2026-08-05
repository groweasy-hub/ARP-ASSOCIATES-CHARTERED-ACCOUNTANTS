import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingColumns, faGlobe, faRocket, faUsers } from "@fortawesome/free-solid-svg-icons";

import {
  ServeDivider,
  ServeGrid,
  ServeIcon,
  ServeItem,
  ServeSection,
  ServeTitle,
} from "./WhoWeServeSection.styles";

const audiences = [
  { label: "Startups", icon: faRocket },
  { label: "SMEs", icon: faUsers },
  { label: "Banks", icon: faBuildingColumns },
  { label: "Foreign Subsidiaries", icon: faGlobe },
];

function WhoWeServeSection() {
  return (
    <ServeSection aria-labelledby="who-serve-title">
      <ServeTitle id="who-serve-title">
        <strong>Who</strong> we serve
      </ServeTitle>
      <ServeDivider aria-hidden="true">
        <span />
        <span />
        <span />
      </ServeDivider>

      <ServeGrid>
        {audiences.map((audience) => (
          <ServeItem key={audience.label}>
            <ServeIcon aria-hidden="true">
              <FontAwesomeIcon icon={audience.icon} />
            </ServeIcon>
            <span>{audience.label}</span>
          </ServeItem>
        ))}
      </ServeGrid>
    </ServeSection>
  );
}

export default WhoWeServeSection;
