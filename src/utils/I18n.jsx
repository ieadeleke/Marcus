import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';

const I18nContext = createContext({ t: (k, f) => f || k, lang: 'en' });

export function I18nProvider({ children }) {
  const user = useSelector((s) => s.user.details);
  const guestLang = (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('app_lang') : null;
  const lang = user?.language || guestLang || 'en';
  const [dict, setDict] = useState({});

  useEffect(() => {
    let active = true;
    axios
      .get(`/api/i18n/translations?lang=${lang}`)
      .then(({ data }) => {
        if (active) setDict(data || {});
      })
      .catch(() => setDict({}));
    return () => {
      active = false;
    };
  }, [lang]);

  const t = useMemo(
    () => (key, fallback) => {
      const parts = key.split('.');
      let cur = dict;
      for (const p of parts) {
        cur = cur?.[p];
        if (cur == null) return fallback ?? key;
      }
      if (typeof cur === 'string') return cur;
      return fallback ?? key;
    },
    [dict]
  );

  const value = useMemo(() => ({ t, lang }), [t, lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
