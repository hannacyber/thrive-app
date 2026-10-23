// Original THRIVE drink illustrations — generic objects (cups, cans, a bean, a donut)
// in THRIVE's own colors. No logos, wordmarks, mascots or brand colors (Guideline 5.2).
// Prototype + preview lives outside the app; this file is the shipped copy.
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';
import { alpha } from '../theme/tokens';
import type { BrandId } from '../data/drinks';

type Fill = 'c' | 'c2' | 'c3' | 'w' | 'none';
type El =
  | ['path', string, Fill, (Fill | null)?, number?, (string | null)?, 'evenodd'?]
  | ['circle', number, number, number, Fill]
  | ['rect', number, number, number, number, number, Fill];

export const BADGE_HUES: Record<BrandId, string> = {
  starbucks: '#C77C3C',
  peets: '#5E5CE6',
  dutch: '#00A99D',
  dunkin: '#8E5CF7',
  mcd: '#2F9BD6',
  panera: '#FF6B6B',
  bluebottle: '#30B565',
  cbtl: '#E0A000',
  boba: '#AF52DE',
  energy: '#FF8A00',
  soda: '#E8336D',
  generic: '#64748B',
  happylemon: '#7FB52A',
  chicha: '#C2547A',
  tigersugar: '#3E7BFA',
  kungfu: '#1FA37A',
  gongcha: '#C86FB0',
};

