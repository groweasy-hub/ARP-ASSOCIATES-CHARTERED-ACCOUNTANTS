import { useLocation } from "react-router-dom";

import {
  ActionRow,
  Code,
  NotFoundCard,
  NotFoundPage,
  PrimaryLink,
  SecondaryLink,
  Text,
  Title,
} from "./NotFound.styles";

function NotFound() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <NotFoundPage $admin={isAdmin} aria-labelledby="not-found-title">
      <NotFoundCard>
        <Code>404</Code>
        <Title id="not-found-title">Page not found</Title>
        <Text>
          The page you entered does not exist or may have been moved. Use one of
          the links below to get back on track.
        </Text>
        <ActionRow>
          <PrimaryLink to={isAdmin ? "/admin/dashboard" : "/"}>
            {isAdmin ? "Go to Dashboard" : "Go Home"}
          </PrimaryLink>
          <SecondaryLink to={isAdmin ? "/admin/settings" : "/contact"}>
            {isAdmin ? "Open Settings" : "Contact Us"}
          </SecondaryLink>
        </ActionRow>
      </NotFoundCard>
    </NotFoundPage>
  );
}

export default NotFound;
