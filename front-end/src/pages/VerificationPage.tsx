import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import OtpInput from "react-otp-input";
import useAuthStore from "../store/useAuthStore";
import { useEffect, useState } from "react";

const VerificationPage = () => {
  const [otp, setOtp] = useState("");
  const {
    emailVerificationMessage,
    isVerifyingEmail,
    isSendingEmailCode,
    getEmailCode,
    verifyEmail,
  } = useAuthStore() as any;

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (otp.length === 5) {
      verifyEmail(otp);
      setOtp("");
    }
  }, [otp, verifyEmail]);

  useEffect(() => {
    if (cooldown > 0) {
      setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
    }
  }, [cooldown, setCooldown]);

  const getCode = async () => {
    await getEmailCode();
    setCooldown(60);
  };

  return (
    <section>
      <Box
        display="flex"
        width="100vw"
        height="100vh"
        borderRadius={1}
        justifyContent="center"
        alignItems="center"
      >
        <Box padding={10} border="solid 1px" borderColor="grey.800">
          <Stack gap={4} textAlign="center">
            <Stack gap={1}>
              <Typography fontWeight="bold" fontSize={25}>
                Email Verification
              </Typography>
              <Typography color="text.secondary">
                {emailVerificationMessage}
              </Typography>
            </Stack>
            <Stack gap={3} alignItems="center">
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
                  <input disabled={isVerifyingEmail} {...val} />
                )}
              />
              <Typography color="text.secondary">
                Didn't recieve code
              </Typography>
              <Button
                disabled={
                  isSendingEmailCode || isVerifyingEmail || cooldown > 0
                }
                onClick={() => getCode()}
                variant="outlined"
              >
                {isSendingEmailCode ? (
                  <Stack
                    width={100}
                    direction="row"
                    gap={2}
                    alignItems="center"
                  >
                    Sending
                    <CircularProgress color="inherit" size={16} />
                  </Stack>
                ) : cooldown > 0 ? (
                  <Stack direction="row" gap={1}>
                    <Typography>Resend In {cooldown}</Typography>
                  </Stack>
                ) : (
                  "Resend Code"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </section>
  );
};

export default VerificationPage;
