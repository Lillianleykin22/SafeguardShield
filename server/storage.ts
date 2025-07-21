import {
  users,
  students,
  attendance,
  activities,
  alerts,
  type User,
  type UpsertUser,
  type Student,
  type InsertStudent,
  type Attendance,
  type InsertAttendance,
  type Activity,
  type InsertActivity,
  type Alert,
  type InsertAlert,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Student operations
  getStudents(filters?: { search?: string; className?: string; status?: string }): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student>;
  
  // Attendance operations
  getAttendanceByDate(date: Date): Promise<Attendance[]>;
  getStudentAttendance(studentId: number, limit?: number): Promise<Attendance[]>;
  recordAttendance(attendance: InsertAttendance): Promise<Attendance>;
  
  // Activity operations
  getRecentActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Alert operations
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number, resolvedBy: string): Promise<Alert>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    totalStudents: number;
    presentToday: number;
    absentToday: number;
    activeAlerts: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Student operations
  async getStudents(filters?: { search?: string; className?: string; status?: string }): Promise<Student[]> {
    let query = db.select().from(students);
    
    const conditions = [];
    
    if (filters?.search) {
      conditions.push(
        or(
          like(students.firstName, `%${filters.search}%`),
          like(students.lastName, `%${filters.search}%`),
          like(students.studentId, `%${filters.search}%`)
        )
      );
    }
    
    if (filters?.className) {
      conditions.push(eq(students.className, filters.className));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(students.firstName);
  }

  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }

  async updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student> {
    const [updatedStudent] = await db
      .update(students)
      .set({ ...student, updatedAt: new Date() })
      .where(eq(students.id, id))
      .returning();
    return updatedStudent;
  }

  // Attendance operations
  async getAttendanceByDate(date: Date): Promise<Attendance[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await db
      .select()
      .from(attendance)
      .where(and(
        eq(attendance.date, startOfDay)
      ));
  }

  async getStudentAttendance(studentId: number, limit = 30): Promise<Attendance[]> {
    return await db
      .select()
      .from(attendance)
      .where(eq(attendance.studentId, studentId))
      .orderBy(desc(attendance.date))
      .limit(limit);
  }

  async recordAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return newAttendance;
  }

  // Activity operations
  async getRecentActivities(limit = 20): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  // Alert operations
  async getActiveAlerts(): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(eq(alerts.isActive, true))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async resolveAlert(id: number, resolvedBy: string): Promise<Alert> {
    const [resolvedAlert] = await db
      .update(alerts)
      .set({
        isActive: false,
        resolvedBy,
        resolvedAt: new Date(),
      })
      .where(eq(alerts.id, id))
      .returning();
    return resolvedAlert;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalStudents: number;
    presentToday: number;
    absentToday: number;
    activeAlerts: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [totalStudentsResult] = await db
      .select({ count: students.id })
      .from(students)
      .where(eq(students.isActive, true));
    
    const todayAttendance = await this.getAttendanceByDate(today);
    const presentToday = todayAttendance.filter(a => a.status === 'present').length;
    const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
    
    const activeAlertsList = await this.getActiveAlerts();
    
    return {
      totalStudents: totalStudentsResult?.count || 0,
      presentToday,
      absentToday,
      activeAlerts: activeAlertsList.length,
    };
  }
}

export const storage = new DatabaseStorage();
