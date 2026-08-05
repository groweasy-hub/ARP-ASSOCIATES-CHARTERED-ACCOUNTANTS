import { Outlet } from "react-router-dom";

import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import ScrollReveal from "../components/ScrollReveal/ScrollReveal";
import { MainContent, SiteShell } from "./MainLayout.styles";

function MainLayout() {
  return (
    <SiteShell>
      <Header />
      <MainContent>
        <ScrollReveal />
        <Outlet />
      </MainContent>
      <Footer />
    </SiteShell>
  );
}

export default MainLayout;
