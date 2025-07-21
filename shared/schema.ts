import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("teacher"),
  institution: varchar("institution"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id").notNull().unique(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  className: varchar("class_name").notNull(),
  parentName: varchar("parent_name"),
  parentPhone: varchar("parent_phone"),
  profileImageUrl: varchar("profile_image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance records
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  date: timestamp("date").notNull(),
  status: varchar("status").notNull(), // present, absent, late
  arrivalTime: timestamp("arrival_time"),
  notes: text("notes"),
  recordedBy: varchar("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activities log
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // login, attendance, alert, system
  description: text("description").notNull(),
  userId: varchar("user_id").references(() => users.id),
  studentId: integer("student_id").references(() => students.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Alerts
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // absence, late, emergency
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  severity: varchar("severity").notNull(), // low, medium, high
  studentId: integer("student_id").references(() => students.id),
  isActive: boolean("is_active").default(true),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  activities: many(activities),
  attendance: many(attendance),
  resolvedAlerts: many(alerts),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  attendance: many(attendance),
  activities: many(activities),
  alerts: many(alerts),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
  recordedByUser: one(users, {
    fields: [attendance.recordedBy],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
  student: one(students, {
    fields: [activities.studentId],
    references: [students.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  student: one(students, {
    fields: [alerts.studentId],
    references: [students.id],
  }),
  resolvedByUser: one(users, {
    fields: [alerts.resolvedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
  institution: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
