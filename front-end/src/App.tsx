import NavBar from "./components/NavBar";

import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

import VerificationPage from "./pages/VerificationPage";

import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

import { Toaster } from "react-hot-toast";
import SettingsPage from "./pages/SettingsPage";

import VerifyPassCodePage from "./pages/VerifyPassCodePage";
import GetResetCodePage from "./pages/GetResetCodePage";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const {
    fetchUser,
    isFetchingUser,
    authUser,
    isEmailVerified,
    resetCodeMessage,
    resetCodeVerified,
  } = useAuthStore() as any;

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  console.log("authUser: ", authUser);

  if (isFetchingUser && !authUser) {
    return (
      <section>
        <Box
          display="flex"
          height="100vh"
          width="100vw"
          overflow="hidden"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress color="inherit" size="2rem" />
        </Box>
      </section>
    );
  }

  return (
    <section>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            border: "1px solid #2c2c2cff",
            padding: "16px",
            color: "#ffff",
            background: "#141414ff",
          },
        }}
        position="top-center"
      />

      <NavBar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/email_verification"
          element={isEmailVerified ? <Navigate to="/" /> : <VerificationPage />}
        />
        <Route
          path="/login"
          element={
            authUser && isEmailVerified ? (
              <Navigate to="/" />
            ) : !isEmailVerified ? (
              <Navigate to="/email_verification" />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/signup"
          element={
            authUser && isEmailVerified ? (
              <Navigate to="/" />
            ) : !isEmailVerified ? (
              <Navigate to="/email_verification" />
            ) : (
              <SignUpPage />
            )
          }
        />
        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/get-reset-code/"
          element={authUser ? <Navigate to="/" /> : <GetResetCodePage />}
        />
        <Route
          path="/verify-reset-code/:email"
          element={
            !resetCodeMessage ? (
              <Navigate to="/get-reset-code/" />
            ) : (
              <VerifyPassCodePage />
            )
          }
        />
        <Route
          path="/reset-password"
          element={
            !resetCodeVerified ? (
              <Navigate to="/get-reset-code" />
            ) : (
              <ResetPassword />
            )
          }
        />
      </Routes>
    </section>
  );
};

export default App;
