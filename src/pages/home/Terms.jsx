import { Box } from '@mui/material';
import Text from '../../components/Text';
import { useI18n } from '../../utils/I18n.jsx';

export default function Terms() {
  const { t } = useI18n();
  return (
    <Box bgcolor="#fff" p={4} borderRadius={2} mt={6}>
      <Text fs="28px" fw="600" color="#131C30">{t('legal.terms_title','Terms of Service')}</Text>
      <Text fs="14px" fw="400" color="#475467" sx={{ mt: 2 }}>
        {t('legal.terms_body','By using this service, you agree that AI responses are for informational purposes only and not legal advice. You are responsible for verifying letters and actions. Subscriptions renew monthly unless canceled. See your billing page for details.')}
      </Text>
    </Box>
  );
}

