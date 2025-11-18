import { Box, Stack } from "@mui/material";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Text from "../../components/Text";
import { Form, Formik } from "formik";
import { newsletterValidation } from "../../utils/validation";
import { Link } from "react-router-dom";
import { useI18n } from "../../utils/I18n.jsx";

export default function Footer() {
  const { t } = useI18n();

  const initialValues ={
    email :''
  }
  const handleNewsLetter = (values, actions) => {};
  return (
    <Stack
      mt={10}
      direction={{ md: "row", xs: "column" }}
      justifyContent="space-between"
      alignItems="center"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={newsletterValidation}
        onSubmit={handleNewsLetter}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack
              direction={{ md: "row", xs: "column" }}
              spacing={1}
              alignItems="center"
            >
              <Input
                width="219px"
                name="email"
                placeholder="Enter you email"
                aria-label="enter your email"
              />
              <Button
                type="submit"
                loading={isSubmitting}
                height="44px" width="200px"
                rounded
                variant="contained"
              >
                {t('home.cta_get_started','Get Started')}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
      <Stack direction={{ md: "row", xs: "column" }} spacing={2} alignItems="center">
        <Text fw="400" fs="16px" color="#B7B7B7">© {new Date().getFullYear()} {t('legal.rights_reserved','All rights reserved.')}</Text>
        <Link to="/privacy" style={{ color: '#667085', textDecoration: 'none' }}>{t('legal.privacy_link','Privacy')}</Link>
        <Link to="/terms" style={{ color: '#667085', textDecoration: 'none' }}>{t('legal.terms_link','Terms')}</Link>
      </Stack>
    </Stack>
  );
}
