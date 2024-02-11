import { NextResponse, NextRequest } from 'next/server';
import { createSessionEvent } from '@/app/lib/actions';

function splitEvent(eventText: string | null) {
    if (!eventText) {
        return ['', ''];
    }
    const regex = /(\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M)/; // Date/time pattern
    const match = eventText.match(regex);

    let eventName, eventTime;
    if (match) {
        const index = eventText.indexOf(match[0]);
        eventName = eventText.substring(0, index).trim();
        eventTime = eventText.substring(index).trim();
    } else {
        // No date/time pattern found, the whole input is considered as the first part
        eventName = eventText;
        eventTime = '';
    }
    return [eventName, eventTime];
}

export async function GET(req: NextRequest) { 
    const sid = req.nextUrl.searchParams.get('sid');
    const sessionId = parseInt(sid?.toString() || '0', 10);
    const evt = req.nextUrl.searchParams.get('evt');
    const [eventName, eventTime] = splitEvent(evt);

    if (sessionId === 0 || eventName?.length === 0 || eventTime?.length === 0) {
        return new NextResponse(
            JSON.stringify({success: false, message: 'incorrect request'}),
            {status: 401, headers: {'content-type': 'application/json'}});
    }

    try {
        await createSessionEvent(sessionId, eventName, eventTime);
    } catch (error) {
        new NextResponse(error?.toString(), {status: 500});
    }

    return NextResponse.json({success: true, sessionId, eventName, eventTime});
};