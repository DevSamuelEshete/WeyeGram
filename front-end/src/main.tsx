import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

import { BrowserRouter } from "react-router-dom";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
