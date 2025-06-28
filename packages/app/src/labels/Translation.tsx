'use client';

import { ReactNode, useMemo, useState } from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';

import translation_deDE from './de-DE.json';
import translation_enUS from './en-US.json';

export enum Languages {
  en_US = 'en-US',
  de_DE = 'de-DE',
}

const translations = {
  'en-US': translation_enUS,
  'de-DE': translation_deDE,
};

const flattenTranslation = (labels: any): Record<string, string> => {
  const ret: Record<string, string> = {};
  const keys = Object.keys(labels);
  keys.forEach(k => {
    if (typeof labels[k] === 'object') {
      const children = flattenTranslationKey(labels[k], k);
      const childKeys = Object.keys(children);
      childKeys.forEach(c => (ret[c] = children[c]));
    } else {
      ret[k] = labels[k];
    }
  });
  return ret;
};

const flattenTranslationKey = (
  labels: any,
  parentKey: string
): { [key: string]: string } => {
  const ret: { [key: string]: string } = {};
  const keys = Object.keys(labels);
  keys.forEach(k => {
    const newKey = `${parentKey}.${k}`;
    if (typeof labels[k] === 'object') {
      const children = flattenTranslationKey(labels[k], newKey);
      const childKeys = Object.keys(children);
      childKeys.forEach(c => (ret[c] = children[c]));
    } else {
      ret[newKey] = labels[k];
    }
  });
  return ret;
};

export interface TranslationProps {
  children: ReactNode;
}

export const Translation = ({ id }: { id: string }) => {
  return <FormattedMessage id={id} />;
};

export const TranslationManager = ({ children }: TranslationProps) => {
  const [lang] = useState<Languages>(() => Languages.en_US);
  const labels = useMemo(() => flattenTranslation(translations[lang]), [lang]);

  return (
    <IntlProvider locale={lang} messages={labels}>
      {children}
    </IntlProvider>
  );
};
