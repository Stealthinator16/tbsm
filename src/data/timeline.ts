
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
        date: '2017',
        title: 'The Formation',
        description: 'Encore ABJ and Calm meet and decide to form a duo. The seed is sown.',
        type: 'milestone',
        era: 'The Beginning',
        relatedSlug: 'seedhe-maut-anthem'
    },
    {
        id: 'seedhe-maut-anthem',
        date: '2017-05',
        title: 'Seedhe Maut Anthem',
        description: 'The track that gave them their name and announced their arrival.',
        type: 'release',
        era: 'The Beginning',
        relatedSlug: 'seedhe-maut-anthem'
    },
    {
        id: 'bayaan',
        date: '2018-12',
        title: 'Bayaan',
        description: 'The debut album produced by Sez on the Beat. A cult classic that changed the DHH landscape forever.',
        type: 'release',
        era: 'Bayaan Era',
        // We don't have a specific slug for the album page yet, but maybe a key song
        relatedSlug: 'meri-baggi'
    },
    {
        id: 'shaktimaan',
        date: '2019',
        title: 'Shaktimaan',
        description: 'A chaotic, high-energy single that showcased their aggressive side.',
        type: 'release',
        era: 'Discovery',
        relatedSlug: 'shaktimaan'
    },
    {
        id: '101',
        date: '2020',
        title: '101',
        description: 'Breaking into the mainstream consciousness with pure bars.',
        type: 'release',
        era: 'Discovery',
        relatedSlug: '101'
    },
    {
        id: 'namastute',
        date: '2020',
        title: 'Namastute',
        description: 'The anthem that defined a generation of DHH fans.',
        type: 'release',
        era: 'Discovery',
        relatedSlug: 'namastute'
    },
    {
        id: 'nanchaku',
        date: '2021',
        title: 'Nanchaku',
        description: 'Collaborating with MC Stan. A cross-regional banger.',
        type: 'release',
        era: 'Pre-Nayaab',
        relatedSlug: 'nanchaku'
    },
    {
        id: 'nayaab',
        date: '2022-05',
        title: 'Nayaab',
        description: 'The magnum opus. A sophomore album that explored fame, struggle, and mastery.',
        type: 'release',
        era: 'Nayaab Era',
        relatedSlug: 'nayaab'
    },
    {
        id: 'nayaab-tour',
        date: '2022-06',
        title: 'Nayaab Tour',
        description: 'A nationwide tour that solidified their status as the best live act in the country.',
        type: 'show',
        era: 'Nayaab Era'
    },
    {
        id: 'lunch-break',
        date: '2023',
        title: 'Lunch Break',
        description: 'A mixtape purely for the fans and the love of the sport. 30 songs of pure heat.',
        type: 'release',
        era: 'Lunch Break Era',
        relatedSlug: 'focused-sedated' // Lead single-ish
    },
    {
        id: 'kavi',
        date: '2024',
        title: 'Kavi (Keh Chuka)',
        description: 'Continuing the legacy with introspective storytelling.',
        type: 'release',
        era: 'Present',
        relatedSlug: 'kavi'
    }
];

export const eras = [
    'The Beginning',
    'Bayaan Era',
    'Discovery',
    'Pre-Nayaab',
    'Nayaab Era',
    'Lunch Break Era',
    'Present'
];
