// seed/seeders/18-seedApprovalSystem.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, PREDEFINED_IDS } from '../helpers/index.js';

const seedApprovalSystem = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // 1. Approval Rules
    const rules = [
      {
        id: generateId('arl'),
        resource_type: 'member',
        action: 'edit',
        required_role_id: PREDEFINED_IDS.roleBeirat,
        min_approvers: 1,
        description: 'Mitgliederänderungen benötigen Beirat-Genehmigung'
      },
      {
        id: generateId('arl'),
        resource_type: 'role',
        action: 'assign',
        required_role_id: PREDEFINED_IDS.roleVorstand,
        min_approvers: 2,
        description: 'Rollenzuweisungen benötigen 2 Vorstände'
      },
      {
        id: generateId('arl'),
        resource_type: 'event',
        action: 'create',
        required_role_id: PREDEFINED_IDS.roleBeirat,
        min_approvers: 1,
        description: 'Events über 1000€ Budget benötigen Genehmigung'
      },
      {
        id: generateId('arl'),
        resource_type: 'expense',
        action: 'approve',
        required_role_id: PREDEFINED_IDS.roleBeirat,
        min_approvers: 1,
        description: 'Ausgaben über 500€ benötigen Genehmigung'
      }
    ];

    for (const rule of rules) {
      await connection.execute(
        `INSERT INTO approval_rules
         (id, resource_type, action, required_role_id, min_approvers, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [rule.id, rule.resource_type, rule.action, rule.required_role_id,
         rule.min_approvers, rule.description]
      );
    }

    // 2. Sample Approval Requests
    const requests = [
      {
        id: generateId('apr'),
        request_type: 'member_edit',
        resource_type: 'member',
        resource_id: 'mbr_event1',
        requested_by: PREDEFINED_IDS.teamEvent1,
        status: 'pending',
        old_data: JSON.stringify({ telefon: '+49 30 123456' }),
        new_data: JSON.stringify({ telefon: '+49 30 654321' }),
        changes_summary: 'Telefonnummer aktualisiert',
        priority: 'low',
        due_date: null  // Explizit null statt undefined
      },
      {
        id: generateId('apr'),
        request_type: 'role_assignment',
        resource_type: 'role',
        resource_id: PREDEFINED_IDS.teamMedien1,
        requested_by: PREDEFINED_IDS.beirat1,
        status: 'approved',
        old_data: null,  // Explizit null
        new_data: JSON.stringify({ roleId: PREDEFINED_IDS.roleTeamMedien }),
        changes_summary: 'Zuweisung zum Team Medien',
        priority: 'medium',
        due_date: null  // Explizit null
      }
    ];

    for (const request of requests) {
      await connection.execute(
        `INSERT INTO approval_requests
         (id, request_type, resource_type, resource_id, requested_by,
          status, old_data, new_data, changes_summary, priority, due_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          request.id,
          request.request_type,
          request.resource_type,
          request.resource_id,
          request.requested_by,
          request.status,
          request.old_data,  // Jetzt null statt undefined
          request.new_data,
          request.changes_summary,
          request.priority,
          request.due_date   // Jetzt null statt undefined
        ]
      );
    }

    // 3. Sample Approval Actions für den approved Request
    const approvedRequestId = requests[1].id;
    await connection.execute(
      `INSERT INTO approval_actions
       (id, request_id, action, performed_by, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [
        generateId('aac'),
        approvedRequestId,
        'approved',
        PREDEFINED_IDS.vorstand1,
        'Rollenzuweisung genehmigt'
      ]
    );

    // 4. Sample Notifications
    await connection.execute(
      `INSERT INTO approval_notifications
       (id, request_id, notified_user_id, notification_type)
       VALUES (?, ?, ?, ?)`,
      [
        generateId('anf'),
        requests[0].id,
        PREDEFINED_IDS.beirat1,
        'new_request'
      ]
    );

    await connection.commit();
    console.log(`✅ Approval system seeded successfully`);
  } catch (error) {
    await connection.rollback();
    console.error('❌ Approval system seeding failed:', error);
    throw error;
  }
};

export default seedApprovalSystem;
