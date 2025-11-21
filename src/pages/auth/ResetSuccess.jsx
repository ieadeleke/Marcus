import { Box, Stack } from "@mui/material";



import Button from "../../components/Button";
import { useState } from "react";
import { ArrowBack } from "@mui/icons-material";

import CheckSuccessIcon from "../../components/svgs/CheckSuccessIcon";
import Text from "../../components/Text";
import axios from "../../api/axios";
import { notify } from "../../utils/Index";
import { useParams } from "react-router-dom";

export default function ResetSuccess() {
  const [sendMailBtn, setSendMailBtn] = useState(false);
  const [resending, setResending] = useState(false);
  const { email: emailParam } = useParams();
  const email = decodeURIComponent(emailParam || "");

  const handleResend = async () => {
    if (!email) return;
    try {
      setResending(true);
      await axios.post(`/api/auth/password/request-reset`, { email });
      notify("Password reset email resent", "success");
    } catch (err) {
      notify(err.response?.data?.error || "Failed to resend email", "error");
    } finally {
      setResending(false);
    }
  };
  return (
    <Box display="flex" justifyContent="center" component="form" mt={10}>
      <Box sx={{ mx: "auto" }} width={{ xs: "343px", sm: "360px" }}>
        <Stack spacing={3} justifyContent="center" alignItems="center">
          <CheckSuccessIcon />

          <Text fw="550" fs="30px" color="#131C30">
            Password reset
          </Text>
          <Text fw="400" fs="16px" color="#475467" sx={{ textAlign : 'center' }}>
            Your password has been successfully reset. Click below to log in magically.
          </Text>
          <Button
            loading={sendMailBtn}
            width="100%"
            heigh="44px"
            type="button"
            to="/login"
            variant="contained"
          >
            Continue
          </Button>
          <Box display="flex">
            <Text
              sx={{ textAlign: "center" }}
              color="#475467"
              fs="14px"
              fw="400"
            >
              Didn’t receive the email?
            </Text>
            <Text
              background="linear-gradient(180deg, #FF8934 0%, #FF3CD4 100%)"
              fs="14px"
              fw="700"
              onClick={handleResend}
              sx={{
                textAlign: "center",
                marginLeft: 1,
                color: "#FF9D43",
                cursor: "pointer",
              }}
            >
              {resending ? "Resending..." : "Click to resend"}
            </Text>
          </Box>
          <Button
            sx={{ color: "#475467" }}
            width="100%"
            heigh="44px"
            type="button"
            startIcon={<ArrowBack />}
          >
            Back to log in
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
