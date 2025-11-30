import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const blockedSlots = pgTable('blocked_slots', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow(),
});
