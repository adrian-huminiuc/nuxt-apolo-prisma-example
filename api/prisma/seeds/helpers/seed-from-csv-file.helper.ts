import fs from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse';
import events from 'events';

type SeedResult = {
    persisted: number;
    skipped: number;
};

export async function seedFromCsvFile<T>(
    filename: string,
    builder: (row) => T | null,
    persistCallback: (data) => void,
    progressTextCallback?: (totals: SeedResult) => void,
): Promise<SeedResult> {
    const reader = fs
        .createReadStream(join(process.cwd(), 'prisma', 'seeds', 'data', filename))
        .pipe(parse({ delimiter: ',', relaxQuotes: true, fromLine: 2 }));

    const data = [];
    const totals: SeedResult = {
        persisted: 0,
        skipped: 0,
    };
    reader.on('data', async row => {
        const entry = builder(row);
        if (entry) {
            data.push(builder(row));
            totals.persisted += 1;
        } else {
            totals.skipped += 1;
        }
        // batch inserts into batches of 1000
        if (data.length % 1000 === 0) {
            await persistCallback(data);
            data.splice(0, 999);
            process.stdout.write('\r');
            progressTextCallback(totals);
        }
    });

    reader.on('finish', async () => {
        await persistCallback(data);
        process.stdout.write('\r');
        progressTextCallback(totals);
        process.stdout.write('\n');
    });

    await events.once(reader, 'close');

    return totals;
}
