import { pgTable, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const users = pgTable('users', {
  id: text('id').primaryKey().$default(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const userCredits = pgTable('user_credits', {
  id: text('id').primaryKey().$default(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  credits: integer('credits').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const paymentHistory = pgTable('payment_history', {
  id: text('id').primaryKey().$default(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  credits: integer('credits').notNull(),
  paymentId: text('payment_id').notNull().unique(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const projects = pgTable('projects', {
  id: text('id').primaryKey().$default(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('draft'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const projectSteps = pgTable('project_steps', {
  id: text('id').primaryKey().$default(() => createId()),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  step: text('step').notNull(),
  content: jsonb('content').notNull(),
  isCompleted: boolean('is_completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const projectDocuments = pgTable('project_documents', {
  id: text('id').primaryKey().$default(() => createId()),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UserCredit = typeof userCredits.$inferSelect
export type NewUserCredit = typeof userCredits.$inferInsert
export type PaymentHistory = typeof paymentHistory.$inferSelect
export type NewPaymentHistory = typeof paymentHistory.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ProjectStep = typeof projectSteps.$inferSelect
export type NewProjectStep = typeof projectSteps.$inferInsert
export type ProjectDocument = typeof projectDocuments.$inferSelect
export type NewProjectDocument = typeof projectDocuments.$inferInsert