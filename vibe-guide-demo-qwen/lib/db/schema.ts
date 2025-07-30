import { pgTable, serial, text, timestamp, integer, boolean, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 用户表
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 项目表
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 项目步骤表
export const projectSteps = pgTable('project_steps', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  stepNumber: integer('step_number').notNull(),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 文档表
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  type: text('type').notNull(), // 'user-journey', 'prd', 'frontend', 'backend', 'database'
  title: text('title').notNull(),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 用户点数表
export const userPoints = pgTable('user_points', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  totalPoints: integer('total_points').default(0).notNull(),
  usedPoints: integer('used_points').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 支付历史表
export const paymentHistories = pgTable('payment_histories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  orderId: text('order_id').notNull().unique(),
  amount: integer('amount').notNull(), // 以分为单位
  pointsAdded: integer('points_added').notNull(),
  status: text('status').notNull(), // 'pending', 'success', 'failed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 表关系定义
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  userPoints: many(userPoints),
  paymentHistories: many(paymentHistories),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  steps: many(projectSteps),
  documents: many(documents),
}));

export const projectStepsRelations = relations(projectSteps, ({ one }) => ({
  project: one(projects, {
    fields: [projectSteps.projectId],
    references: [projects.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  project: one(projects, {
    fields: [documents.projectId],
    references: [projects.id],
  }),
}));

export const userPointsRelations = relations(userPoints, ({ one }) => ({
  user: one(users, {
    fields: [userPoints.userId],
    references: [users.id],
  }),
}));

export const paymentHistoriesRelations = relations(paymentHistories, ({ one }) => ({
  user: one(users, {
    fields: [paymentHistories.userId],
    references: [users.id],
  }),
}));