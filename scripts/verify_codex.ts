
import { getAllAnnotations } from '../src/utils/codex';

// Mocking the data source if needed, or we can just rely on ts-node/tsx to run this if it handles the imports correctly.
// Since we are in a Next.js environment with TS, running this directly might be tricky due to path aliases (@/...) if used.
// But our code uses relative paths '../data', so it might work with tsx.

console.log("Verifying Codex Aggregation...");
try {
    const entries = getAllAnnotations();
    console.log(`Found ${entries.length} unique terms.`);

    if (entries.length > 0) {
        console.log("Top 5 occurring terms:");
        entries.slice(0, 5).forEach(e => {
            console.log(`- ${e.keyword} (${e.type}): ${e.count} refs`);
            if (e.songs.length > 0) {
                console.log(`  Example context: "${e.songs[0].context}" in ${e.songs[0].title}`);
            }
        });
    } else {
        console.log("⚠️ No annotations found. Are the song files enriched?");
    }

} catch (e) {
    console.error("Error running verification:", e);
}
