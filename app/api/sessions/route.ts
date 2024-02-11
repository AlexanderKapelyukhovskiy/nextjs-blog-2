import { NextResponse, NextRequest } from 'next/server';

declare type SessionRow = {
    sessionId: string | null;
    rows: string | null;
    lastRow: string | null;
    updated: number
}

let storage: Array<SessionRow> = new Array<SessionRow>;

function storeInDb(sessionId: string | null, rows: string | null, lastRow: string | null) {
    // TODO: store in db
    console.log(`sessionId: ${sessionId}`);
    console.log(`rows: ${rows}`);

    const r = storage.find((row) => row.sessionId === sessionId);

    if (!r) {
        storage.push({sessionId, rows, lastRow, updated: 0});
    } else {
        let updated = 0;
        if (r.rows != rows) {
            updated += 1;
        }
        if (r.lastRow != lastRow) {
            updated += 2;
        }

        storage = storage.map((row) => row.sessionId === sessionId ? {sessionId, rows, lastRow, updated} : row) as Array<SessionRow>;
    }
}

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get('sessionId');
    const rows = req.nextUrl.searchParams.get('rows');
    const lastRow = req.nextUrl.searchParams.get('v');

    storeInDb(sessionId, rows, lastRow);

    return NextResponse.json(storage);
}