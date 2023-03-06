import ReactDOM from "react-dom";
import AdminLayout from "./components/layout/Admin.js";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "theme/theme.js";

ReactDOM.render(
  <ChakraProvider theme={theme} resetCss={false} position="relative">
    <AdminLayout />
  </ChakraProvider>,
  document.getElementById("root")
);