const ART: Record<BrandId, El[]> = {
  starbucks: [
    ['path', 'M15 19h18l-2.2 21.2a2.4 2.4 0 0 1-2.4 2.1h-8.8a2.4 2.4 0 0 1-2.4-2.1z', 'c2'],
    ['path', 'M16.2 26h15.6l-1.4 14.2a2.4 2.4 0 0 1-2.4 2.1h-8a2.4 2.4 0 0 1-2.4-2.1z', 'c'],
    ['path', 'M13.5 19.5a10.5 9 0 0 1 21 0z', 'c2'],
    ['rect', 12.5, 18, 23, 3.4, 1.7, 'c'],
    ['path', 'M26 15 30 4.5', 'none', 'c', 2.6],
    ['path', 'M17 22.5c2.2-1.6 4.4 1.2 7 0s4.6-1.6 7 0', 'none', 'w', 1.8],
    ['circle', 21, 33, 1.6, 'w'],
    ['circle', 26.5, 36, 1.3, 'w'],
  ],
  peets: [
    ['path', 'M15.5 20h17l-2 20.4a2.4 2.4 0 0 1-2.4 2.1h-8.2a2.4 2.4 0 0 1-2.4-2.1z', 'c'],
    ['rect', 13.5, 16.6, 21, 4.4, 2, 'c2'],
    ['path', 'M17.2 28h13.6l-.5 5H17.7z', 'w'],
    ['path', 'M20 13c-1.6-1.8 1.6-3.2 0-5.2M24.5 13c-1.6-1.8 1.6-3.2 0-5.2M29 13c-1.6-1.8 1.6-3.2 0-5.2', 'none', 'c2', 2],
  ],
  dutch: [
    ['path', 'M14 14h20l-2.6 26.2a2.4 2.4 0 0 1-2.4 2.1h-10a2.4 2.4 0 0 1-2.4-2.1z', 'c3'],
    ['path', 'M15.4 22h17.2l-1.8 18.2a2.4 2.4 0 0 1-2.4 2.1h-8.8a2.4 2.4 0 0 1-2.4-2.1z', 'c'],
    ['rect', 18, 24.5, 6, 6, 1.4, 'w'],
    ['rect', 24.5, 29.5, 5.5, 5.5, 1.4, 'w'],
    ['rect', 13, 12.4, 22, 3.2, 1.6, 'c'],
    ['path', 'M27 12.5 31.5 4', 'none', 'c', 2.6],
  ],
  dunkin: [
    ['path', 'M24 10a15 15 0 1 1 0 30 15 15 0 1 1 0-30zM24 20a5 5 0 1 0 0 10 5 5 0 1 0 0-10z', 'c2', null, 0, null, 'evenodd'],
    ['path', 'M24 12a13 13 0 0 1 12.7 10.2c-.9 2.6-3.2 1.4-4.6 3-1.6 1.8-.2 4.5-2.8 5.4-2.3.8-3.4-1.6-5.3-1.6s-3 2.4-5.3 1.6c-2.6-.9-1.2-3.6-2.8-5.4-1.4-1.6-3.7-.4-4.6-3A13 13 0 0 1 24 12zM24 18.6a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 1 0 0-12.8z', 'c', null, 0, null, 'evenodd'],
    ['path', 'M17 17.5l2 1.2M28.5 15.5l-1.6 1.6M32 21.5l-2.2-.2M20.5 14.5l.4 2', 'none', 'w', 1.8],
  ],
  mcd: [
    ['path', 'M15 18h18l-2.2 22.2a2.4 2.4 0 0 1-2.4 2.1h-8.8a2.4 2.4 0 0 1-2.4-2.1z', 'c2'],
    ['path', 'M15.9 25.5h16.2l-1 10H16.9z', 'c'],
    ['rect', 13, 14, 22, 4.6, 2.3, 'c'],
    ['path', 'M18.5 14c.6-2.4 2.6-3.6 5.5-3.6s4.9 1.2 5.5 3.6', 'c2'],
    ['path', 'M19.5 30.5h9', 'none', 'w', 1.8],
  ],
  panera: [
    ['path', 'M12 17h20v15a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z', 'c'],
    ['path', 'M32 21h2.5a4.5 4.5 0 0 1 0 9H32', 'none', 'c', 3],
    ['path', 'M22 17V10.5', 'none', 'c2', 1.6],
    ['rect', 18.5, 22, 7, 8, 1.6, 'w'],
    ['path', 'M10 42.5h24', 'none', 'c2', 2.6],
  ],
  bluebottle: [
    ['path', 'M15 18 19 10h10l4 8z', 'c2'],
    ['rect', 21, 6.5, 6, 4, 1, 'c'],
    ['rect', 15, 18, 18, 24, 2.6, 'c'],
    ['path', 'M15 18h18', 'none', 'w', 1.6],
    ['path', 'M24 24.5c2.6 3.2 3.8 5 3.8 6.7a3.8 3.8 0 0 1-7.6 0c0-1.7 1.2-3.5 3.8-6.7z', 'w'],
  ],
  cbtl: [
    ['path', 'M24 8c8.6 0 14 7.2 14 16s-5.4 16-14 16-14-7.2-14-16S15.4 8 24 8z', 'c', null, 0, 'rotate(-28 24 24)'],
    ['path', 'M24 9.5c-3.6 4.2-3.6 8.8 0 13.6s3.6 9.6 0 15.2', 'none', 'w', 2.4, 'rotate(-28 24 24)'],
  ],
  boba: [
    ['path', 'M15 19h18l-2.2 21.2a2.4 2.4 0 0 1-2.4 2.1h-8.8a2.4 2.4 0 0 1-2.4-2.1z', 'c2'],
    ['path', 'M15.8 25h16.4l-1.6 15.2a2.4 2.4 0 0 1-2.4 2.1h-8.4a2.4 2.4 0 0 1-2.4-2.1z', 'c'],
    ['rect', 13, 17.4, 22, 3.6, 1.8, 'c'],
    ['path', 'M25 17.5 28.5 5', 'none', 'c', 4],
    ['circle', 20, 38.5, 1.9, 'w'],
    ['circle', 24.5, 39.2, 1.9, 'w'],
    ['circle', 28.6, 37.6, 1.9, 'w'],
    ['circle', 22, 35, 1.9, 'w'],
    ['circle', 26.6, 34.6, 1.9, 'w'],
  ],
  energy: [
    ['rect', 15, 8, 18, 34, 4, 'c'],
    ['rect', 16.5, 6, 15, 3.2, 1.6, 'c2'],
    ['path', 'M25.8 14.5 19.6 26h4.6l-2 9.5 6.4-12.2h-4.7z', 'w'],
  ],
  soda: [
    ['rect', 14, 18, 20, 24, 4, 'c'],
    ['rect', 15.5, 16, 17, 3.2, 1.6, 'c2'],
    ['path', 'M14 25h20M14 35h20', 'none', 'w', 1.6],
    ['circle', 20, 10.5, 2.2, 'c2'],
    ['circle', 26, 7.5, 1.6, 'c2'],
    ['circle', 29, 12, 1.2, 'c2'],
  ],
  happylemon: [
    ['path', 'M14 20h18l-2.2 20.2a2.4 2.4 0 0 1-2.4 2.1h-8.8a2.4 2.4 0 0 1-2.4-2.1z', 'c2'],
    ['path', 'M15.1 28h15.8l-1.3 12.2a2.4 2.4 0 0 1-2.4 2.1h-8.4a2.4 2.4 0 0 1-2.4-2.1z', 'c'],
    ['rect', 12.5, 18.4, 21, 3.4, 1.7, 'c'],
    ['circle', 33.5, 15.5, 8, 'c'],
    ['circle', 33.5, 15.5, 6, 'w'],
    ['path', 'M33.5 10v11M28.5 15.5h10M30 12l7 7M37 12l-7 7', 'none', 'c2', 1.3],
    ['path', 'M21 18.5 23.5 6', 'none', 'c', 2.6],
  ],
  chicha: [
    ['path', 'M14 14h20l-2.6 26.2a2.4 2.4 0 0 1-2.4 2.1h-10a2.4 2.4 0 0 1-2.4-2.1z', 'c'],
    ['rect', 13, 12, 22, 3.6, 1.8, 'c2'],
    ['path', 'M17.5 34.5c0-7.4 5-12.5 13.5-12.5 0 7.4-5 12.5-13.5 12.5z', 'w'],
    ['path', 'M18.5 33.5c3-3.6 6.4-6.6 10.6-9.6', 'none', 'c', 1.6],
    ['path', 'M18 6.5c-1.4 1.6 1.4 2.8 0 4.4M23 6.5c-1.4 1.6 1.4 2.8 0 4.4', 'none', 'c2', 1.8],
  ],
  tigersugar: [
    ['path', 'M14.5 20h19l-2.4 20.2a2.4 2.4 0 0 1-2.4 2.1h-9.4a2.4 2.4 0 0 1-2.4-2.1z', 'c'],
    ['path', 'M13 20.5c0-3.4 2.6-5.5 5.4-5.5 1-2.4 3.2-3.6 5.6-3.6s4.6 1.2 5.6 3.6c2.8 0 5.4 2.1 5.4 5.5z', 'w'],
    ['path', 'M13 20.5c0-3.4 2.6-5.5 5.4-5.5 1-2.4 3.2-3.6 5.6-3.6s4.6 1.2 5.6 3.6c2.8 0 5.4 2.1 5.4 5.5z', 'none', 'c2', 1.4],
    ['circle', 20, 37, 2, 'w'],
    ['circle', 24.6, 38.2, 2, 'w'],
    ['circle', 29, 36.6, 2, 'w'],
    ['circle', 22.2, 33, 2, 'c2'],
    ['circle', 27, 32.6, 2, 'c2'],
    ['path', 'M27 12 30.5 4', 'none', 'c', 3.2],
  ],
  kungfu: [
    ['path', 'M10 24h28c0 8.6-6.2 14.5-14 14.5S10 32.6 10 24z', 'c'],
    ['path', 'M13 23c.8-4.6 5.4-7.4 11-7.4s10.2 2.8 11 7.4z', 'c2'],
    ['rect', 21.5, 11.6, 5, 4.4, 2.2, 'c'],
    ['path', 'M15 41.5h18', 'none', 'c2', 3],
    ['path', 'M12.6 27.6h22.8', 'none', 'w', 1.8],
    ['path', 'M17 9.5c-1.3-1.5 1.3-2.6 0-4.2M31 9.5c-1.3-1.5 1.3-2.6 0-4.2', 'none', 'c2', 1.8],
  ],
  gongcha: [
    ['path', 'M14.5 16h19l-2.6 24.2a2.4 2.4 0 0 1-2.4 2.1h-9a2.4 2.4 0 0 1-2.4-2.1z', 'c'],
    ['path', 'M14.5 16h19l-.9 8.4H15.4z', 'w'],
    ['path', 'M15.4 24.4c2.6 1.6 4.6-1 7.2.4s4.8 1.2 7.6-.4c1-.6 1.6-.4 2.4 0', 'none', 'c2', 1.6],
    ['rect', 13, 13, 22, 3.4, 1.7, 'c2'],
    ['path', 'M21 13 18 4.5', 'none', 'c', 2.6],
    ['circle', 20.5, 36.5, 1.7, 'w'],
    ['circle', 25.5, 37.5, 1.7, 'w'],
  ],
  generic: [
    ['path', 'M11 16h22v14a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z', 'c'],
    ['path', 'M33 20h2.4a4.6 4.6 0 0 1 0 9.2H33', 'none', 'c', 3],
    ['path', 'M22 32.5s-5-3-5-6.3a2.7 2.7 0 0 1 5-1.4 2.7 2.7 0 0 1 5 1.4c0 3.3-5 6.3-5 6.3z', 'w'],
    ['path', 'M17 12c-1.4-1.6 1.4-2.8 0-4.6M23 12c-1.4-1.6 1.4-2.8 0-4.6', 'none', 'c2', 2],
  ],
};

