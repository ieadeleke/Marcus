import { Box } from '@mui/material';
import Text from '../../components/Text';
import { useI18n } from '../../utils/I18n.jsx';

export default function Privacy() {
  const { t } = useI18n();
  return (
    <Box bgcolor="#fff" p={4} borderRadius={2} mt={6}>
      <Text fs="28px" fw="600" color="#131C30">{t('legal.privacy_title','Privacy Policy')}</Text>
      <Text fs="14px" fw="400" color="#475467" sx={{ mt: 2 }}>
        {t('legal.privacy_body','We value your privacy. We collect only the data necessary to provide our services. You can export or delete your data anytime from account settings. We never sell personal information. For details on processing, security and retention, contact support.')}
      </Text>
    </Box>
  );
}

