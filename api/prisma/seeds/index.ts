import { Account, Category, PrismaClient, Transaction } from '@prisma/client';
import { seedFromCsvFile } from './helpers/seed-from-csv-file.helper';
import { Decimal } from '@prisma/client/runtime';

const prisma = new PrismaClient();

async function main(): Promise<void> {
    await seedFromCsvFile<Account>(
        'accounts.csv',
        row => ({
            id: row[0],
            name: row[1],
            bank: row[2],
        }),
        data => prisma.account.createMany({ data }),
        totals => {
            process.stdout.write(`Seeded ${totals.persisted} accounts! Skipped ${totals.skipped} broken records!`);
        },
    );

    await seedFromCsvFile<Category>(
        'categories.csv',
        row => ({
            id: row[0],
            name: row[1],
            color: row[2],
        }),
        data => prisma.category.createMany({ data }),
        totals => {
            process.stdout.write(`Seeded ${totals.persisted} categories! Skipped ${totals.skipped} broken records!`);
        },
    );

    await seedFromCsvFile<Transaction>(
        'transactions.csv',
        row => {
            // does not insert transactions with no id, or with no relations to account or category
            if (!row[0].length || !row[1].length || !row[2].length) {
                return null;
            }

            return {
                id: row[0], // should it be inserted with a randomUUID()? who knows :shrug:
                accountId: row[1],
                categoryId: row[2],
                reference: row[3],
                amount: new Decimal(row[4]),
                currency: row[5],
                date: new Date(row[6]),
            };
        },
        data => prisma.transaction.createMany({ data, skipDuplicates: true }),
        totals => {
            process.stdout.write(`Seeded ${totals.persisted} transactions! Skipped ${totals.skipped} broken records!`);
        },
    );
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
