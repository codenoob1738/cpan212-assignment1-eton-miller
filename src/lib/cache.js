export function buildCache(cacheTime) {
    const entries = new Map();

    let hits = 0;
    let misses = 0;

    function get(key) {
        const entry = entries.get(key);

        if (entry === undefined) {
            misses++;
            return undefined;
        }

        if (Date.now() >= entry.expiresAt) {
            entries.delete(key);
            misses++;
            return undefined;
        }
        hits++;
        return entry.value;
    }

    function set(key, value) {
        entries.set(key, {
            value: value,
            expiresAt: Date.now() + cacheTime * 1000
        });
    }

    function details() {
        let activeEntries = 0;

        for (const [key, entry] of entries) {
            if (Date.now() >= entry.expiresAt) {
                entries.delete(key);
            } else {
                activeEntries++;
            }
        }

        return {
            entries: activeEntries,
            hits: hits,
            misses: misses,
            cacheTime: cacheTime
        };
    }

    return { get, set, details };
}
