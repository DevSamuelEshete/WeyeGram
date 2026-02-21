import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import useAuthStore from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OtpInput from "react-otp-input";

const VerifyPassCodePage = () => {
  const {
    getResetCode,
    resetCodeMessage,
    isGettingResetCode,
    verifyResetCode,
    resetCodeVerified,
  } = useAuthStore() as any;

  const navigate = useNavigate();

  const { email } = useParams();
  const [otp, setOtp] = useState("");

  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (otp.length !== 5) return;
    verifyResetCode(otp);
  }, [otp]);

  useEffect(() => {
    if (!resetCodeVerified) return;
    navigate("/reset-password");
  }, [resetCodeVerified]);

  useEffect(() => {
    if (cooldown > 0) {
      setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
    }
  }, [cooldown, setCooldown]);

  const getCode = () => {
    getResetCode(email);
    setCooldown(60);
  };

  return (
    <section>
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          padding={10}
          border="solid 1px"
          borderColor="grey.800"
          borderRadius={1}
          textAlign="center"
          width="100%"
          maxWidth={750}
        >
          <Stack alignItems="center" gap={2}>
            <Stack>
              <Typography fontSize={25} fontWeight="bold">
                Verify Reset Code
              </Typography>
              <Typography color="text.secondary">
                {resetCodeMessage || "Sending code ..."}
              </Typography>
            </Stack>
            <Stack>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={5}
                inputStyle={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  width: "50px",
                  height: "50px",
                  fontSize: "2rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
                renderInput={(val) => (
                  <input disabled={isGettingResetCode} {...val} />
                )}
              />
            </Stack>
            <Typography color="text.secondary">Didn't receive code?</Typography>
            <Button
              disabled={isGettingResetCode || cooldown > 0}
              variant="outlined"
              onClick={() => getCode()}
            >
              {isGettingResetCode ? (
                <Stack gap={1} direction="row">
                  <Typography>Sending Code</Typography>
                  <CircularProgress color="inherit" size={20} />
                </Stack>
              ) : cooldown > 0 ? (
                <Stack direction="row" gap={1}>
                  <Typography>Resend In</Typography>
                  {cooldown}
                </Stack>
              ) : (
                "Resend Code"
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    </section>
  );
};

export default VerifyPassCodePage;
