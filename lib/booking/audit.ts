/**
 * Append-only audit trail. Failures to audit never fail the action being
 * audited — a booking must not be lost because the log insert hiccuped —
 * but they are loudly reported to the server log.
 */

import type { Db } from "../db/client";
import { auditLog } from "../db/schema";

export interface AuditEntry {
  /** Admin e-mail, `system` for cron, provider name for webhooks, `guest` for the public flow. */
  actor: string;
  action: string;
  entity: "booking" | "payment" | "season" | "blocked_date" | "property" | "ical_feed" | "guest";
  entityId?: string;
  before?: unknown;
  after?: unknown;
  ip?: string;
  userAgent?: string;
}

export async function audit(db: Db, entry: AuditEntry): Promise<void> {
  try {
    await db.insert(auditLog).values({
      actor: entry.actor,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId ?? null,
      before: entry.before ?? null,
      after: entry.after ?? null,
      ip: entry.ip ?? null,
      userAgent: entry.userAgent ?? null,
    });
  } catch (error) {
    console.error("[audit] failed to record entry", entry.action, error);
  }
}
