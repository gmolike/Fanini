// seed/seeders/18-seedApprovalSystem.ts
import { Connection, PoolConnection } from 'mysql2/promise';
import { generateId, PREDEFINED_IDS } from '../helpers/index.js';

const seedApprovalSystem = async (connection: Connection | PoolConnection): Promise<void> => {
  try {
    await connection.beginTransaction();

    // 1. Approval Groups (aus Migration 004)
    const groups = [
      {
        id: 'grp_beirat',
        group_name: 'Beirat',
        group_type: 'role_based',
        config: JSON.stringify({ roles: ['role_beirat'] }),
        description: 'Alle Mitglieder des Beirats'
      },
      {
        id: 'grp_vorstand',
        group_name: 'Vorstand',
        group_type: 'role_based',
        config: JSON.stringify({ roles: ['role_vorstand'] }),
        description: 'Alle Mitglieder des Vorstands'
      },
      {
        id: 'grp_beirat_vorstand',
        group_name: 'Beirat oder Vorstand',
        group_type: 'role_based',
        config: JSON.stringify({ roles: ['role_beirat', 'role_vorstand'] }),
        description: 'Beirat oder Vorstand können genehmigen'
      },
      {
        id: 'grp_kassenprufer',
        group_name: 'Kassenprüfer',
        group_type: 'role_based',
        config: JSON.stringify({ roles: ['role_kassenprufer'] }),
        description: 'Kassenprüfer für Finanzangelegenheiten'
      }
    ];

    for (const group of groups) {
      await connection.execute(
        `INSERT INTO approval_groups
         (id, group_name, group_type, config, description, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [group.id, group.group_name, group.group_type, group.config, group.description, 1]
      );
    }

    // 2. Approval Field Rules
    const fieldRules = [
      {
        id: 'rule_m_vorname',
        entity_type: 'mitglieder',
        field_name: 'vorname',
        rule_name: 'Vorname ändern',
        approval_type: 'immediate',
        applies_to_roles: JSON.stringify(['role_mitglied', 'role_team_event', 'role_team_medien', 'role_team_technik', 'role_team_verein']),
        condition_type: 'always',
        min_approvers: 2,
        approver_selection: 'any',
        self_approval_allowed: 0,
        bypass_roles: JSON.stringify(['role_admin', 'role_vorstand']),
        priority: 'high',
        escalation_enabled: 1,
        notification_channels: JSON.stringify(['email', 'system'])
      },
      {
        id: 'rule_m_nachname',
        entity_type: 'mitglieder',
        field_name: 'nachname',
        rule_name: 'Nachname ändern',
        approval_type: 'immediate',
        applies_to_roles: JSON.stringify(['role_mitglied', 'role_team_event', 'role_team_medien', 'role_team_technik', 'role_team_verein']),
        condition_type: 'always',
        min_approvers: 2,
        approver_selection: 'any',
        self_approval_allowed: 0,
        bypass_roles: JSON.stringify(['role_admin', 'role_vorstand']),
        priority: 'high',
        escalation_enabled: 1,
        notification_channels: JSON.stringify(['email', 'system'])
      },
      {
        id: 'rule_m_iban',
        entity_type: 'mitglieder',
        field_name: 'iban',
        rule_name: 'IBAN ändern',
        approval_type: 'immediate',
        applies_to_roles: null,
        condition_type: 'always',
        min_approvers: 2,
        approver_selection: 'sequential',
        self_approval_allowed: 0,
        bypass_roles: JSON.stringify(['role_admin']),
        priority: 'critical',
        escalation_enabled: 1,
        notification_channels: JSON.stringify(['email', 'system', 'sms'])
      },
      {
        id: 'rule_e_budget',
        entity_type: 'events',
        field_name: 'budget',
        rule_name: 'Event Budget über 1000€',
        approval_type: 'immediate',
        applies_to_roles: null,
        condition_type: 'threshold',
        condition_config: JSON.stringify({ threshold: 1000, operator: '>', compare_with: 'old_value' }),
        min_approvers: 2,
        approver_selection: 'sequential',
        self_approval_allowed: 0,
        bypass_roles: JSON.stringify(['role_admin']),
        priority: 'high',
        escalation_enabled: 1,
        notification_channels: JSON.stringify(['email', 'system'])
      }
    ];

    for (const rule of fieldRules) {
      await connection.execute(
        `INSERT INTO approval_field_rules
         (id, entity_type, field_name, rule_name, approval_type, applies_to_roles,
          condition_type, condition_config, min_approvers, approver_selection,
          self_approval_allowed, bypass_roles, priority, escalation_enabled,
          notification_channels, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          rule.id, rule.entity_type, rule.field_name, rule.rule_name,
          rule.approval_type, rule.applies_to_roles, rule.condition_type,
          rule.condition_config || null, rule.min_approvers, rule.approver_selection,
          rule.self_approval_allowed, rule.bypass_roles, rule.priority,
          rule.escalation_enabled, rule.notification_channels, 1
        ]
      );
    }

    // 3. Rule-Group Verknüpfungen
    const ruleGroups = [
      { rule_id: 'rule_m_vorname', group_id: 'grp_beirat_vorstand', group_order: 0 },
      { rule_id: 'rule_m_nachname', group_id: 'grp_beirat_vorstand', group_order: 0 },
      { rule_id: 'rule_m_iban', group_id: 'grp_kassenprufer', group_order: 0 },
      { rule_id: 'rule_m_iban', group_id: 'grp_vorstand', group_order: 1 },
      { rule_id: 'rule_e_budget', group_id: 'grp_kassenprufer', group_order: 0 },
      { rule_id: 'rule_e_budget', group_id: 'grp_vorstand', group_order: 1 }
    ];

    for (const rg of ruleGroups) {
      await connection.execute(
        `INSERT INTO approval_rule_groups
         (rule_id, group_id, group_order, is_optional)
         VALUES (?, ?, ?, ?)`,
        [rg.rule_id, rg.group_id, rg.group_order, 0]
      );
    }

    // 4. Notification Templates
    const templates = [
      {
        id: 'tpl_new_member',
        template_name: 'Neue Mitgliedsdatenänderung',
        template_type: 'new_request',
        subject_template: 'Genehmigung erforderlich: {{field_label}} für {{member_name}}',
        body_template: `Hallo {{approver_name}},

{{requester_name}} hat eine Änderung beantragt:

Mitglied: {{member_name}}
Feld: {{field_label}}
Alter Wert: {{old_value}}
Neuer Wert: {{new_value}}

Zur Genehmigung: {{approval_link}}

Mit freundlichen Grüßen
Faninitiative Spandau e.V.`,
        available_variables: JSON.stringify({
          approver_name: 'Name des Genehmigers',
          requester_name: 'Name des Antragstellers',
          member_name: 'Name des betroffenen Mitglieds',
          field_label: 'Bezeichnung des Feldes',
          old_value: 'Bisheriger Wert',
          new_value: 'Neuer Wert',
          approval_link: 'Link zur Genehmigungsseite'
        })
      },
      {
        id: 'tpl_reminder',
        template_name: 'Erinnerung: Ausstehende Genehmigung',
        template_type: 'reminder',
        subject_template: 'Erinnerung: {{open_count}} Genehmigungen ausstehend',
        body_template: `Hallo {{approver_name}},

Sie haben {{open_count}} ausstehende Genehmigungen.

Zur Übersicht: {{approval_link}}

Mit freundlichen Grüßen
Faninitiative Spandau e.V.`,
        available_variables: JSON.stringify({
          approver_name: 'Name des Genehmigers',
          open_count: 'Anzahl offener Genehmigungen',
          approval_link: 'Link zur Übersicht'
        })
      }
    ];

    for (const tpl of templates) {
      await connection.execute(
        `INSERT INTO approval_notification_templates
         (id, template_name, template_type, subject_template, body_template,
          available_variables, include_change_details, include_approve_link)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tpl.id, tpl.template_name, tpl.template_type, tpl.subject_template,
          tpl.body_template, tpl.available_variables, 1, 1
        ]
      );
    }

    // 5. Eskalationsregeln
    const escalations = [
      {
        id: generateId('esc'),
        rule_id: 'rule_m_vorname',
        escalation_level: 1,
        trigger_after_hours: 24,
        trigger_on_rejection: 0,
        escalate_to_group_id: 'grp_vorstand',
        override_min_approvers: 1,
        notification_urgency: 'high'
      },
      {
        id: generateId('esc'),
        rule_id: 'rule_m_iban',
        escalation_level: 1,
        trigger_after_hours: 12,
        trigger_on_rejection: 0,
        escalate_to_group_id: 'grp_vorstand',
        override_min_approvers: null,
        notification_urgency: 'critical'
      }
    ];

    for (const esc of escalations) {
      await connection.execute(
        `INSERT INTO approval_escalations
         (id, rule_id, escalation_level, trigger_after_hours, trigger_on_rejection,
          escalate_to_group_id, override_min_approvers, auto_approve, notification_urgency)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          esc.id, esc.rule_id, esc.escalation_level, esc.trigger_after_hours,
          esc.trigger_on_rejection, esc.escalate_to_group_id,
          esc.override_min_approvers, 0, esc.notification_urgency
        ]
      );
    }

    // 6. Legacy Approval Rules (für Kompatibilität)
    const legacyRules = [
      {
        id: generateId('arl'),
        resource_type: 'member',
        action: 'edit',
        required_role_id: PREDEFINED_IDS.roleBeirat,
        min_approvers: 1,
        description: 'Mitgliederänderungen benötigen Beirat-Genehmigung'
      }
    ];

    for (const rule of legacyRules) {
      await connection.execute(
        `INSERT INTO approval_rules
         (id, resource_type, action, required_role_id, min_approvers, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [rule.id, rule.resource_type, rule.action, rule.required_role_id,
         rule.min_approvers, rule.description]
      );
    }

    // 7. Sample Approval Requests mit rule_id
    const requests = [
      {
        id: generateId('apr'),
        request_type: 'member_edit',
        resource_type: 'member',
        resource_id: 'mbr_event1',
        requested_by: PREDEFINED_IDS.teamEvent1,
        status: 'pending',
        old_data: JSON.stringify({ vorname: 'Felix' }),
        new_data: JSON.stringify({ vorname: 'Felix-Max' }),
        changes_summary: 'Vorname aktualisiert',
        priority: 'high',
        rule_id: 'rule_m_vorname'
      }
    ];

    for (const request of requests) {
      await connection.execute(
        `INSERT INTO approval_requests
         (id, request_type, resource_type, resource_id, requested_by,
          status, old_data, new_data, changes_summary, priority, due_date, rule_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          request.id, request.request_type, request.resource_type,
          request.resource_id, request.requested_by, request.status,
          request.old_data, request.new_data, request.changes_summary,
          request.priority, null, request.rule_id
        ]
      );

      // Action Log Entry
      await connection.execute(
        `INSERT INTO approval_action_log
         (id, request_id, action_type, performed_by, details)
         VALUES (?, ?, ?, ?, ?)`,
        [
          generateId('aal'),
          request.id,
          'created',
          request.requested_by,
          JSON.stringify({ source: 'seed' })
        ]
      );
    }

    await connection.commit();
    console.log('✅ Extended approval system seeded successfully');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Extended approval system seeding failed:', error);
    throw error;
  }
};

export default seedApprovalSystem;
