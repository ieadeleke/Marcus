import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import Button from '../Button';
import Text from '../Text';
import axios from '../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/UserReducer';
import { useI18n } from '../../utils/I18n.jsx';

export function DisputeFlows({ compileSelectedItems, setType }) {
  const [flows, setFlows] = useState({ pre: [], phase: [] });
  const [loading, setLoading] = useState(false);
  const user = useSelector((s) => s.user.details);
  const dispatch = useDispatch();
  const { t } = useI18n();

  useEffect(() => {
    axios.get('/api/disputes/flows').then(({ data }) => setFlows(data)).catch(() => setFlows({ pre: [], phase: [] }));
  }, []);

  const createFromFlow = async (flowKey) => {
    setLoading(true);
    try {
      const selectedItems = compileSelectedItems ? compileSelectedItems() : { disputes: [], accounts: [], personalInfo: [], inquiries: { EQF: [], EXP: [], TUC: [] } };
      await axios.post('/api/disputes/start', { userId: user._id, flowKey, selectedItems });
      // Refresh user to include new letters
      const { data: me } = await axios.get('/api/auth/me');
      dispatch(setUser(me.user));
      setType('attacks');
    } catch (e) {
      // no-op, UI toast can be added
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ title, items }) => (
    <Box sx={{ mb: 4 }}>
      <Text fs="18px" fw="700" color="#131C30" sx={{ mb: 1 }}>{title}</Text>
      <Stack spacing={1}>
        {items.map((f, idx) => (
          <Stack key={idx} direction="row" alignItems="center" spacing={2}>
            <Text fs="16px" fw="500" color="#131C30">{f.name}</Text>
            <Button variant="contained" loading={loading} onClick={() => createFromFlow(f.key)}>{t('flows.create_letter','Create Letter')}</Button>
          </Stack>
        ))}
      </Stack>
    </Box>
  );

  return (
    <Box>
      <Section title={t('flows.pre_dispute','Pre – Dispute Letters')} items={flows.pre || []} />
      <Section title={t('flows.dispute_phase','Dispute Phase')} items={flows.phase || []} />
    </Box>
  );
}
