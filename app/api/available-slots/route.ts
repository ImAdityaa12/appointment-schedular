import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments, blockedSlots } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const bookedSlots = await db.select().from(appointments).where(eq(appointments.date, date));
    const blocked = await db.select().from(blockedSlots).where(eq(blockedSlots.date, date));

    const unavailableTimes = [
      ...bookedSlots.map(slot => slot.time),
      ...blocked.map(slot => slot.time)
    ];

    return NextResponse.json({ unavailableTimes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch available slots' }, { status: 500 });
  }
}
