import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  projectPoints: integer('project_points').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  detailedRequirements: text('detailed_requirements'),
  aiQuestions: jsonb('ai_questions').$type<string[]>(),
  userAnswers: jsonb('user_answers').$type<Record<string, string>>(),
  documents: jsonb('documents').$type<{
    userJourney?: string;
    prd?: string;
    frontendDesign?: string;
    backendDesign?: string;
    databaseDesign?: string;
  }>(),
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  amount: integer('amount').notNull(),
  projectPoints: integer('project_points').notNull(),
  paymentMethod: text('payment_method').notNull(),
  status: text('status').notNull(),
  paymentId: text('payment_id').unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;