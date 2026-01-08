
import { getVibeStats, getAllVibes, getSongsByVibe } from '../src/utils/vibes';

console.log("Verifying Vibe Matcher...");

try {
    const vibes = getAllVibes();
    const stats = getVibeStats();

    console.log(`Found ${vibes.length} vibe categories.`);

    vibes.forEach(v => {
        const count = stats[v];
        console.log(`\n${v}: ${count} tracks`);
        if (count > 0) {
            const songs = getSongsByVibe(v).slice(0, 3);
            console.log(`   Examples: ${songs.map(s => s.title).join(", ")}`);
        } else {
            console.warn(`   ⚠️ No songs found for ${v}. Injection might be incomplete.`);
        }
    });

} catch (e) {
    console.error("Error running verification:", e);
}