export function BrandBadge({ brand, size = 56 }: { brand: BrandId; size?: number }) {
  const t = useTheme();
  const hue = BADGE_HUES[brand];
  const dark = t.scheme === 'dark';
  const color = (f: Fill | null | undefined) =>
    f === 'c' ? hue : f === 'c2' ? alpha(hue, 0.45) : f === 'c3' ? alpha(hue, 0.22) : f === 'w' ? (dark ? 'rgba(255,255,255,0.92)' : '#FFFFFF') : 'none';
  const gid = `bb-${brand}-${t.scheme}`;
  const art = size * 0.74;
  return (
    <View style={{ width: size, height: size }} accessible={false}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id={gid} x1="0" y1="0" x2="0.6" y2="1">
            <Stop offset="0" stopColor={hue} stopOpacity={dark ? 0.32 : 0.18} />
            <Stop offset="1" stopColor={hue} stopOpacity={dark ? 0.14 : 0.07} />
          </LinearGradient>
        </Defs>
        <Rect width={size} height={size} rx={size * 0.3} fill={`url(#${gid})`} />
      </Svg>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={art} height={art} viewBox="0 0 48 48">
          {ART[brand].map((e, i) => {
            if (e[0] === 'circle') return <Circle key={i} cx={e[1]} cy={e[2]} r={e[3]} fill={color(e[4])} />;
            if (e[0] === 'rect') return <Rect key={i} x={e[1]} y={e[2]} width={e[3]} height={e[4]} rx={e[5]} fill={color(e[6])} />;
            const [, d, f, s, sw, tr, fr] = e;
            return (
              <Path
                key={i}
                d={d}
                fill={color(f)}
                fillRule={fr ?? 'nonzero'}
                stroke={s ? color(s) : undefined}
                strokeWidth={sw || undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={tr ?? undefined}
              />
            );
          })}
        </Svg>
      </View>
    </View>
  );
}
