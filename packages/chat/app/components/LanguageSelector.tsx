import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Menu, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LanguageCode, changeLanguage } from '../i18n/config';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const currentLanguage = i18n.language as LanguageCode;
  const theme = useTheme();

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);
  
  const handleLanguageChange = (language: LanguageCode) => {
    changeLanguage(language);
    setVisible(false);
  };

  return (
    <List.Section>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <List.Item
            title={t('language')}
            description={currentLang ? `${currentLang.flag}  ${currentLang.label}` : ''}
            left={props => <List.Icon {...props} icon="translate" />}
            onPress={() => setVisible(true)}
            right={props => <List.Icon {...props} icon="chevron-down" />}
          />
        }
      >
        {SUPPORTED_LANGUAGES.map(({ code, label, flag }) => (
          <Menu.Item
            key={code}
            onPress={() => handleLanguageChange(code)}
            title={
              <View style={styles.menuItem}>
                <Text>{flag}</Text>
                <Text style={styles.menuText}>{label}</Text>
              </View>
            }
            leadingIcon={currentLanguage === code ? 'check' : undefined}
          />
        ))}
      </Menu>
    </List.Section>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuText: {
    fontSize: 16,
  },
});
