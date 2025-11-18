import { useEffect, useRef, useState } from 'react';
import { Box, Stack, TextField, IconButton, Tooltip } from '@mui/material';
import { KeyboardVoice as MicIcon, StopCircle as StopIcon } from '@mui/icons-material';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import axios from '../../../api/axios';
import { useSelector } from 'react-redux';
import { useI18n } from '../../../utils/I18n.jsx';

export default function Chat() {
  const user = useSelector((s) => s.user.details);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! How can I help with your credit today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const listRef = useRef(null);
  const recognitionRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const { t } = useI18n();

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/chat', {
        message: msg,
        language: user?.language || 'en',
      });
      setUsingFallback(Boolean(data?._fallback));
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || '...' }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I had trouble answering. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Voice recognition not supported in this browser.' }]);
        return;
      }
      const rec = new SpeechRecognition();
      rec.lang = (user?.language || 'en') === 'es' ? 'es-ES' : 'en-US';
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.onresult = (event) => {
        let txt = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          txt += event.results[i][0].transcript;
        }
        setInput(txt);
      };
      rec.onend = () => {
        setRecording(false);
        // Auto-send if we have content
        if (input && input.trim().length > 0) {
          sendMessage();
        }
      };
      recognitionRef.current = rec;
      setRecording(true);
      rec.start();
    } catch (_) {
      setRecording(false);
    }
  };

  const stopVoice = () => {
    try {
      recognitionRef.current?.stop();
    } catch (_) {}
    setRecording(false);
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <Box bgcolor="#fff" p={3} borderRadius={2}>
      <Text fs="22px" fw="600" color="#131C30" sx={{ mb: 2 }}>{t('chat.title','Chat with AI')}</Text>
      {usingFallback && (
        <Box sx={{ mb: 1, p: 1, borderRadius: 1, bgcolor: '#FEF3C7', color: '#92400E' }}>
          <Text fs="12px" fw="500" color="#92400E">
            AI not configured or temporarily unavailable. Showing local guidance.
          </Text>
        </Box>
      )}
      <Box ref={listRef} sx={{ height: 400, overflowY: 'auto', border: '1px solid #eee', p: 2, borderRadius: 1 }}>
        {messages.map((m, i) => (
          <Stack key={i} alignItems={m.role === 'user' ? 'flex-end' : 'flex-start'} sx={{ mb: 1 }}>
            <Box sx={{ bgcolor: m.role === 'user' ? '#FFEDD5' : '#F3F4F6', color: '#111827', p: 1.2, borderRadius: 1.5, maxWidth: '70%' }}>
              <Text fs="14px" fw="400" color="#111827" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{m.content}</Text>
            </Box>
          </Stack>
        ))}
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
        <TextField fullWidth placeholder={t('chat.placeholder','Type your question...')} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}/>
        <Tooltip title={recording ? 'Stop' : 'Voice input'}>
          <IconButton color={recording ? 'error' : 'default'} onClick={recording ? stopVoice : startVoice}>
            {recording ? <StopIcon /> : <MicIcon />}
          </IconButton>
        </Tooltip>
        <Button variant="contained" onClick={sendMessage} loading={loading}>{t('chat.send','Send')}</Button>
      </Stack>
      <Text fs="12px" fw="400" color="#6B7280" sx={{ mt: 1 }}>
        {t('chat.disclaimer','This is general guidance, not legal advice.')}
      </Text>
    </Box>
  );
}
