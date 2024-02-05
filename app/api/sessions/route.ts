import { NextResponse, NextRequest } from 'next/server';

function storeInDb(sessionId: string | null, rows: string | null) {
    // TODO: store in db
    console.log(`sessionId: ${sessionId}`);
    console.log(`rows: ${rows}`);
}

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get('sessionId');
    const rows = req.nextUrl.searchParams.get('rows');

    storeInDb(sessionId, rows)

    return NextResponse.json({
        sessionId,
        rows
    });
}