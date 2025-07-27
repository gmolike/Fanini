// seed/seeders/23-seedEventAuditLog.ts
import { Connection, PoolConnection } from "mysql2/promise";
import { generateId, dateHelpers } from "../helpers/index.js";

const seedEventAuditLog = async (
  connection: Connection | PoolConnection,
): Promise<void> => {
  try {
    await connection.beginTransaction();

    // Get some events and users
    const [events] = (await connection.execute(
      "SELECT id, titel, status FROM events LIMIT 10",
    )) as [any[], any];

    const [users] = (await connection.execute(
      'SELECT id, email FROM users WHERE role IN ("VORSTAND", "BEIRAT", "TEAM_EVENT") LIMIT 5',
    )) as [any[], any];

    const eventData = events as any[];
    const userData = users as any[];

    const auditEntries = [];

    // Generate audit entries
    for (const event of eventData) {
      // Status changes
      auditEntries.push({
        id: generateId("eal"),
        event_id: event.id,
        action: "status_changed",
        field_name: "status",
        old_value: "entwurf",
        new_value: event.status,
        changed_by: userData[0].id,
        changed_by_user_id: userData[0].id, // Diese Spalte existiert bereits
        ip_address: "192.168.1.1",
        user_agent: "Mozilla/5.0 Seed Script",
      });

      // Budget changes
      if (Math.random() > 0.5) {
        auditEntries.push({
          id: generateId("eal"),
          event_id: event.id,
          action: "field_updated",
          field_name: "budget",
          old_value: "1000",
          new_value: "1500",
          changed_by: userData[1].id,
          changed_by_user_id: userData[1].id,
          ip_address: "192.168.1.2",
          user_agent: "Mozilla/5.0 Seed Script",
        });
      }
    }

    // Insert audit entries - changed_by_user_id existiert bereits in der Tabelle
    for (const entry of auditEntries) {
      await connection.execute(
        `INSERT INTO event_audit_log
         (id, event_id, action, field_name, old_value, new_value,
          changed_by, changed_by_user_id, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.id,
          entry.event_id,
          entry.action,
          entry.field_name,
          entry.old_value,
          entry.new_value,
          entry.changed_by,
          entry.changed_by_user_id,
          entry.ip_address,
          entry.user_agent,
        ],
      );
    }

    await connection.commit();
    console.log(
      `✅ ${auditEntries.length} Event audit log entries seeded successfully`,
    );
  } catch (error) {
    await connection.rollback();
    console.error("❌ Event audit log seeding failed:", error);
    throw error;
  }
};

export default seedEventAuditLog;
