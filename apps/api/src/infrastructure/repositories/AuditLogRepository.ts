// apps/api/src/infrastructure/repositories/AuditLogRepository.ts
import type {
  IAuditLogRepository,
  AuditLogFilters,
  AuditLogStats,
} from "@/domain/repositories/IAuditLogRepository";
import type { AuditLog } from "@/domain/entities/AuditLog";
import { createAuditLog } from "@/domain/entities/AuditLog";
import type { PoolConnection } from "mysql2/promise";

export const createAuditLogRepository = (
  getConnection: () => Promise<PoolConnection>,
): IAuditLogRepository => ({
  create: async (log) => {
    const conn = await getConnection();
    try {
      const auditLog = createAuditLog(log);

      await conn.execute(
        `INSERT INTO audit_logs (
          id, timestamp, user_id, user_name, action,
          entity_type, entity_id, entity_name, changes,
          metadata, ip_address, user_agent, session_id, request_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          auditLog.id,
          auditLog.timestamp,
          auditLog.userId,
          auditLog.userName,
          auditLog.action,
          auditLog.entityType,
          auditLog.entityId,
          auditLog.entityName,
          JSON.stringify(auditLog.changes),
          JSON.stringify(auditLog.metadata),
          auditLog.context.ipAddress,
          auditLog.context.userAgent,
          auditLog.context.sessionId,
          auditLog.context.requestId,
        ],
      );

      return auditLog;
    } finally {
      conn.release();
    }
  },

  findAll: async (filters) => {
    const conn = await getConnection();
    try {
      let query = "SELECT * FROM audit_logs WHERE 1=1";
      const params: any[] = [];

      if (filters.userId) {
        query += " AND user_id = ?";
        params.push(filters.userId);
      }

      if (filters.entityType) {
        query += " AND entity_type = ?";
        params.push(filters.entityType);
      }

      if (filters.entityId) {
        query += " AND entity_id = ?";
        params.push(filters.entityId);
      }

      if (filters.action) {
        if (Array.isArray(filters.action)) {
          query += ` AND action IN (${filters.action.map(() => "?").join(",")})`;
          params.push(...filters.action);
        } else {
          query += " AND action = ?";
          params.push(filters.action);
        }
      }

      if (filters.fromDate) {
        query += " AND timestamp >= ?";
        params.push(filters.fromDate);
      }

      if (filters.toDate) {
        query += " AND timestamp <= ?";
        params.push(filters.toDate);
      }

      query += " ORDER BY timestamp DESC";

      if (filters.limit) {
        query += " LIMIT ?";
        params.push(filters.limit);

        if (filters.offset) {
          query += " OFFSET ?";
          params.push(filters.offset);
        }
      }

      const [rows] = await conn.execute(query, params);

      return (rows as any[]).map((row) => ({
        id: row.id,
        timestamp: row.timestamp,
        userId: row.user_id,
        userName: row.user_name,
        action: row.action,
        entityType: row.entity_type,
        entityId: row.entity_id,
        entityName: row.entity_name,
        changes: row.changes ? JSON.parse(row.changes) : undefined,
        metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
        context: {
          ipAddress: row.ip_address,
          userAgent: row.user_agent,
          sessionId: row.session_id,
          requestId: row.request_id,
        },
      }));
    } finally {
      conn.release();
    }
  },

  findByEntity: async (entityType, entityId) => {
    return await exports.findAll({ entityType, entityId });
  },

  findByUser: async (userId, filters = {}) => {
    return await exports.findAll({ ...filters, userId });
  },

  count: async (filters) => {
    const conn = await getConnection();
    try {
      let query = "SELECT COUNT(*) as count FROM audit_logs WHERE 1=1";
      const params: any[] = [];

      // Gleiche Filter-Logik wie findAll
      if (filters.userId) {
        query += " AND user_id = ?";
        params.push(filters.userId);
      }

      // ... weitere Filter ...

      const [rows] = await conn.execute(query, params);
      return (rows as any)[0].count;
    } finally {
      conn.release();
    }
  },

  getStats: async (filters) => {
    const conn = await getConnection();
    try {
      // Basis WHERE Klausel aufbauen
      let whereClause = "WHERE 1=1";
      const params: any[] = [];

      if (filters.fromDate) {
        whereClause += " AND timestamp >= ?";
        params.push(filters.fromDate);
      }

      if (filters.toDate) {
        whereClause += " AND timestamp <= ?";
        params.push(filters.toDate);
      }

      // Queries für Statistiken
      const queries = [
        `SELECT COUNT(*) as totalEntries FROM audit_logs ${whereClause}`,
        `SELECT action, COUNT(*) as count FROM audit_logs ${whereClause} GROUP BY action`,
        `SELECT user_id, COUNT(*) as count FROM audit_logs ${whereClause} GROUP BY user_id LIMIT 10`,
        `SELECT entity_type, COUNT(*) as count FROM audit_logs ${whereClause} GROUP BY entity_type`,
      ];

      const results = await Promise.all(
        queries.map((q) => conn.execute(q, [...params])),
      );

      const totalEntries = (results[0][0] as any)[0].totalEntries;

      const actionCounts: Record<string, number> = {};
      (results[1][0] as any[]).forEach((row) => {
        actionCounts[row.action] = row.count;
      });

      const userCounts: Record<string, number> = {};
      (results[2][0] as any[]).forEach((row) => {
        userCounts[row.user_id] = row.count;
      });

      const entityTypeCounts: Record<string, number> = {};
      (results[3][0] as any[]).forEach((row) => {
        entityTypeCounts[row.entity_type] = row.count;
      });

      return {
        totalEntries,
        actionCounts,
        userCounts,
        entityTypeCounts,
      };
    } finally {
      conn.release();
    }
  },

  deleteOlderThan: async (date) => {
    const conn = await getConnection();
    try {
      const [result] = await conn.execute(
        "DELETE FROM audit_logs WHERE timestamp < ? AND action NOT IN ('created', 'deleted', 'approved')",
        [date],
      );

      return (result as any).affectedRows;
    } finally {
      conn.release();
    }
  },
});
