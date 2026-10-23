import { Alert, Linking } from 'react-native';
import type { Strings } from '../i18n/en';

/** Opens a URL without crashing if nothing can handle it (e.g. no Mail app set up). */
export async function openLink(url: string, s?: Strings) {
  try {
    await Linking.openURL(url);
  } catch {
    const mail = url.startsWith('mailto:');
    const target = mail ? url.slice(7) : url;
    const title = s ? s.common.couldntOpen : 'Couldn’t open link';
    const body = mail ? (s ? s.common.emailUs(target) : `Email us at ${target}`) : target;
    Alert.alert(title, body);
  }
}
