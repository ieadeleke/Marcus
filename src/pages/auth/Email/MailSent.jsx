import { Box, Stack } from "@mui/material";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import { useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import MailIcon from "../../../components/svgs/MailIcon";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";
import { notify } from "../../../utils/Index";

export default function MailSent() {
  const [sendMailBtn, setSendMailBtn] = useState(false);
  const { email: emailParam } = useParams();
  const email = decodeURIComponent(emailParam || "");

  const handleResend = async () => {
    if (!email) return;
    setSendMailBtn(true);
    try {
      await axios.post(`/api/auth/password/request-reset`, { email });
      notify("Password reset email resent", "success");
    } catch (err) {
      notify(err.response?.data?.error || "Failed to resend email", "error");
    } finally {
      setSendMailBtn(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={10}>
      <Box sx={{ mx: "auto" }} width={{ xs: "343px", sm: "360px" }}>
        <Stack spacing={3} justifyContent="center" alignItems="center">
          <MailIcon />

          <Text fw="550" fs="30px" color="#131C30">
            Check your email
          </Text>
          <Text fw="400" fs="16px" color="#475467" sx={{ textAlign: "center" }}>
            We sent a password reset link to {email || "your email"}
          </Text>
          <Button
            loading={false}
            width="100%"
            heigh="44px"
            type="button"
            variant="contained"
            onClick={() => {
              if (email) {
                window.location.href = `mailto:${email}`;
              }
            }}
          >
            Open email app
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
              {sendMailBtn ? "Resending..." : "Click to resend"}
            </Text>
          </Box>
          <Button
            sx={{ color: "#475467" }}
            width="100%"
            heigh="44px"
            type="button"
            startIcon={<ArrowBack />}
            to="/login"
          >
            Back to log in
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
