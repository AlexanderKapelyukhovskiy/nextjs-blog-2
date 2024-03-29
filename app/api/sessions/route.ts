import { NextResponse, NextRequest } from 'next/server';

declare type SessionRow = {
    sessionId: string | null;
    rows: string | null;
    firstRow: string | null;
    lastRow: string | null;
    updated: number
}

let storage: Array<SessionRow> = new Array<SessionRow>;


async function storeInDb(sessionId: string | null, rows: string | null, firstRow: string | null, lastRow: string | null) {
    // TODO: store in db
    const r = storage.find((row) => row.sessionId === sessionId);


    if (!r) {
        storage.push({sessionId, rows, firstRow, lastRow, updated: 0});
    } else {
        let updated = 0;
        if (r.lastRow != lastRow) {
            updated += 1;
        }

        storage = storage.map((row) => row.sessionId === sessionId ? {sessionId, rows, firstRow, lastRow, updated} : row) as Array<SessionRow>;
    }
}

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get('sessionId');
    const rows = req.nextUrl.searchParams.get('rows');
    const firstRow = (req.nextUrl.searchParams.get('v1')?.toString() || '').padEnd(40, '.');
    const lastRow = (req.nextUrl.searchParams.get('v2')?.toString() || '').padEnd(60, '.');

    try {
        await storeInDb(sessionId, rows, firstRow, lastRow);
    } catch (error) {
       return NextResponse.json(error);
    }

    return NextResponse.json(storage.sort(function (a, b) {
        const s1 = a.sessionId || 0;
        const s2 = b.sessionId || 0;
        if (s1 > s2) {
            return 1;
        } else if (s2 > s1) {
            return -1;
        }
        return 0;
    }));
}