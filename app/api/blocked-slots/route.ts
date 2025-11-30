import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blockedSlots } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const slots = await db.select().from(blockedSlots);
    return NextResponse.json(slots);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blocked slots' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, reason } = body;

    // Check if slot is already blocked
    const existing = await db.select().from(blockedSlots)
      .where(and(eq(blockedSlots.date, date), eq(blockedSlots.time, time)));

    if (existing.length > 0) {
      return NextResponse.json({ error: 'This time slot is already blocked' }, { status: 400 });
    }

    const newSlot = await db.insert(blockedSlots).values({
      date,
      time,
      reason,
    }).returning();

    return NextResponse.json(newSlot[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to block slot' }, { status: 500 });
  }
}
