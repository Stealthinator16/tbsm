
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
        id: 'spit-dope-meeting',
        date: '2015',
        title: 'The Spit Dope Spark',
        description: 'Siddhant Sharma (Calm) and Abhijay Negi (Encore ABJ) first cross paths at Spit Dope Inc., the legendary underground battle rap circuit in Delhi. Calm’s rhythmic English freestyles and Encore’s sharp Hindi lyricism immediately caught each other’s attention, planting the seeds for what would become India’s most formidable rap duo.',
        type: 'milestone',
        era: 'The Raw Origins (2015-2017)'
    },
    {
        id: 'name-adoption',
        date: '2016',
        title: 'Adopting the "Seedhe Maut" Philosophy',
        description: 'The duo officially adopts the name "Seedhe Maut." Derived from local slang used by Calm’s brother, the name signifies giving your absolute 100% potential to something—a philosophy that would define their relentless work ethic and technical standard.',
        type: 'milestone',
        era: 'The Raw Origins (2015-2017)'
    },
    {
        id: '2-ka-pahada',
        date: '2017-05',
        title: '2 Ka Pahada Mixtape',
        description: 'Their first full project, produced by Sez on the Beat. This mixtape introduced the "Delhi New School" sound, featuring technical anthems like "Seedhe Maut Anthem" and "Class Sikh". It was the first time the duo experimented with the synergy that would later define their careers.',
        type: 'release',
        era: 'The Raw Origins (2015-2017)',
        relatedSlug: 'seedhe-maut-anthem'
    },
    {
        id: 'azadi-signing',
        date: '2017-10',
        title: 'Entering the Azadi Records Era',
        description: 'Seedhe Maut joins Azadi Records, a landmark independent label founded by Mo Joshi and Uday Kapur. This signing provided the duo with a platform to remain uncompromisingly raw while gaining access to the resources needed to reach a nationwide audience.',
        type: 'milestone',
        era: 'The Raw Origins (2015-2017)'
    },
    {
        id: 'bayaan-launch',
        date: '2018-12',
        title: 'Bayaan: The Social Manifesto',
        description: 'The release of their debut studio album, "Bayaan." Produced entirely by Sez, it was a social and personal narrative that addressed middle-class morality, urban angst, and artistic hunger. It is widely considered the album that changed the trajectory of Desi Hip Hop forever.',
        type: 'release',
        era: 'The Azadi & Bayaan Boom (2018-2020)',
        relatedSlug: 'meri-baggi'
    },
    {
        id: 'shaktimaan-cult',
        date: '2019',
        title: 'Shaktimaan & Moshpit Culture',
        description: 'The single "Shaktimaan" becomes a runaway hit. With its high-energy production and relatable themes of everyday struggle, it solidified Seedhe Maut’s reputation as the premier live act in the country, giving birth to the iconic moshpit culture in their shows.',
        type: 'release',
        era: 'The Azadi & Bayaan Boom (2018-2020)',
        relatedSlug: 'shaktimaan'
    },
    {
        id: 'chalo-chalein',
        date: '2019-11',
        title: 'Chalo Chalein (The Ritviz Collab)',
        description: 'Collaborating with indie-pop sensation Ritviz, Seedhe Maut released "Chalo Chalein." This cross-genre collaboration introduced their sharp lyricism to a massive mainstream indie audience, proving their versatility across different soundscapes.',
        type: 'release',
        era: 'The Azadi & Bayaan Boom (2018-2020)',
        relatedSlug: 'chalo-chalein'
    },
    {
        id: 'namastute-moment',
        date: '2020-08',
        title: 'Namastute: Technical Supremacy',
        description: 'Released during the peak of the pandemic, "Namastute" was a technical masterclass. The music video and the sheer speed and complexity of the bars set a new gold standard for performance in DHH, cementing their status as the duo to beat.',
        type: 'release',
        era: 'The Azadi & Bayaan Boom (2018-2020)',
        relatedSlug: 'namastute'
    },
    {
        id: 'yaad-vulnerability',
        date: '2020-10',
        title: 'Yaad: Emotional Depth',
        description: 'With "Yaad," the duo showed they weren’t just about aggression. The track explored loss, memory, and vulnerability, showcasing a matured songwriting ability that would later peak in their second album.',
        type: 'release',
        era: 'The Azadi & Bayaan Boom (2018-2020)',
        relatedSlug: 'yaad'
    },
    {
        id: '101-philosophy',
        date: '2020-12',
        title: 'The "101% Seedhe Maut" Standard',
        description: 'Ending their breakout year with "101," they cemented their brand identity. The track became a rallying cry for the "TBSM" (Tehalka Bhai Seedhe Maut) community, asserting their dominance over the scene.',
        type: 'release',
        era: 'The Azadi & Bayaan Boom (2018-2020)',
        relatedSlug: '101'
    },
    {
        id: 'n-mixtape',
        date: '2021',
        title: 'न: The Transitional Mixtape',
        description: 'A project that bridged the gap between Bayaan and Nayaab. It featured "Nanchaku" with MC Stan, a landmark collaboration that brought together the Delhi and Pune sounds, creating a massive regional cross-over hit.',
        type: 'release',
        era: 'The Nayaab Mastery (2021-2022)',
        relatedSlug: 'nanchaku'
    },
    {
        id: 'nayaab-magnum-opus',
        date: '2022-05',
        title: 'Nayaab: The Masterpiece',
        description: 'After two years of meticulous recording, "Nayaab" was released. 17 tracks exploring fame, brotherhood, death, and legacy. The album achieved immediate critical acclaim and is considered by many as the greatest hip-hop album to come out of India.',
        type: 'release',
        era: 'The Nayaab Mastery (2021-2022)',
        relatedSlug: 'nayaab'
    },
    {
        id: 'nayaab-india-tour',
        date: '2022-06',
        title: 'The Nayaab National Tour',
        description: 'A multi-city tour that set a new benchmark for live hip-hop in India. From massive amphitheaters to high-energy club sets, the duo proved they were more than just studio rappers, but a generational live experience.',
        type: 'show',
        era: 'The Nayaab Mastery (2021-2022)'
    },
    {
        id: 'youtube-fanfest',
        date: '2022-12',
        title: 'YouTube Fanfest Finale',
        description: 'Performing to a massive global digital audience, they capped off their most successful year, transitioning into household names within the wider youth culture of India.',
        type: 'show',
        era: 'The Nayaab Mastery (2021-2022)'
    },
    {
        id: 'lunch-break-marathon',
        date: '2023-08',
        title: 'Lunch Break: The 30-Track Flex',
        description: 'A massive mixtape released purely for the sport. Featuring 30 tracks and over 20 collaborators including KR$NA and Badshah. It was their final project with Azadi Records, showcasing a prolific output and total mastery of various rap styles.',
        type: 'release',
        era: 'DL91 & The Independent Empire (2023-Present)',
        relatedSlug: 'fanne-khan'
    },
    {
        id: 'azadi-departure',
        date: '2023-11',
        title: 'The Great Independence',
        description: 'After a historic 6-year run, Seedhe Maut officially departs Azadi Records. They decide to go fully independent to take 100% creative and business control of their legacy, marking a significant shift in the DHH industry landscape.',
        type: 'milestone',
        era: 'DL91 & The Independent Empire (2023-Present)'
    },
    {
        id: 'dl91-formation',
        date: '2024-01',
        title: 'Birth of the DL91 Era',
        description: 'The formation of their independent creative ecosystem and label, DL91. Named after Delhi’s postal code and India’s country code, it serves as a platform for their own art and a home for the next wave of Delhi talent.',
        type: 'milestone',
        era: 'DL91 & The Independent Empire (2023-Present)'
    },
    {
        id: 'shakti-kshama-eps',
        date: '2024-06',
        title: 'Shakti & Kshama: Conceptual Literature',
        description: 'A conceptual two-part release (Shakti and Kshama) inspired by the legendary poem of Ramdhari Singh Dinkar. This project blended high-concept literature with modern rap, exploring themes of power, forgiveness, and history.',
        type: 'release',
        era: 'DL91 & The Independent Empire (2023-Present)',
        relatedSlug: 'shakti-aur-kshama'
    },
    {
        id: 'uk-invasion',
        date: '2024-07',
        title: 'The UK Invasion Tour',
        description: 'Seedhe Maut takes their high-energy set international, with sold-out shows across London (Scala), Birmingham, and Manchester, bringing the Delhi sound to the global stage.',
        type: 'show',
        era: 'DL91 & The Independent Empire (2023-Present)'
    },
    {
        id: 'boiler-room-mumbai',
        date: '2024-12',
        title: 'Boiler Room Mumbai: A Global Standard',
        description: 'A historic Boiler Room set in Mumbai that went viral globally. The set captured the raw essence of their moshpit culture and technical agility, viewed by millions as a testament to the growth of the Indian scene.',
        type: 'show',
        era: 'DL91 & The Independent Empire (2023-Present)'
    },
    {
        id: 'dl91-fm-compilation',
        date: '2025-01',
        title: 'DL91 FM: The Next Wave',
        description: 'The first major compilation project from their independent stable. Featuring label mates like Ab-17 and Lil Bhavi, it signaled the arrival of a new powerhouse in the Indian music industry.',
        type: 'release',
        era: 'DL91 & The Independent Empire (2023-Present)',
        relatedSlug: 'dl91-fm'
    },
    {
        id: 'smx-tour-anniversary',
        date: '2025-11',
        title: 'The SMX Tour: A Decade of Excellence',
        description: 'A massive 15-city nationwide stadium and arena tour celebrating 10 years of Seedhe Maut. From their first meeting to this anniversary, the tour is a celebration of brotherhood, legacy, and the future of Indian Hip Hop.',
        type: 'show',
        era: 'DL91 & The Independent Empire (2023-Present)'
    }
];

export const eras = [
    'The Raw Origins (2015-2017)',
    'The Azadi & Bayaan Boom (2018-2020)',
    'The Nayaab Mastery (2021-2022)',
    'DL91 & The Independent Empire (2023-Present)'
];
