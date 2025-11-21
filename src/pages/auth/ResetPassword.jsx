import { Box, Stack } from "@mui/material";
import LockIcon from "../../components/svgs/LockIcon";
import Text from "../../components/Text";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { ArrowBack } from "@mui/icons-material";
import { Formik, Form } from "formik";
import { passwordValidation } from "../../utils/validation";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import { notify } from "../../utils/Index";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { email: emailParam } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailFromQuery = searchParams.get("email");
  const email = emailFromQuery || emailParam || "";

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = (values, actions) => {
    actions.setSubmitting(true);
    const payload = {
      email,
      token,
      newPassword: values.password,
    };
    axios
      .post("/api/auth/password/reset", payload)
      .then(() => {
        notify("Password reset successful", "success");
        navigate(`/reset-password/${encodeURIComponent(email)}/success`);
      })
      .catch((err) => {
        notify(
          err.response?.data?.error || "Invalid or expired reset link",
          "error"
        );
      })
      .finally(() => {
        actions.setSubmitting(false);
      });
  };

  return (
    <Box display="flex" justifyContent="center" mt={10}>
      <Box sx={{ mx: "auto" }} width={{ xs: "343px", sm: "360px" }}>
        <Stack spacing={3} justifyContent="center" alignItems="center">
          <LockIcon />

          <Text fw="550" fs="30px" color="#131C30">
            Set new password
          </Text>
          <Text fw="400" fs="16px" sx={{ textAlign: "center" }} color="#475467">
            Your new password must be different to previously used passwords.
          </Text>

          <Formik
            initialValues={initialValues}
            validationSchema={passwordValidation}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form style={{ width: "100%" }}>
                <Stack spacing={2}>
                  {(!token || !email) && (
                    <Text fw="400" fs="14px" color="#DD3333">
                      Reset link is missing or invalid. Request a new email.
                    </Text>
                  )}
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    required={true}
                    placeholder="Enter your password"
                    aria-label="enter your password"
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    required={true}
                    placeholder="Enter your password"
                    aria-label="enter your password"
                  />
                  <Button
                    loading={isSubmitting}
                    width="100%"
                    heigh="44px"
                    type="submit"
                    variant="contained"
                    disabled={!token || !email}
                  >
                    Get Started
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>

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
