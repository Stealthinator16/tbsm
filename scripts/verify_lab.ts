
import { getProducerStats } from '../src/utils/producers';

console.log("Verifying The Lab (Producer Stats)...");

try {
    const producers = getProducerStats();
    console.log(`Found ${producers.length} producers.`);

    if (producers.length > 0) {
        console.log("\nLeaderboard:");
        producers.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name}: ${p.count} songs`);
            // Show first 2 songs as check
            const examples = p.songs.slice(0, 2).map(s => s.title).join(", ");
            console.log(`   Examples: ${examples}`);
        });

        // Assertions
        const calm = producers.find(p => p.name === 'Calm');
        if (calm && calm.count < 5) console.warn("⚠️ Warning: Calm has very few songs. Injection might be incomplete?");

        const sez = producers.find(p => p.name === 'Sez on the Beat');
        if (!sez) console.warn("⚠️ Warning: Sez on the Beat not found!");

    } else {
        console.error("❌ No producer data found. Injection failed?");
    }

} catch (e) {
    console.error("Error running verification:", e);
}
