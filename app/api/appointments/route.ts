import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    const allAppointments = await db.select().from(appointments);
    return NextResponse.json(allAppointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, notes } = body;

    const newAppointment = await db.insert(appointments).values({
      name,
      email,
      phone,
      date,
      time,
      notes,
    }).returning();

    return NextResponse.json(newAppointment[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
