
export interface TimelineEvent {
    id: string;
    date: string; // YYYY-MM or YYYY
    title: string;
    description: string;
    type: 'release' | 'milestone' | 'show';
    image?: string;
    relatedSlug?: string; // Link to song/album if applicable
    era: string;
}

export const timelineData: TimelineEvent[] = [
    {
        id: 'formation',
        date: '2015',
        title: 'Formation at Spit Dope',
        description: 'Calm and Encore ABJ meet at Spit Dope Inc., the legendary underground battle rap league in Delhi. The partnership that would change DHH begins.',
        type: 'milestone',
        era: 'The Underground Seeds (2015-2017)'
    },
    {
        id: '2-ka-pahada',
        date: '2017-05',
        title: '2 Ka Pahada',
        description: 'Their debut mixtape produced entirely by Sez on the Beat. Featuring "Seedhe Maut Anthem", it announced their aggressive and technical arrival.',
        type: 'release',
        era: 'The Underground Seeds (2015-2017)',
        relatedSlug: 'seedhe-maut-anthem'
    },
    {
        id: 'azadi-signing',
        date: '2017-10',
        title: 'Signing with Azadi Records',
        description: 'Seedhe Maut joins forces with Azadi Records, a pivotal movement in independent Indian music that gave them a platform to remain uncompromisingly raw.',
        type: 'milestone',
        era: 'The Underground Seeds (2015-2017)'
    },
    {
        id: 'bayaan',
        date: '2018-12',
        title: 'Bayaan',
        description: 'The debut album that set the gold standard for DHH. A raw, social, and personal masterpiece that remains a cult classic.',
        type: 'release',
        era: 'The Bayaan Revolution (2018-2020)',
        relatedSlug: 'meri-baggi'
    },
    {
        id: 'shaktimaan',
        date: '2019',
        title: 'Shaktimaan',
        description: 'A high-energy single that became their signature live performance track, capturing the chaotic energy of the duo.',
        type: 'release',
        era: 'The Bayaan Revolution (2018-2020)',
        relatedSlug: 'shaktimaan'
    },
    {
        id: 'namastute',
        date: '2020-08',
        title: 'Namastute',
        description: 'The technical masterclass that broke the internet and cemented their status as the most skilled duo in the country.',
        type: 'release',
        era: 'The Bayaan Revolution (2018-2020)',
        relatedSlug: 'namastute'
    },
    {
        id: '101',
        date: '2020-12',
        title: '101',
        description: 'Ending 2020 with a massive banger, solidifying their flow and the "101% Seedhe Maut" identity.',
        type: 'release',
        era: 'The Bayaan Revolution (2018-2020)',
        relatedSlug: '101'
    },
    {
        id: 'nanchaku',
        date: '2021',
        title: 'Nanchaku with MC Stan',
        description: 'A cross-over banger with MC Stan that bridged regional gaps and became a commercial and street success.',
        type: 'release',
        era: 'The Nayaab Mastery (2021-2022)',
        relatedSlug: 'nanchaku'
    },
    {
        id: 'nayaab',
        date: '2022-05',
        title: 'Nayaab',
        description: 'The magnum opus. A sophomore album exploring fame, brotherhood, and artistic maturity. Widely considered one of the best Indian albums of all time.',
        type: 'release',
        era: 'The Nayaab Mastery (2021-2022)',
        relatedSlug: 'nayaab'
    },
    {
        id: 'nayaab-tour',
        date: '2022-06',
        title: 'Nayaab India Tour',
        description: 'A multi-city tour that proved Seedhe Maut is the best live act in India, with sold-out venues and moshpit culture.',
        type: 'show',
        era: 'The Nayaab Mastery (2021-2022)'
    },
    {
        id: 'lunch-break',
        date: '2023-08',
        title: 'Lunch Break Mixtape',
        description: 'A massive 30-track project released to celebrate their journey and pure love for the sport of rap.',
        type: 'release',
        era: 'The Lunch Break & Independence (2023-Present)',
        relatedSlug: 'fanne-khan'
    },
    {
        id: 'independent',
        date: '2023-11',
        title: 'Going Fully Independent',
        description: 'Seedhe Maut departs from Azadi Records to take full creative and business control of their legacy.',
        type: 'milestone',
        era: 'The Lunch Break & Independence (2023-Present)'
    },
    {
        id: 'dl91-era',
        date: '2024-01',
        title: 'Formation of DL91',
        description: 'The duo launches their own independent platform, DL91 Era, to push their own art and support the next wave of talent.',
        type: 'milestone',
        era: 'The Lunch Break & Independence (2023-Present)'
    },
    {
        id: 'shakti-kshama',
        date: '2024-06',
        title: 'Shakti & Kshama EPs',
        description: 'A conceptual two-part release exploring themes of power and forgiveness, inspired by Indian literature.',
        type: 'release',
        era: 'The Lunch Break & Independence (2023-Present)',
        relatedSlug: 'shakti-aur-kshama'
    },
    {
        id: 'smx-tour',
        date: '2025-11',
        title: 'The SMX Tour',
        description: 'A 15-city nationwide tour celebrating a decade of Seedhe Maut in the game. 10 Years. One Legacy.',
        type: 'show',
        era: 'The Lunch Break & Independence (2023-Present)'
    }
];

export const eras = [
    'The Underground Seeds (2015-2017)',
    'The Bayaan Revolution (2018-2020)',
    'The Nayaab Mastery (2021-2022)',
    'The Lunch Break & Independence (2023-Present)'
];
