import { Box, Stack } from "@mui/material";
import LockIcon from "../../../components/svgs/LockIcon";
import Text from "../../../components/Text";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { newsletterValidation } from "../../../utils/validation";
import axios from "../../../api/axios";
import { notify } from "../../../utils/Index";

export default function Password() {
  const navigate = useNavigate();

  const initialValues = { email: "" };

  const handleSubmit = (values, actions) => {
    actions.setSubmitting(true);
    axios
      .post(`/api/auth/password/request-reset`, { email: values.email })
      .then(() => {
        notify("Password reset email sent", "success");
        navigate(
          `/reset-password/email/sent/${encodeURIComponent(values.email)}`
        );
      })
      .catch((err) => {
        notify(
          err.response?.data?.error || "Unable to send reset email",
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
            Forgot password?
          </Text>
          <Text fw="400" fs="16px" color="#475467">
            No worries, we’ll send you reset instructions.
          </Text>

          <Formik
            initialValues={initialValues}
            validationSchema={newsletterValidation}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form style={{ width: "100%" }}>
                <Stack spacing={2}>
                  <Input
                    width="100%"
                    label="Email"
                    name="email"
                    required={true}
                    placeholder="Enter your email"
                    aria-label="enter your email"
                  />
                  <Button
                    loading={isSubmitting}
                    width="100%"
                    heigh="44px"
                    type="submit"
                    variant="contained"
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
