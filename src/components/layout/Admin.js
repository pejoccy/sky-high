import { Box } from "@chakra-ui/react";
import bgAdmin from "assets/img/admin-background.png";
import SuspenseLoader from "components/ui/suspense-loader/index.js";
import Dashboard from "../../pages/Dashboard.js";
import { useFetchData } from "../hooks/useFetchData.js";
import Footer from "../sections/Footer.js";
import MainPanel from "../sections/MainPanel";
import Navbar from "../sections/Navbar.js";
import PanelContainer from "../sections/PanelContainer";
import PanelContent from "../sections/PanelContent";

document.documentElement.dir = "ltr";

export default function DashboardLayout() {
  const { isLoading } = useFetchData();
  if (isLoading) {
    return (<SuspenseLoader />);
  }

  return (
    <Box>
      <Box
        minH="40vh"
        w="100%"
        position="absolute"
        bgImage={bgAdmin}
        bgSize="cover"
        top="0"
      />
      <MainPanel
        mw="lg"
        mx={{ xl: "200px" }}
      >
        <Navbar brandText="SkyHigh" />
        <PanelContent>
          <PanelContainer>
            <Dashboard />
          </PanelContainer>
        </PanelContent>
        <Footer />
      </MainPanel>
    </Box>
  );
}
