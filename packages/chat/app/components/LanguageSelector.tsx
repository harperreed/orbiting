import React from 'react';
import { View } from 'react-native';
import { List, RadioButton, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LanguageCode, changeLanguage } from '../i18n/config';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language as LanguageCode;
  const theme = useTheme();

  const handleLanguageChange = (language: LanguageCode) => {
    changeLanguage(language);
  };

  return (
    <List.Section>
      <List.Item
        title={t('language')}
        description="Choose your preferred language"
        left={props => <List.Icon {...props} icon="translate" />}
      />
      {SUPPORTED_LANGUAGES.map(({ code, label }) => (
        <List.Item
          key={code}
          title={label}
          left={props => (
            <RadioButton
              {...props}
              value={code}
              status={currentLanguage === code ? 'checked' : 'unchecked'}
            />
          )}
          onPress={() => handleLanguageChange(code)}
          style={{ paddingLeft: 16 }}
        />
      ))}
    </List.Section>
  );
}
