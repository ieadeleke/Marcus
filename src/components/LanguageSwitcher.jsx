import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher({ size = 'small' }) {
  const [lang, setLang] = useState('en');
  useEffect(() => {
    try {
      const stored = localStorage.getItem('app_lang');
      setLang(stored || 'en');
    } catch (_) {}
  }, []);
  const handleChange = (_e, value) => {
    if (!value) return;
    try { localStorage.setItem('app_lang', value); } catch (_) {}
    setLang(value);
    // Reload to make i18n provider pick guest lang for anonymous users
    window.location.reload();
  };
  return (
    <ToggleButtonGroup exclusive size={size} value={lang} onChange={handleChange} aria-label="Language selector">
      <ToggleButton value="en" aria-label="English">EN</ToggleButton>
      <ToggleButton value="es" aria-label="Spanish">ES</ToggleButton>
    </ToggleButtonGroup>
  );
}

