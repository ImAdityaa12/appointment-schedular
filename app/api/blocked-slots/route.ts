import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blockedSlots } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const slots = await db.select().from(blockedSlots);
    return NextResponse.json(slots);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blocked slots' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, reason, blockWholeDay } = body;

    if (blockWholeDay) {
      // Block all time slots for the day
      const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
      ];

      const slotsToInsert = [];
      for (const timeSlot of timeSlots) {
        const existing = await db.select().from(blockedSlots)
          .where(and(eq(blockedSlots.date, date), eq(blockedSlots.time, timeSlot)));

        if (existing.length === 0) {
          slotsToInsert.push({
            date,
            time: timeSlot,
            reason: reason || 'Whole day blocked',
          });
        }
      }

      if (slotsToInsert.length > 0) {
        await db.insert(blockedSlots).values(slotsToInsert);
      }

      return NextResponse.json({ message: 'Whole day blocked successfully', count: slotsToInsert.length }, { status: 201 });
    } else {
      // Block single time slot
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
    }
  } catch {
    return NextResponse.json({ error: 'Failed to block slot' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
    }

    await db.delete(blockedSlots).where(eq(blockedSlots.id, parseInt(id)));

    return NextResponse.json({ message: 'Blocked slot removed successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to remove blocked slot' }, { status: 500 });
  }
}
