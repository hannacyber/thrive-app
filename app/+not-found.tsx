import React from 'react';
import { useRouter } from 'expo-router';
import { useI18n } from '../src/i18n';
import { SheetHeader, SheetScreen } from '../src/ui/chrome';
import { Button, T } from '../src/ui/primitives';

/** Replaces expo-router's default "Unmatched route" screen (which links to a dev sitemap). */
export default function NotFound() {
  const router = useRouter();
  const { s } = useI18n();
  return (
    <SheetScreen presentation="push" header={<SheetHeader kind="back" onClose={() => router.replace('/')} closeLabel={s.common.back} />}>
      <T v="title1">{s.notFound.title}</T>
      <T v="body" tone="label2">
        {s.notFound.body}
      </T>
      <Button title={s.notFound.home} onPress={() => router.replace('/')} />
    </SheetScreen>
  );
}
