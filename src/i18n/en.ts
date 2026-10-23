// English — the source of truth. Every other locale must match this shape
// exactly (enforced by the `Strings` type), so a missing key fails `tsc`.
// Functions are used for anything with numbers/names so each language can
// handle plurals and word order its own way.

const en = {
  common: {
    appName: 'THRIVE',
    mg: 'mg',
    done: 'Done',
    cancel: 'Cancel',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    undo: 'Undo',
    delete: 'Delete',
    other: 'Other…',
    seeAll: 'See all',
    mgValue: (n: number) => `${n} mg`,
    logged: (name: string, mg: number) => `Logged ${name} · ${mg} mg`,
    couldntOpen: 'Couldn’t open link',
    emailUs: (email: string) => `Email us at ${email}`,
  },

  tabs: {
    home: 'Home',
    log: 'Log',
    tonight: 'Tonight',
    progress: 'Progress',
    tools: 'Tools',
  },

  home: {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    hey: (name: string) => `Hey, ${name}`,
    heyThere: 'Hey there',
    settings: 'Settings',
    todaySoFar: 'Today so far',
    ofGoal: (goal: number) => `of ${goal} mg goal`,
    overGoal: (over: number) => `${over} mg over today’s goal`,
    leftToday: (left: number) => `${left} mg left in today’s goal`,
    bedtimeTitle: 'At bedtime',
    bedtimeOk: 'On track for good sleep',
    bedtimeWarn: (mg: number) => `~${mg} mg may still be active`,
    streak: 'Streak',
    streakDays: (n: number) => (n === 1 ? '1 day' : `${n} days`),
    xpTo: (xp: number, rank: string) => `${xp} XP to ${rank}`,
    maxRank: 'Top rank reached',
    quickLog: 'Quick log',
    quickLogHint: 'Tap once to log it',
    more: 'More',
    sleepTitle: 'How did you sleep?',
    sleepSaved: 'Saved for today',
    sleepLabels: ['Rough', 'Meh', 'OK', 'Good', 'Great'],
    checkInTitle: 'Caffeine Check-In',
    checkInDesc: '9 quick questions to notice your habits. Private, not a diagnosis.',
    checkInLast: (score: number, max: number) => `Last score: ${score}/${max}`,
    checkInStart: 'Start',
  },

  log: {
    title: 'Log a drink',
    today: (mg: number) => `${mg} mg today`,
    again: 'Have it again?',
    whereFrom: 'Where’s it from?',
    drinksCount: (n: number) => (n === 1 ? '1 drink' : `${n} drinks`),
    tapSize: 'Tap the size you had',
    allBrands: 'All places',
    allSections: 'All',
    notListed: 'Not on the list? Add your own',
    addNamed: (q: string) => `Add “${q}” with your own mg`,
    searchPlaceholder: 'Search drinks — e.g. grande cold brew',
    searchLabel: 'Search all drinks',
    clearSearch: 'Clear search',
    noResults: 'No drinks match that search.',
    results: (n: number) => (n === 1 ? '1 match' : `${n} matches`),
    customTitle: 'Add your own drink',
    customName: 'Drink name (e.g. Thai iced tea)',
    customMg: 'Caffeine in mg (from the label or menu)',
    customSubmit: 'Log it',
    customHint: 'Check the can, bottle or the shop’s menu for the mg number.',
    loggedToday: 'Today’s drinks',
    nothingYet: 'Nothing logged yet today. Your first drink takes two taps.',
    dataSources: 'Where numbers come from',
    deleteEntry: (name: string) => `Delete ${name}`,
    logSize: (name: string, size: string, mg: number) => `Log ${name}, ${size}, ${mg} milligrams`,
    logAgain: (name: string, mg: number) => `Log ${name} again, ${mg} milligrams`,
    mixedSources: 'Mixed sources',
    estimateOnly: 'This shop doesn’t publish caffeine amounts — these are estimates for this type of drink, so check with the shop if you can.',
    sortedByYou: 'Sorted by what you log most',
  },

  tonight: {
    title: 'Tonight',
    subtitle: (time: string) => `Your bedtime: ${time}`,
    atBedtime: 'Caffeine at bedtime',
    estimate: 'Estimated with a 5-hour half-life',
    levelLow: 'Low — clearing well',
    levelModerate: 'Moderate — go lighter this afternoon',
    levelHigh: 'High — may make it hard to fall asleep',
    okTitle: 'On track for tonight',
    okDesc: (goal: number, time: string) => `Caffeine should drop under ${goal} mg by ${time}.`,
    overTitle: (goal: number) => `Over the ${goal} mg bedtime goal`,
    overDesc: (mg: number, time: string, goal: number) =>
      `About ${mg} mg may still be active at ${time} — more than ${goal} mg. That can make it harder to fall asleep and cut into deep sleep.`,
    overTip: 'Next time, have your last caffeine earlier — or try a swap from Tools.',
    lastCall: 'Last call times',
    lastCallDesc: 'The latest you could have each drink and still hit your bedtime goal.',
    fitsAnytime: 'Any time',
    windowPassed: 'Passed',
    by: (time: string) => `By ${time}`,
    timeline: 'Today’s timeline',
    targetBedtime: 'Target bedtime',
    windDown: 'Wind down and get ready for sleep',
    stillActive: (mg: number) => `~${mg} mg estimated still active`,
    pattern: 'Your pattern',
    patternNeedMore: 'Log at least 5 drinks and THRIVE will show when you usually have caffeine — worked out on this phone from your own logs.',
    patternResult: (count: number, total: number, period: string) =>
      `${count} of your last ${total} drinks (past 14 days) were in the ${period}.`,
    periods: { morning: 'morning', afternoon: 'afternoon', evening: 'evening' },
    periodTabs: { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' },
    tipsTitle: 'Tips by time of day',
  },

  progress: {
    title: 'Progress',
    subtitle: 'Just you — no comparisons',
    week: 'This week',
    dailyGoal: (n: number) => `${n} mg daily goal`,
    avgPerDay: 'avg mg / logged day',
    underGoal: 'logged days under goal',
    avgSleep: 'avg sleep rating',
    streakTitle: 'Tracking streak',
    streakDesc: (n: number) => (n === 1 ? '1 day in a row · last 14 days' : `${n} days in a row · last 14 days`),
    rankTitle: 'Rank',
    rankNote: 'Rank is based on your own XP only. Earn XP by logging drinks (+4) and doing the Check-In (+15, once a day).',
  },

  tools: {
    title: 'Tools',
    subtitle: 'Little things that help',
    items: {
      alt: { title: 'Swaps', desc: 'Lower-caffeine drinks that still hit' },
      breathe: { title: 'Breathe', desc: 'A 60-second reset' },
      distract: { title: 'Ride out a craving', desc: 'Quick distraction ideas' },
      habits: { title: 'Healthy habits', desc: 'Small changes that add up' },
      journal: { title: 'Journal', desc: 'Private notes on this phone' },
      article: { title: 'Why it matters', desc: 'The science, made simple' },
      sources: { title: 'Data sources', desc: 'Where every mg comes from' },
    },
  },

  breathe: {
    intro: 'A slow 4–4–6 pattern to bring your body down a notch.',
    ready: 'Ready',
    in: 'Breathe in',
    hold: 'Hold',
    out: 'Breathe out',
    start: 'Start',
    stop: 'Stop',
  },

  journal: {
    intro: 'Private notes — saved only on this phone.',
    placeholder: 'What’s today been like…',
    saved: 'Saved',
    saving: 'Saving…',
  },

  survey: {
    title: 'Caffeine Check-In',
    intro: 'How often did each of these happen in the last month? Your answers stay on this phone and are never used to diagnose.',
    question: (i: number, n: number) => `Question ${i} of ${n}`,
    prev: 'Previous',
    finish: 'See my result',
    resultTitle: 'Your result',
    outOf: (max: number) => `out of ${max}`,
    note: 'This is a reflection tool, not a medical test. If caffeine is affecting your sleep, mood or daily life, it’s worth talking to a parent, school counselor or doctor.',
    exploreTools: 'Explore tools',
    backHome: 'Back to Home',
  },

  settings: {
    title: 'Settings',
    profile: 'Profile',
    yourName: 'Your name',
    namePlaceholder: 'What should we call you?',
    nameNote: 'Stored only on this phone — used for greetings, nothing else.',
    schedule: 'Sleep',
    bedtime: 'Target bedtime',
    bedtimeNote: 'Tonight’s plan and last-call times use your target bedtime.',
    language: 'Language',
    systemLanguage: 'Same as phone',
    appearance: 'Appearance',
    themeSystem: 'Auto',
    themeLight: 'Light',
    themeDark: 'Dark',
    mascot: 'Mascot color',
    mascotColor: (i: number, n: number) => `Mascot color ${i} of ${n}`,
    privacy: 'Data & privacy',
    privacyLines: [
      'Everything you log stays on this phone — there’s no account and no THRIVE server.',
      'Nothing you log is sold, shared or used for ads.',
      'THRIVE estimates and suggests — it never diagnoses.',
    ],
    privacyPolicy: 'Privacy policy',
    about: 'About',
    sources: 'Caffeine data sources',
    support: 'Contact support',
    version: (v: string) => `THRIVE ${v} · BrainCare Foundation`,
    erase: 'Erase all data on this phone',
    eraseTitle: 'Erase all THRIVE data?',
    eraseBody: 'This deletes every drink, streak, sleep rating, journal note and check-in on this phone. It can’t be undone.',
    eraseConfirm: 'Erase',
  },

  onboarding: {
    welcomeTitle: 'Hi, I’m Sage',
    welcomeBody: 'I help you see how caffeine fits into your day — and your sleep.',
    point1: 'Log a drink in two taps',
    point2: 'See how much caffeine is left at bedtime',
    point3: 'Private: everything stays on your phone',
    start: 'Let’s go',
    aboutYouTitle: 'A little about you',
    aboutYouBody: 'Both are optional — you can change them any time in Settings.',
    nameLabel: 'What should I call you?',
    bedtimeLabel: 'When do you usually go to sleep?',
    readyTitle: 'You’re all set',
    readyBody: (goal: number) => `THRIVE uses ${goal} mg a day as a goal for teens. Try logging the last drink you had.`,
    logFirst: 'Log my first drink',
    explore: 'Look around first',
    step: (i: number, n: number) => `Step ${i} of ${n}`,
  },

  sources: {
    title: 'Where the numbers come from',
    intro: (date: string) =>
      `Caffeine amounts are built into the app (no internet needed) and were last checked on ${date}. Shops change recipes, so treat every number as a guide — the label or the brand’s own menu always wins. You can log any drink with your own amount from the Log tab.`,
    kindDesc: {
      official: 'published by the brand itself (menu data, can label, nutrition guide or FAQ).',
      secondary: 'the brand doesn’t publish a per-drink number; reported by a third party, usually from the brand’s customer service.',
      estimate: 'no brand figure exists (e.g. boba shops); based on lab measurements or typical published values for that type of drink.',
    },
    drinksAndKinds: (n: number, kinds: string) => `${n} drinks · ${kinds}`,
    disclaimer:
      'THRIVE is an independent wellness app from BrainCare Foundation. It is not affiliated with, sponsored or endorsed by any company named here; brand and product names are used only to identify drinks and belong to their owners. Drink pictures are THRIVE’s own illustrations, not brand logos. THRIVE is not a medical device and does not give medical advice.',
  },

  notFound: {
    title: 'Page not found',
    body: 'That link doesn’t go anywhere in THRIVE.',
    home: 'Go to Home',
  },

  // ── Data labels ────────────────────────────────────────────────────────────
  kinds: {
    official: 'Brand-published',
    secondary: 'Third-party report',
    estimate: 'Estimate',
  },
  sections: {
    Brewed: 'Brewed',
    'Cold brew & iced': 'Cold brew & iced',
    'Espresso drinks': 'Espresso drinks',
    Blended: 'Blended',
    'Tea & refreshers': 'Tea & refreshers',
    Energy: 'Energy',
  },
  // Only category tiles are translated — shop names are proper names.
  brands: {
    boba: 'Boba / milk tea',
    energy: 'Energy drinks',
    soda: 'Soda & bottled',
    generic: 'Made at home',
  },
  brandBlurbs: {
    starbucks: 'Coffee & refreshers',
    peets: 'Coffee',
    dutch: 'Coffee & Rebel',
    dunkin: 'Coffee',
    mcd: 'McCafé & tea',
    panera: 'Coffee & tea',
    bluebottle: 'Cans & cartons',
    cbtl: 'Coffee',
    happylemon: 'Milk tea & fruit tea',
    chicha: 'Fresh-brewed tea',
    tigersugar: 'Brown sugar boba',
    kungfu: 'Milk tea & fruit tea',
    gongcha: 'Milk tea & milk foam',
    boba: 'Any boba shop',
    energy: 'Cans',
    soda: 'Cans & bottles',
    generic: 'Coffee & tea',
  },
  // Generic (non-brand) drink names. Brand menu items keep their real names.
  drinkNames: {
    'Brewed coffee': 'Brewed coffee',
    'Espresso shot': 'Espresso shot',
    'Brewed black tea': 'Brewed black tea',
    'Brewed green tea': 'Brewed green tea',
    'Black milk tea (boba)': 'Black milk tea (boba)',
  } as Record<string, string>,
  // Words inside size labels ("Medium 16 oz", "12 oz can"). Brand size names
  // like Tall / Grande / Venti / Trenta are kept as-is.
  sizeWords: {
    Small: 'Small',
    Medium: 'Medium',
    Large: 'Large',
    Regular: 'Regular',
    can: 'can',
    cup: 'cup',
    oneSize: 'One size',
  },
  /** Append ml after oz sizes ("16 oz · 473 ml"). */
  showMetric: false,
  /**
   * Search words in this language → English menu words, so people can search
   * in their own language (e.g. 拿铁 → latte). Empty for English.
   */
  searchAliases: {} as Record<string, string>,

  ranks: {
    Hatchling: 'Hatchling',
    Fledgling: 'Fledgling',
    'Night Owl': 'Night Owl',
    'Wise Sage': 'Wise Sage',
  },

  cudq: {
    questions: [
      'Did you have caffeine even though you knew it could cause lasting physical or mental problems?',
      'Did you have caffeine to avoid withdrawal (headache, nausea, tiredness)?',
      'Did you have more caffeine, or for longer, than you meant to?',
      'Did caffeine make you miss things you were supposed to do at school, work or home?',
      'Did you keep having caffeine even though it caused or worsened problems with other people?',
      'Did you need more caffeine than before to get the same effect?',
      'Did you spend a lot of time getting or having caffeine?',
      'Did you feel a strong urge or craving for caffeine?',
      'Did any of the above cause real trouble or stress in your daily life?',
    ],
    options: ['Never', 'A little', 'Quite a bit', 'Often'],
    tiers: {
      low: {
        tier: 'Low signal',
        copy: 'Your answers suggest caffeine isn’t running the show right now. Keep an eye on evenings — that’s when small changes matter most for sleep.',
      },
      watch: {
        tier: 'Worth watching',
        copy: 'A few patterns showed up — maybe wanting caffeine more than expected, or finding it harder to skip. That’s common and very fixable. Try the Tools tab for some easy swaps.',
      },
      talk: {
        tier: 'Talk to someone you trust',
        copy: 'Several answers suggest caffeine may be affecting your day-to-day more than you’d like. This isn’t a diagnosis — but it’s a good moment to talk it through with a parent, school counselor or doctor.',
      },
    },
  },

  content: {
    tips: {
      morning: {
        title: 'Morning tip',
        body: 'Try water and a 5-minute walk outside before reaching for caffeine — daylight wakes you up on its own.',
      },
      afternoon: {
        title: 'Afternoon tip',
        body: 'The afternoon slump is often about energy, not caffeine. Fruit, a short walk, peppermint tea or water can cover the same dip.',
      },
      evening: {
        title: 'Evening tip',
        body: 'Caffeine this late is the most likely to cost you sleep tonight. Calm music or a quick stretch can ease the urge.',
      },
    },
    alternatives: [
      'Cold water with a splash of citrus — the cold and the flavor give a small boost.',
      'Ginger or peppermint tea — no caffeine, still feels like “a drink.”',
      'Electrolytes (coconut water, sports drink) — being thirsty feels a lot like being tired.',
      'Chicory or roasted-grain “coffee” — same ritual, no caffeine.',
      'A snack with some protein — a blood-sugar dip can feel just like needing caffeine.',
    ],
    distractions: [
      '5-minute walk, ideally outside — light and movement do a lot of what caffeine does.',
      'Text a friend for two minutes — chatting is surprisingly waking.',
      'Cold water on your wrists or face — a quick reset.',
      'Stand up, stretch, or do 10 jumping jacks.',
      'Switch tasks for 5 minutes, then come back to what felt draining.',
    ],
    habits: [
      'Have your first drink after 9–10 am — your body is already waking you up early on.',
      'Wake up at the same time every day, weekends too — the biggest single thing for better sleep.',
      'Dim screens 60–90 minutes before bed — bright light can delay your sleep hormone (melatonin).',
      'Water before caffeine, every time.',
      'Pick one “last call” time for caffeine — make it a habit, not a daily decision.',
    ],
    article: {
      title: 'Why it matters',
      paragraphs: [
        'Caffeine has a half-life of about 5 hours. If you have a coffee at 3 PM, roughly half of it — about 47 mg from a typical 95 mg cup — is still active in your body at 8 PM. The effects can last 10+ hours and cut into the deep sleep your brain and body need to recover.',
        'With regular use, your body gets used to it, so caffeine can start to feel necessary just to feel normal — not just to feel awake. THRIVE uses 100 mg a day as a default goal for teens, a limit many pediatric experts suggest; Health Canada, for example, advises teens to stay under about 2.5 mg per kg of body weight per day. Talk to a doctor about what’s right for you.',
        'In the U.S., drink labels don’t have to list how many milligrams of caffeine they contain, and one large energy drink or cold brew can have 2–3× a plain cup of coffee — which is why THRIVE shows where each number comes from.',
      ],
    },
  },
};

type Widen<T> = T extends string
  ? string
  : T extends boolean
    ? boolean
    : T extends (...args: infer A) => string
      ? (...args: A) => string
      : T extends readonly string[]
        ? string[]
        : T extends object
          ? { [K in keyof T]: Widen<T[K]> }
          : T;

export type Strings = Widen<typeof en>;
export default en as Strings;
