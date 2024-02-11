import { NextResponse, NextRequest } from 'next/server';

declare type SessionRow = {
    sessionId: string | null;
    rows: string | null;
}

const storage: Array<SessionRow> = new Array<SessionRow>;

function storeInDb(sessionId: string | null, rows: string | null) {
    // TODO: store in db
    console.log(`sessionId: ${sessionId}`);
    console.log(`rows: ${rows}`);
    storage.push({sessionId, rows});
}

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get('sessionId');
    const rows = req.nextUrl.searchParams.get('rows');

    console.log(rows);

    storeInDb(sessionId, rows)

    return NextResponse.json(storage);
}