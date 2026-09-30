export type LeadStatus = "New" | "Contacted" | "In Progress" | "Hold" | "Closed";
export type ProjectStatus = "Hold" | "In Progress" | "Delivered";

export interface Lead {
  id: string;
  source: "Contact Form" | "Popup Modal" | "USA - Contact Form" | "USA - Popup Modal" | "Manual" | "Meta" | string;
  name: string;
  phone: string;
  email?: string;
  video_type: string;
  video_quantity?: number | string;
  business: string;
  website?: string;
  location?: string;
  industry?: string;
  requirement?: string;
  additional?: string;
  created_at: string;
  status: LeadStatus;
  project_status?: ProjectStatus;
  notes?: string;
  closed_by?: string;
  closed_at?: string;
  delivery_date?: string;
  delivered_at?: string;
  meeting_date?: string;
  meeting_time?: string;
  meeting_status?: string;
  meeting_link?: string;
  meeting_type?: string;
  assigned_admin?: string;
  campaign_name?: string;
  adset_name?: string;
  ad_name?: string;
  form_name?: string;
  meta_lead_id?: string;
  is_duplicate?: boolean;
  deleted_at?: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "super_admin" | "admin" | "leads_manager";
  status: "active" | "inactive";
  created_at: string;
  last_login_at?: string;
}

export interface ActivityLog {
  id: string;
  lead_id?: string;
  action: string;
  details: string;
  performed_by: string;
  user_role: string;
  created_at: string;
}

export interface LoginLog {
  id: string;
  email: string;
  role: string;
  ip_address: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  distance_meters?: number;
  is_within_geofence?: boolean;
  user_agent: string;
  created_at: string;
  status: "success" | "failed" | "blocked_location" | "session_terminated" | string;
}

export interface CalendlyMeeting {
  id: string;
  lead_id?: string;
  client_name: string;
  email: string;
  phone?: string;
  meeting_date: string;
  meeting_time: string;
  meeting_status: "scheduled" | "upcoming" | "completed" | "rescheduled" | "cancelled" | string;
  meeting_link: string;
  meeting_type?: string;
  assigned_admin?: string;
  notes?: string;
  created_at: string;
  cancelled_at?: string;
  deleted_at?: string | null;
  /** Result recorded by a CRM user (completed / not_conducted / no_show): Calendly sync won't overwrite it */
  outcome_locked?: boolean | null;
  outcome_set_by?: string | null;
  outcome_set_at?: string | null;
}

/** Statuses that describe what happened after the meeting time (a CRM user can set these) */
export const MEETING_OUTCOME_STATUSES = ["completed", "not_conducted", "no_show"] as const;
export type MeetingOutcome = (typeof MEETING_OUTCOME_STATUSES)[number];

export interface CRMNotification {
  id: string;
  type:
    | "meeting_new"
    | "meeting_upcoming"
    | "meeting_rescheduled"
    | "meeting_cancelled"
    | "meeting_completed"
    | "lead_new"
    | "lead_meta"
    | "lead_manual"
    | "lead_status"
    | "lead_closed"
    | "project_status"
    | "project_delivered"
    | string;
  title: string;
  message: string;
  entity_id?: string;
  actor?: string;
  is_read: boolean;
  created_at: string;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED";

export interface Order {
  id: string;
  paypal_order_id: string;
  paypal_capture_id?: string | undefined;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | undefined;
  customer_company?: string | undefined;
  item_type: "individual" | "package" | "setup" | string;
  item_id: string;
  item_name: string;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  paypal_status?: string | undefined;
  raw_details?: string | undefined;
  created_at: string;
  updated_at: string;
}

let pgPool: any = null;

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_API_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_API_KEY;
  if (url && key) {
    return { url, key };
  }
  return null;
}

// 1. HTTP REST Adapter for Supabase (Guaranteed 100% cloud delivery without TCP/SSL port blocks)
async function supabaseRest(endpoint: string, options: RequestInit = {}) {
  const config = getSupabaseConfig();
  if (!config) return null;
  const res = await fetch(`${config.url}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      "apikey": config.key,
      "Authorization": `Bearer ${config.key}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Supabase REST Error (${res.status}): ${txt}`);
  }
  const txt = await res.text();
  if (!txt || txt.trim() === "") return [];
  try {
    return JSON.parse(txt);
  } catch {
    return [];
  }
}

// 2. Direct PostgreSQL Pool (For localhost development or direct pg connection)
async function getPool() {
  if (!pgPool) {
    const pg = await import("pg");
    const Pool = pg.default?.Pool || pg.Pool;
    const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
    if (!connectionString) return null;

    let cleanConnectionString = connectionString.trim();
    const isRemoteDb =
      cleanConnectionString.includes("supabase.co") ||
      cleanConnectionString.includes("neon.tech") ||
      cleanConnectionString.includes("pooler.supabase.com") ||
      !cleanConnectionString.includes("localhost");

    if (cleanConnectionString.includes("?sslmode=")) {
      cleanConnectionString = cleanConnectionString.split("?sslmode=")[0];
    } else if (cleanConnectionString.includes("&sslmode=")) {
      cleanConnectionString = cleanConnectionString.replace(/&sslmode=[^&]+/, "");
    }

    pgPool = new Pool({
      connectionString: cleanConnectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pgPool;
}

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;
  try {
    const pool = await getPool();
    if (pool) {
      const client = await pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS leads (
            id VARCHAR(64) PRIMARY KEY,
            source VARCHAR(64) NOT NULL,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(64) NOT NULL,
            email VARCHAR(255),
            video_type VARCHAR(128) NOT NULL,
            video_quantity VARCHAR(64),
            business VARCHAR(255) NOT NULL,
            website VARCHAR(255),
            location VARCHAR(255),
            industry VARCHAR(128),
            requirement TEXT,
            additional TEXT,
            status VARCHAR(32) DEFAULT 'New',
            project_status VARCHAR(32) DEFAULT 'In Progress',
            notes TEXT,
            closed_by VARCHAR(255),
            closed_at TIMESTAMP WITH TIME ZONE,
            delivery_date VARCHAR(64),
            delivered_at TIMESTAMP WITH TIME ZONE,
            meeting_date VARCHAR(64),
            meeting_time VARCHAR(64),
            meeting_status VARCHAR(64),
            meeting_link TEXT,
            meeting_type VARCHAR(128),
            assigned_admin VARCHAR(255),
            deleted_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          ALTER TABLE leads ADD COLUMN IF NOT EXISTS website VARCHAR(255);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS video_quantity VARCHAR(64);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_status VARCHAR(32) DEFAULT 'In Progress';
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS closed_by VARCHAR(255);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP WITH TIME ZONE;
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS delivery_date VARCHAR(64);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS meeting_date VARCHAR(64);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS meeting_time VARCHAR(64);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS meeting_status VARCHAR(64);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS meeting_link TEXT;
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS meeting_type VARCHAR(128);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_admin VARCHAR(255);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS campaign_name VARCHAR(255);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS adset_name VARCHAR(255);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS ad_name VARCHAR(255);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS form_name VARCHAR(255);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS meta_lead_id VARCHAR(128);
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT FALSE;
          ALTER TABLE leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

          CREATE TABLE IF NOT EXISTS admin_users (
            id VARCHAR(64) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(32) DEFAULT 'admin',
            status VARCHAR(32) DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            last_login_at TIMESTAMP WITH TIME ZONE
          );

          INSERT INTO admin_users (id, name, email, password, role, status, created_at)
          VALUES 
            ('usr_superadmin', 'Super Admin', 'sa@aistudio.us', 'Anay@8080', 'super_admin', 'active', NOW())
          ON CONFLICT (email) DO NOTHING;


          CREATE TABLE IF NOT EXISTS activity_logs (
            id VARCHAR(64) PRIMARY KEY,
            lead_id VARCHAR(64),
            action VARCHAR(128) NOT NULL,
            details TEXT,
            performed_by VARCHAR(255) NOT NULL,
            user_role VARCHAR(64),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS login_logs (
            id VARCHAR(64) PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            role VARCHAR(64),
            ip_address VARCHAR(128),
            location VARCHAR(255),
            user_agent TEXT,
            status VARCHAR(32) DEFAULT 'success',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
          ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
          ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS accuracy DOUBLE PRECISION;
          ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS distance_meters DOUBLE PRECISION;
          ALTER TABLE login_logs ADD COLUMN IF NOT EXISTS is_within_geofence BOOLEAN;

          CREATE TABLE IF NOT EXISTS calendly_meetings (
            id VARCHAR(64) PRIMARY KEY,
            lead_id VARCHAR(64),
            client_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(64),
            meeting_date VARCHAR(64) NOT NULL,
            meeting_time VARCHAR(64) NOT NULL,
            meeting_status VARCHAR(64) DEFAULT 'scheduled',
            meeting_link TEXT,
            meeting_type VARCHAR(128),
            assigned_admin VARCHAR(255),
            notes TEXT,
            deleted_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          ALTER TABLE calendly_meetings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
          ALTER TABLE calendly_meetings ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
          ALTER TABLE calendly_meetings ADD COLUMN IF NOT EXISTS outcome_locked BOOLEAN DEFAULT FALSE;
          ALTER TABLE calendly_meetings ADD COLUMN IF NOT EXISTS outcome_set_by VARCHAR(255);
          ALTER TABLE calendly_meetings ADD COLUMN IF NOT EXISTS outcome_set_at TIMESTAMP WITH TIME ZONE;

          CREATE TABLE IF NOT EXISTS crm_notifications (
            id VARCHAR(64) PRIMARY KEY,
            type VARCHAR(64) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            entity_id VARCHAR(64),
            actor VARCHAR(255),
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS crm_settings (
            key VARCHAR(64) PRIMARY KEY,
            value TEXT,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS orders (
            id VARCHAR(64) PRIMARY KEY,
            paypal_order_id VARCHAR(128) NOT NULL UNIQUE,
            paypal_capture_id VARCHAR(128),
            customer_name VARCHAR(255) NOT NULL,
            customer_email VARCHAR(255) NOT NULL,
            customer_phone VARCHAR(64),
            customer_company VARCHAR(255),
            item_type VARCHAR(64) NOT NULL,
            item_id VARCHAR(128) NOT NULL,
            item_name VARCHAR(255) NOT NULL,
            amount NUMERIC(10, 2) NOT NULL,
            currency VARCHAR(16) DEFAULT 'USD',
            payment_status VARCHAR(32) DEFAULT 'PENDING',
            paypal_status VARCHAR(64),
            raw_details TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        isInitialized = true;

        await ensureDefaultAccounts(client);

        // Remove the old @aistudio.com alias accounts (duplicates of the @aistudio.us ones)
        try {
          await client.query(
            `DELETE FROM admin_users
              WHERE LOWER(email) IN ('sa@aistudio.com', 'admin@aistudio.com', 'lm@aistudio.com')
                AND id <> 'usr_superadmin'`
          );
        } catch (cleanupErr) {
          console.warn("Legacy admin cleanup warning:", cleanupErr);
        }
      } finally {
        client.release();
      }
    }
  } catch (error) {
    console.warn("PostgreSQL init warning:", error);
  }
}

/**
 * Default login accounts as normal database users (not built in): created once each,
 * guarded by a flag so an account the Super Admin later edits / deletes never comes back.
 * Each runs on its own, and a failure is written to Activity History so it is visible.
 */
/** Last error from creating the default accounts (shown in User Management), null when OK */
let accountSetupError: string | null = null;
export function getAccountSetupError(): string | null {
  return accountSetupError;
}

async function ensureDefaultAccounts(client: any): Promise<void> {
  // Older databases may define admin_users.role as an ENUM type limited to
  // ('super_admin','admin'), which rejects 'leads_manager'. Convert it to plain text.
  try {
    const col = await client.query(
      `SELECT data_type FROM information_schema.columns WHERE table_name = 'admin_users' AND column_name = 'role' LIMIT 1`
    );
    if (col.rows[0]?.data_type === "USER-DEFINED") {
      await client.query(`ALTER TABLE admin_users ALTER COLUMN role DROP DEFAULT`);
      await client.query(`ALTER TABLE admin_users ALTER COLUMN role TYPE VARCHAR(32) USING role::text`);
      await client.query(`ALTER TABLE admin_users ALTER COLUMN role SET DEFAULT 'admin'`);
    }
  } catch (e) {
    console.warn("admin_users role column type check warning:", e);
  }

  // Older databases may also restrict the role with a CHECK constraint. Drop it.
  try {
    const cons = await client.query(
      `SELECT conname FROM pg_constraint
        WHERE conrelid = 'admin_users'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) ILIKE '%role%'`
    );
    for (const r of cons.rows) {
      await client.query(`ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS "${String(r.conname).replace(/"/g, "")}"`);
    }
  } catch (e) {
    console.warn("admin_users role constraint check warning:", e);
  }

  const seeds = [
    { flag: "seed_admin_aistudio_us_v1", id: "usr_admin_aistudio", name: "Admin", email: "admin@aistudio.us", password: "Admin@123", role: "admin" },
    { flag: "seed_lm_aistudio_us_v2", id: "usr_lm_aistudio", name: "Leads Manager", email: "lm@aistudio.us", password: "Leads@123", role: "leads_manager" },
  ];
  for (const sd of seeds) {
    try {
      const done = await client.query(`SELECT 1 FROM crm_settings WHERE key = $1`, [sd.flag]);
      if (done.rows.length > 0) continue;
      await client.query(
        `INSERT INTO admin_users (id, name, email, password, role, status, created_at)
         VALUES ($1, $2, $3, $4, $5, 'active', NOW())
         ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role, status = 'active'`,
        [sd.id, sd.name, sd.email, sd.password, sd.role]
      );
      await client.query(
        `INSERT INTO crm_settings (key, value, updated_at) VALUES ($1, 'done', NOW()) ON CONFLICT (key) DO NOTHING`,
        [sd.flag]
      );
      if (accountSetupError?.startsWith(sd.email)) accountSetupError = null;
    } catch (seedErr: any) {
      console.error(`Default account ${sd.email} could not be created:`, seedErr);
      accountSetupError = `${sd.email}: ${seedErr?.message || seedErr}`;
      try {
        await client.query(
          `INSERT INTO activity_logs (id, lead_id, action, details, performed_by, user_role, created_at)
           VALUES ($1, NULL, 'Default Account Setup Failed', $2, 'System', 'system', NOW())`,
          [`log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, `${sd.email}: ${seedErr?.message || seedErr}`]
        );
      } catch {}
    }
  }
}

export async function saveLead(data: {
  source: string;
  name: string;
  phone: string;
  email?: string;
  videoType: string;
  videoQuantity?: number | string;
  business: string;
  website?: string;
  location?: string;
  industry?: string;
  requirement?: string;
  additional?: string;
  status?: LeadStatus;
  projectStatus?: ProjectStatus;
  notes?: string;
  deliveryDate?: string;
  meetingDate?: string;
  meetingTime?: string;
  meetingLink?: string;
  meetingType?: string;
  meetingStatus?: string;
  assignedAdmin?: string;
  campaignName?: string;
  adsetName?: string;
  adName?: string;
  formName?: string;
  metaLeadId?: string;
  isDuplicate?: boolean;
}): Promise<Lead> {
  const id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const status: LeadStatus = data.status || "New";
  const projectStatus: ProjectStatus = data.projectStatus || "In Progress";
  const now = new Date().toISOString();

  // 13.1 Duplicate Lead Protection Check
  try {
    const existingLeads = await getLeads(false);
    const cleanDigits = data.phone ? data.phone.replace(/\D/g, "").slice(-10) : "";
    const cleanEmail = data.email ? data.email.trim().toLowerCase() : "";
    const metaId = data.metaLeadId?.trim();

    // Leads duplicate check: website form submissions belong to this USA CRM
    const isIndiaRegion = (src?: string, loc?: string, phone?: string) => {
      const s = (src || "").toLowerCase().trim();
      if (
        s.includes("contact") ||
        s.includes("popup") ||
        s.includes("modal") ||
        s.includes("quote") ||
        s.includes("usa") ||
        s.includes("website") ||
        s.includes("manual") ||
        s.includes("meta") ||
        s.includes("facebook") ||
        s.includes("instagram") ||
        s.includes("calendly")
      ) {
        return false;
      }
      const l = (loc || "").toLowerCase().trim();
      return s.includes("india") || s.includes("in -") || /\bindia\b/.test(l) || l.includes("bharat");
    };
    const newIsIndia = isIndiaRegion(data.source, data.location, data.phone);

    const matchedLead = existingLeads.find((l) => {
      if (isIndiaRegion(l.source, l.location, l.phone) !== newIsIndia) return false;
      if (metaId && l.meta_lead_id === metaId) return true;
      if (cleanEmail && l.email && l.email.trim().toLowerCase() === cleanEmail) return true;
      if (cleanDigits.length >= 10 && l.phone) {
        const lDigits = l.phone.replace(/\D/g, "").slice(-10);
        if (lDigits === cleanDigits) return true;
      }
      return false;
    });

    if (matchedLead) {
      // Update existing lead instead of duplicate
      const appendNote = `[Duplicate Import on ${new Date().toLocaleDateString()}]: ${data.source} submission consolidated.`;
      const updatedNotes = matchedLead.notes ? `${matchedLead.notes}\n${appendNote}` : appendNote;
      
      const updates: Partial<Lead> = {
        is_duplicate: true,
        notes: updatedNotes,
        video_type: data.videoType || matchedLead.video_type,
        video_quantity: data.videoQuantity ? String(data.videoQuantity) : matchedLead.video_quantity,
        website: data.website || matchedLead.website,
        industry: data.industry || matchedLead.industry,
        campaign_name: data.campaignName || matchedLead.campaign_name,
        adset_name: data.adsetName || matchedLead.adset_name,
        ad_name: data.adName || matchedLead.ad_name,
        form_name: data.formName || matchedLead.form_name,
        meta_lead_id: data.metaLeadId || matchedLead.meta_lead_id,
        requirement: data.requirement || matchedLead.requirement,
      };

      if (data.meetingDate) {
        updates.meeting_date = data.meetingDate;
        updates.meeting_time = data.meetingTime;
        updates.meeting_link = data.meetingLink;
        updates.meeting_status = data.meetingStatus || "scheduled";
      }

      await updateLead(matchedLead.id, updates);
      return { ...matchedLead, ...updates };
    }
  } catch (dupErr) {
    console.warn("Duplicate lead check error (continuing save):", dupErr);
  }

  const record: Lead = {
    id,
    source: data.source,
    name: data.name,
    phone: data.phone,
    email: data.email || undefined,
    video_type: data.videoType,
    video_quantity: data.videoQuantity || undefined,
    business: data.business,
    website: data.website || undefined,
    location: data.location || undefined,
    industry: data.industry || undefined,
    requirement: data.requirement || undefined,
    additional: data.additional || undefined,
    status,
    project_status: projectStatus,
    notes: data.notes || undefined,
    delivery_date: data.deliveryDate || undefined,
    meeting_date: data.meetingDate || undefined,
    meeting_time: data.meetingTime || undefined,
    meeting_link: data.meetingLink || undefined,
    meeting_status: data.meetingStatus || undefined,
    meeting_type: data.meetingType || undefined,
    assigned_admin: data.assignedAdmin || undefined,
    campaign_name: data.campaignName || undefined,
    adset_name: data.adsetName || undefined,
    ad_name: data.adName || undefined,
    form_name: data.formName || undefined,
    meta_lead_id: data.metaLeadId || undefined,
    is_duplicate: data.isDuplicate || false,
    created_at: now,
  };

  // Strategy A: Supabase REST
  if (getSupabaseConfig()) {
    try {
      const result = await supabaseRest("leads", {
        method: "POST",
        body: JSON.stringify({
          id: record.id,
          source: record.source,
          name: record.name,
          phone: record.phone,
          email: record.email || null,
          video_type: record.video_type,
          video_quantity: record.video_quantity || null,
          business: record.business,
          website: record.website || null,
          location: record.location || null,
          industry: record.industry || null,
          requirement: record.requirement || null,
          additional: record.additional || null,
          status: record.status,
          project_status: record.project_status || "In Progress",
          notes: record.notes || null,
          delivery_date: record.delivery_date || null,
          meeting_date: record.meeting_date || null,
          meeting_time: record.meeting_time || null,
          meeting_link: record.meeting_link || null,
          meeting_status: record.meeting_status || null,
          meeting_type: record.meeting_type || null,
          assigned_admin: record.assigned_admin || null,
          campaign_name: record.campaign_name || null,
          adset_name: record.adset_name || null,
          ad_name: record.ad_name || null,
          form_name: record.form_name || null,
          meta_lead_id: record.meta_lead_id || null,
          is_duplicate: record.is_duplicate || false,
          created_at: record.created_at,
        }),
      });
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }
      return record;
    } catch (supabaseError) {
      console.warn("Supabase REST failed, falling back to PostgreSQL pool:", supabaseError);
    }
  }

  // Strategy B: PostgreSQL pool
  await initDb();
  const pool = await getPool();
  if (pool) {
    const res = await pool.query(
      `INSERT INTO leads (id, source, name, phone, email, video_type, video_quantity, business, website, location, industry, requirement, additional, status, project_status, notes, delivery_date, meeting_date, meeting_time, meeting_link, meeting_status, meeting_type, assigned_admin, campaign_name, adset_name, ad_name, form_name, meta_lead_id, is_duplicate, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, NOW())
       RETURNING *`,
      [
        id,
        data.source,
        data.name,
        data.phone,
        data.email || null,
        data.videoType,
        data.videoQuantity ? String(data.videoQuantity) : null,
        data.business,
        data.website || null,
        data.location || null,
        data.industry || null,
        data.requirement || null,
        data.additional || null,
        status,
        projectStatus,
        data.notes || null,
        data.deliveryDate || null,
        data.meetingDate || null,
        data.meetingTime || null,
        data.meetingLink || null,
        data.meetingStatus || null,
        data.meetingType || null,
        data.assignedAdmin || null,
        data.campaignName || null,
        data.adsetName || null,
        data.adName || null,
        data.formName || null,
        data.metaLeadId || null,
        data.isDuplicate || false,
      ]
    );
    return res.rows[0];
  }

  // Resilient in-memory fallback so leads are never lost even if external DB is temporarily unreachable
  const existingIdx = inMemoryLeads.findIndex((l) => l.id === record.id);
  if (existingIdx >= 0) {
    inMemoryLeads[existingIdx] = record;
  } else {
    inMemoryLeads.unshift(record);
  }
  return record;
}

const inMemoryLeads: Lead[] = [];

export async function getLeads(includeDeleted = false): Promise<Lead[]> {
  let dbLeads: Lead[] = [];

  // Strategy A: Supabase REST
  if (getSupabaseConfig()) {
    try {
      const endpoint = includeDeleted
        ? "leads?select=*&order=created_at.desc"
        : "leads?deleted_at=is.null&select=*&order=created_at.desc";
      const rows = await supabaseRest(endpoint);
      if (Array.isArray(rows)) {
        dbLeads = rows as Lead[];
      }
    } catch (err) {
      console.warn("Supabase REST getLeads fallback:", err);
    }
  }

  // Strategy B: PostgreSQL pool
  if (dbLeads.length === 0) {
    await initDb();
    try {
      const pool = await getPool();
      if (pool) {
        const query = includeDeleted
          ? "SELECT * FROM leads ORDER BY created_at DESC"
          : "SELECT * FROM leads WHERE deleted_at IS NULL ORDER BY created_at DESC";
        const res = await pool.query(query);
        dbLeads = res.rows;
      }
    } catch (error) {
      console.error("PostgreSQL Select error:", error);
    }
  }

  const dbIds = new Set(dbLeads.map((l) => l.id));
  const memoryFiltered = inMemoryLeads.filter((l) => {
    if (dbIds.has(l.id)) return false;
    if (!includeDeleted && l.deleted_at) return false;
    return true;
  });

  return [...memoryFiltered, ...dbLeads];
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<boolean> {
  if (getSupabaseConfig()) {
    try {
      await supabaseRest(`leads?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      return true;
    } catch (err) {
      console.warn("Supabase REST updateLead fallback:", err);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const fields = Object.keys(updates);
      if (fields.length === 0) return true;
      const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
      const values = fields.map((f) => (updates as any)[f]);
      const res = await pool.query(`UPDATE leads SET ${setClauses} WHERE id = $${fields.length + 1}`, [
        ...values,
        id,
      ]);
      return (res.rowCount ?? 0) > 0;
    }
  } catch (error) {
    console.error("PostgreSQL updateLead error:", error);
  }
  return false;
}

export async function updateLeadStatus(
  id: string,
  status: Lead["status"],
  meta?: { closed_by?: string; delivery_date?: string; closed_at?: string }
): Promise<boolean> {
  const payload: Partial<Lead> = { status };
  if (status === "Closed") {
    payload.closed_by = meta?.closed_by || "Admin";
    payload.closed_at = meta?.closed_at || new Date().toISOString();
    if (meta?.delivery_date) {
      payload.delivery_date = meta.delivery_date;
    }
  }
  return updateLead(id, payload);
}

export async function updateProjectStatus(
  id: string,
  project_status: ProjectStatus,
  delivery_date?: string
): Promise<boolean> {
  const payload: Partial<Lead> = { project_status };
  if (project_status === "Delivered") {
    payload.delivered_at = new Date().toISOString();
    payload.delivery_date = delivery_date || new Date().toISOString().split("T")[0];
  } else if (delivery_date) {
    payload.delivery_date = delivery_date;
  }
  return updateLead(id, payload);
}

export async function softDeleteLead(id: string): Promise<boolean> {
  return updateLead(id, { deleted_at: new Date().toISOString() });
}

export async function restoreLead(id: string): Promise<boolean> {
  return updateLead(id, { deleted_at: null });
}

export async function permanentDeleteLead(id: string): Promise<boolean> {
  let ok = false;
  if (getSupabaseConfig()) {
    try {
      await supabaseRest(`leads?id=eq.${id}`, {
        method: "DELETE",
      });
      ok = true;
    } catch (err) {
      console.warn("Supabase REST delete fallback:", err);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("DELETE FROM leads WHERE id = $1", [id]);
      if ((res.rowCount ?? 0) > 0) ok = true;
    }
  } catch (error) {
    console.error("PostgreSQL Delete error:", error);
  }
  return ok;
}

export async function emptyRecycleBin(): Promise<number> {
  let deletedCount = 0;
  if (getSupabaseConfig()) {
    try {
      await supabaseRest(`leads?deleted_at=not.is.null`, { method: "DELETE" });
    } catch (err) {
      console.warn("Supabase emptyRecycleBin fallback:", err);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("DELETE FROM leads WHERE deleted_at IS NOT NULL");
      deletedCount = res.rowCount ?? 0;
    }
  } catch (error) {
    console.error("PostgreSQL emptyRecycleBin error:", error);
  }
  return deletedCount;
}

// ==========================================
// ACTIVITY LOGS
// ==========================================
export async function addActivityLog(data: {
  lead_id?: string;
  action: string;
  details: string;
  performed_by: string;
  user_role: string;
}): Promise<ActivityLog> {
  const id = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const record: ActivityLog = {
    id,
    lead_id: data.lead_id || undefined,
    action: data.action,
    details: data.details,
    performed_by: data.performed_by,
    user_role: data.user_role,
    created_at: now,
  };

  if (getSupabaseConfig()) {
    try {
      await supabaseRest("activity_logs", {
        method: "POST",
        body: JSON.stringify(record),
      });
      return record;
    } catch (e) {
      console.warn("Supabase activity_log fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      await pool.query(
        "INSERT INTO activity_logs (id, lead_id, action, details, performed_by, user_role, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
        [id, data.lead_id || null, data.action, data.details, data.performed_by, data.user_role]
      );
    }
  } catch (err) {
    console.error("PostgreSQL addActivityLog error:", err);
  }
  return record;
}

export async function getActivityLogs(limit = 100): Promise<ActivityLog[]> {
  if (getSupabaseConfig()) {
    try {
      const rows = await supabaseRest(`activity_logs?select=*&order=created_at.desc&limit=${limit}`);
      if (Array.isArray(rows)) return rows as ActivityLog[];
    } catch (e) {
      console.warn("Supabase getActivityLogs fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT $1", [limit]);
      return res.rows;
    }
  } catch (err) {
    console.error("PostgreSQL getActivityLogs error:", err);
  }
  return [];
}

// ==========================================
// LOGIN & SECURITY LOGS
// ==========================================
export async function addLoginLog(data: {
  email: string;
  role: string;
  ip_address: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  distance_meters?: number | null;
  is_within_geofence?: boolean | null;
  user_agent: string;
  status?: "success" | "failed" | "blocked_location" | "session_terminated" | string;
}): Promise<LoginLog> {
  const id = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const record: LoginLog = {
    id,
    email: data.email,
    role: data.role,
    ip_address: data.ip_address,
    location: data.location || "Unknown",
    latitude: typeof data.latitude === "number" ? data.latitude : undefined,
    longitude: typeof data.longitude === "number" ? data.longitude : undefined,
    accuracy: typeof data.accuracy === "number" ? data.accuracy : undefined,
    distance_meters: typeof data.distance_meters === "number" ? data.distance_meters : undefined,
    is_within_geofence: typeof data.is_within_geofence === "boolean" ? data.is_within_geofence : undefined,
    user_agent: data.user_agent,
    status: data.status || "success",
    created_at: now,
  };

  if (getSupabaseConfig()) {
    try {
      await supabaseRest("login_logs", {
        method: "POST",
        body: JSON.stringify(record),
      });
      return record;
    } catch (e) {
      console.warn("Supabase login_logs fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      await pool.query(
        "INSERT INTO login_logs (id, email, role, ip_address, location, latitude, longitude, accuracy, distance_meters, is_within_geofence, user_agent, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())",
        [
          id,
          data.email,
          data.role,
          data.ip_address,
          data.location || null,
          data.latitude ?? null,
          data.longitude ?? null,
          data.accuracy ?? null,
          data.distance_meters ?? null,
          data.is_within_geofence ?? null,
          data.user_agent,
          data.status || "success",
        ]
      );
    }
  } catch (err) {
    console.error("PostgreSQL addLoginLog error:", err);
  }
  return record;
}

export async function getLoginLogs(limit = 100): Promise<LoginLog[]> {
  if (getSupabaseConfig()) {
    try {
      const rows = await supabaseRest(`login_logs?select=*&order=created_at.desc&limit=${limit}`);
      if (Array.isArray(rows)) return rows as LoginLog[];
    } catch (e) {
      console.warn("Supabase getLoginLogs fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("SELECT * FROM login_logs ORDER BY created_at DESC LIMIT $1", [limit]);
      return res.rows;
    }
  } catch (err) {
    console.error("PostgreSQL getLoginLogs error:", err);
  }
  return [];
}

// ==========================================
// ==========================================
// ADMIN USER MANAGEMENT (SUPER ADMIN)
// ==========================================
// Postgres returns TIMESTAMP columns as Date objects; the admin UI expects strings.
function normalizeAdminRow<T extends Record<string, any>>(row: T): T {
  if (!row) return row;
  const toIso = (v: any) => (v instanceof Date ? v.toISOString() : v == null ? v : String(v));
  return {
    ...row,
    created_at: toIso(row["created_at"]) ?? "",
    last_login_at: toIso(row["last_login_at"]),
  };
}

let lastAccountSetupAttempt = 0;

export async function getAdminUsers(): Promise<AdminUser[]> {
  await initDb();
  let dbUsers: AdminUser[] = [];

  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query(
        "SELECT id, name, email, role, status, created_at, last_login_at FROM admin_users ORDER BY created_at DESC"
      );
      dbUsers = res.rows.map(normalizeAdminRow);

      // Default accounts missing (e.g. setup failed at startup)? Try again, at most once a minute.
      const hasLm = dbUsers.some((u) => (u.email || "").toLowerCase() === "lm@aistudio.us");
      const hasAdmin = dbUsers.some((u) => (u.email || "").toLowerCase() === "admin@aistudio.us");
      if ((!hasLm || !hasAdmin) && Date.now() - lastAccountSetupAttempt > 60_000) {
        lastAccountSetupAttempt = Date.now();
        const client = await pool.connect();
        try {
          await ensureDefaultAccounts(client);
        } finally {
          client.release();
        }
        const again = await pool.query(
          "SELECT id, name, email, role, status, created_at, last_login_at FROM admin_users ORDER BY created_at DESC"
        );
        dbUsers = again.rows.map(normalizeAdminRow);
      }
    }
  } catch (err) {
    console.error("PostgreSQL getAdminUsers error:", err);
  }

  // Ensure Super Admin exists in list even if DB is brand new
  const superAdminDef: AdminUser = {
    id: "usr_superadmin",
    name: "Super Admin",
    email: "sa@aistudio.us",
    role: "super_admin",
    status: "active",
    created_at: "System Protected",
  };

  const map = new Map<string, AdminUser>();
  dbUsers.forEach((u) => {
    if (u.email) map.set(u.email.toLowerCase().trim(), u);
  });

  if (!map.has("sa@aistudio.us")) {
    map.set("sa@aistudio.us", superAdminDef);
  }

  return Array.from(map.values());
}

export async function getAdminUserByEmailWithPassword(email: string): Promise<AdminUser | null> {
  const cleanEmail = (email || "").toLowerCase().trim();
  if (!cleanEmail) return null;

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query(
        "SELECT id, name, email, password, role, status, created_at, last_login_at FROM admin_users WHERE LOWER(email) = LOWER($1) LIMIT 1",
        [cleanEmail]
      );
      if (res.rows[0]) return normalizeAdminRow(res.rows[0]);
    }
  } catch (err) {
    console.error("PostgreSQL getAdminUserByEmailWithPassword error:", err);
  }

  // Fallback defaults only for system-protected Super Admin if DB is temporarily unreachable
  if (cleanEmail === "sa@aistudio.us") {
    return {
      id: "usr_superadmin",
      name: "Super Admin",
      email: "sa@aistudio.us",
      password: "Anay@8080",
      role: "super_admin",
      status: "active",
      created_at: new Date().toISOString(),
    };
  }

  return null;
}

export async function saveAdminUser(user: {
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "admin" | "leads_manager";
  status?: "active" | "inactive";
}): Promise<AdminUser> {
  const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanEmail = user.email.toLowerCase().trim();
  const now = new Date().toISOString();
  const record: AdminUser = {
    id,
    name: user.name.trim(),
    email: cleanEmail,
    password: user.password.trim(),
    role: user.role,
    status: user.status || "active",
    created_at: now,
  };

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      // 1. Check if user already exists
      const existing = await pool.query(
        "SELECT id FROM admin_users WHERE LOWER(email) = LOWER($1) LIMIT 1",
        [cleanEmail]
      );

      if (existing.rows.length > 0) {
        const updateRes = await pool.query(
          `UPDATE admin_users 
           SET name = $1, password = $2, role = $3, status = $4
           WHERE LOWER(email) = LOWER($5)
           RETURNING id, name, email, role, status, created_at, last_login_at`,
          [record.name, record.password, record.role, record.status, cleanEmail]
        );
        if (updateRes.rows[0]) return normalizeAdminRow(updateRes.rows[0]);
      } else {
        const insertRes = await pool.query(
          `INSERT INTO admin_users (id, name, email, password, role, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           RETURNING id, name, email, role, status, created_at, last_login_at`,
          [id, record.name, cleanEmail, record.password, record.role, record.status]
        );
        if (insertRes.rows[0]) return normalizeAdminRow(insertRes.rows[0]);
      }
    }
  } catch (err: any) {
    console.error("PostgreSQL saveAdminUser error:", err);
    throw new Error(err?.message || "Failed to save user in PostgreSQL database.");
  }
  return record;
}

export async function updateAdminUserStatus(idOrEmail: string, status: "active" | "inactive"): Promise<boolean> {
  const cleanTarget = (idOrEmail || "").toLowerCase().trim();
  if (!cleanTarget) return false;

  // Protect Super Admin
  if (cleanTarget === "sa@aistudio.us" || cleanTarget === "usr_superadmin") {
    return false;
  }

  let ok = false;
  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query(
        "UPDATE admin_users SET status = $1 WHERE (id = $2 OR LOWER(email) = LOWER($2)) AND role != 'super_admin' AND LOWER(email) != 'sa@aistudio.us'",
        [status, cleanTarget]
      );
      if ((res.rowCount ?? 0) > 0) ok = true;
    }
  } catch (err) {
    console.error("PostgreSQL updateAdminUserStatus error:", err);
  }
  return ok;
}

export async function deleteAdminUser(idOrEmail: string): Promise<boolean> {
  const cleanTarget = (idOrEmail || "").toLowerCase().trim();
  if (!cleanTarget) return false;

  // Protect Super Admin
  if (cleanTarget === "sa@aistudio.us" || cleanTarget === "usr_superadmin") {
    return false;
  }

  let ok = false;
  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query(
        "DELETE FROM admin_users WHERE (id = $1 OR LOWER(email) = LOWER($1)) AND role != 'super_admin' AND LOWER(email) != 'sa@aistudio.us'",
        [cleanTarget]
      );
      if ((res.rowCount ?? 0) > 0) ok = true;
    }
  } catch (err) {
    console.error("PostgreSQL deleteAdminUser error:", err);
  }
  return ok;
}


// ==========================================
// CALENDLY MEETINGS
// ==========================================
// ── Deleted Calendly meetings: remembered so the Calendly sync / webhook never brings them back ──
// Key = client email + meeting date + time (normalised), stored in crm_settings.
const DELETED_SLOTS_KEY = "calendly_deleted_slots";

export function calendlySlotKey(email?: string, date?: string, time?: string): string {
  const e = (email || "").toLowerCase().trim();
  const cleanTime = String(time || "").replace(/\s*E[SD]T$/i, "").trim();
  let d = String(date || "").trim();
  const parsedDate = new Date(d);
  if (!isNaN(parsedDate.getTime())) {
    d = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`;
  }
  let t = cleanTime.toUpperCase();
  const m = cleanTime.match(/^(\d{1,2}):(\d{2})\s*([AP]M)?$/i);
  if (m) {
    let h = Number(m[1]) % 12;
    if ((m[3] || "").toUpperCase() === "PM") h += 12;
    if (!m[3]) h = Number(m[1]);
    t = `${String(h).padStart(2, "0")}:${m[2]}`;
  }
  return `${e}|${d}|${t}`;
}

async function getDeletedSlotKeys(): Promise<Set<string>> {
  try {
    const settings = await getCrmSettings();
    const arr = JSON.parse(settings[DELETED_SLOTS_KEY] || "[]");
    return new Set(Array.isArray(arr) ? arr.map(String) : []);
  } catch {
    return new Set();
  }
}

async function updateDeletedSlotKeys(add: string[], remove: string[] = []): Promise<void> {
  const keys = await getDeletedSlotKeys();
  add.forEach((k) => k && keys.add(k));
  remove.forEach((k) => keys.delete(k));
  // Keep the list bounded (most recent 1000)
  const list = Array.from(keys).slice(-1000);
  await saveCrmSettings({ [DELETED_SLOTS_KEY]: JSON.stringify(list) });
}

/** Remember meetings deleted in the CRM (soft or permanent) so Calendly sync never re-creates them */
export async function rememberDeletedCalendlyMeetings(ids: string[]): Promise<void> {
  if (!ids.length) return;
  try {
    const all = await getCalendlyMeetings(true);
    const keys = all.filter((m) => ids.includes(m.id)).map((m) => calendlySlotKey(m.email, m.meeting_date, m.meeting_time));
    if (keys.length) await updateDeletedSlotKeys(keys);
  } catch (e) {
    console.warn("rememberDeletedCalendlyMeetings warning:", e);
  }
}

/** Restored from the Recycle Bin: Calendly updates apply to it again */
export async function forgetDeletedCalendlyMeeting(id: string): Promise<void> {
  try {
    const all = await getCalendlyMeetings(true);
    const m = all.find((x) => x.id === id);
    if (m) await updateDeletedSlotKeys([], [calendlySlotKey(m.email, m.meeting_date, m.meeting_time)]);
  } catch (e) {
    console.warn("forgetDeletedCalendlyMeeting warning:", e);
  }
}

export async function saveCalendlyMeeting(data: {
  lead_id?: string;
  client_name: string;
  email: string;
  phone?: string;
  meeting_date: string;
  meeting_time: string;
  meeting_status?: string;
  meeting_link: string;
  meeting_type?: string;
  assigned_admin?: string;
  notes?: string;
  is_rescheduled?: boolean;
  /** Original slot of a rescheduled booking (from Calendly's old_invitee) */
  previous_meeting_date?: string | undefined;
  previous_meeting_time?: string | undefined;
}): Promise<CalendlyMeeting> {
  const id = `meet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const isCancelled = data.meeting_status === "cancelled";
  const isCompleted = (MEETING_OUTCOME_STATUSES as readonly string[]).includes(data.meeting_status || "");
  // Cancelled / completed always win; "rescheduled" only applies to upcoming bookings
  const isRescheduled = !isCancelled && !isCompleted && (data.is_rescheduled || data.meeting_status === "rescheduled");
  // This booking replaced an earlier one (status may now be rescheduled, completed or cancelled)
  const replacesEarlier = Boolean(data.is_rescheduled) || Boolean(data.previous_meeting_date);
  const finalStatus = isCancelled ? "cancelled" : isRescheduled ? "rescheduled" : ((data.meeting_status as any) || "scheduled");
  const hasPreviousSlot = Boolean(data.previous_meeting_date && data.previous_meeting_time);


  // Keep a readable history (Booked → Rescheduled → Cancelled) instead of overwriting notes.
  // Only append when something actually changed, since the sync re-processes events.
  const mergeNotes = (existing: any): string | undefined => {
    const prevNotes: string = existing?.notes || "";
    const newNote = (data.notes || "").trim();
    if (!newNote) return prevNotes || undefined;
    if (!prevNotes) return newNote;
    if (prevNotes.includes(newNote)) return prevNotes;
    const changed =
      existing?.meeting_status !== finalStatus ||
      existing?.meeting_date !== data.meeting_date ||
      existing?.meeting_time !== data.meeting_time;
    return changed ? `${prevNotes}\n${newNote}` : prevNotes;
  };

  const record: CalendlyMeeting = {
    id,
    lead_id: data.lead_id || undefined,
    client_name: data.client_name,
    email: data.email,
    phone: data.phone || undefined,
    meeting_date: data.meeting_date,
    meeting_time: data.meeting_time,
    meeting_status: finalStatus as any,
    meeting_link: data.meeting_link,
    meeting_type: data.meeting_type || "Video Strategy Call",
    assigned_admin: data.assigned_admin || undefined,
    notes: data.notes || undefined,
    created_at: now,
  };

  // Deleted in the CRM (Recycle Bin or permanently)? Never re-create or update it.
  // A reschedule of a deleted meeting stays deleted too.
  {
    const deletedKeys = await getDeletedSlotKeys();
    const curKey = calendlySlotKey(data.email, data.meeting_date, data.meeting_time);
    const prevKey = hasPreviousSlot
      ? calendlySlotKey(data.email, data.previous_meeting_date, data.previous_meeting_time)
      : "";
    if (deletedKeys.has(curKey) || (prevKey && deletedKeys.has(prevKey))) {
      if (!deletedKeys.has(curKey)) {
        try {
          await updateDeletedSlotKeys([curKey]);
        } catch {}
      }
      return { ...record, suppressed: true } as CalendlyMeeting & { suppressed: boolean };
    }
  }

  if (getSupabaseConfig()) {
    try {
      // Find the CRM meeting: 1) same slot, 2) original slot of a reschedule,
      // 3) a reschedule whose original slot is unknown: the client's latest UPCOMING meeting
      const base = `calendly_meetings?email=eq.${encodeURIComponent(data.email)}&deleted_at=is.null`;
      const bySlot = (d: string, t: string) =>
        supabaseRest(`${base}&meeting_date=eq.${encodeURIComponent(d)}&meeting_time=eq.${encodeURIComponent(t)}&order=created_at.desc&limit=1&select=*`);
      let existing: any[] = await bySlot(data.meeting_date, data.meeting_time);
      if ((!Array.isArray(existing) || existing.length === 0) && hasPreviousSlot) {
        existing = await bySlot(data.previous_meeting_date as string, data.previous_meeting_time as string);
      }
      if ((!Array.isArray(existing) || existing.length === 0) && replacesEarlier && !hasPreviousSlot) {
        existing = await supabaseRest(
          `${base}&meeting_status=in.(scheduled,rescheduled,upcoming)&order=created_at.desc&limit=1&select=*`
        );
      }

      if (Array.isArray(existing) && existing.length > 0) {
        const existingMeeting = existing[0];
        // A result recorded in the CRM wins over Calendly's automatic result
        if (existingMeeting.outcome_locked && isCompleted) return existingMeeting;
        const updated = await supabaseRest(`calendly_meetings?id=eq.${existingMeeting.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            client_name: data.client_name || existingMeeting.client_name,
            phone: data.phone || existingMeeting.phone,
            meeting_date: data.meeting_date || existingMeeting.meeting_date,
            meeting_time: data.meeting_time || existingMeeting.meeting_time,
            meeting_status: finalStatus,
            meeting_link: data.meeting_link || existingMeeting.meeting_link,
            meeting_type: data.meeting_type || existingMeeting.meeting_type,
            notes: mergeNotes(existingMeeting),
          }),
        });
        // Newer columns separately, so a database API that doesn't know them yet can never
        // block the status change itself (e.g. a cancellation)
        const extra: Record<string, any> = {
          ...(isCancelled ? { cancelled_at: existingMeeting.cancelled_at || now } : {}),
          // A real reschedule / cancellation starts a new outcome cycle
          ...(!isCompleted && existingMeeting.outcome_locked ? { outcome_locked: false } : {}),
        };
        if (Object.keys(extra).length > 0) {
          try {
            await supabaseRest(`calendly_meetings?id=eq.${existingMeeting.id}`, {
              method: "PATCH",
              body: JSON.stringify(extra),
            });
          } catch (extraErr) {
            console.warn("Calendly meeting extra fields update skipped:", extraErr);
          }
        }
        if (Array.isArray(updated) && updated[0]) return { ...updated[0], ...extra };
        return {
          ...existingMeeting,
          meeting_date: data.meeting_date,
          meeting_time: data.meeting_time,
          meeting_status: finalStatus as any,
          meeting_link: data.meeting_link,
        };
      }

      // Moved to the Recycle Bin in the CRM? Keep it there instead of re-creating it.
      {
        const delBase = `calendly_meetings?email=eq.${encodeURIComponent(data.email)}&deleted_at=not.is.null`;
        const slots: [string, string][] = [[data.meeting_date, data.meeting_time]];
        if (hasPreviousSlot) slots.push([data.previous_meeting_date as string, data.previous_meeting_time as string]);
        for (const [d, t] of slots) {
          const del = await supabaseRest(
            `${delBase}&meeting_date=eq.${encodeURIComponent(d)}&meeting_time=eq.${encodeURIComponent(t)}&limit=1&select=*`
          );
          if (Array.isArray(del) && del[0]) return del[0];
        }
      }

      const rows = await supabaseRest("calendly_meetings", {
        method: "POST",
        body: JSON.stringify(record),
      });
      if (Array.isArray(rows) && rows[0]) return rows[0];
      return record;
    } catch (e) {
      console.warn("Supabase saveCalendlyMeeting fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      // Find the CRM meeting: 1) same slot, 2) original slot of a reschedule,
      // 3) a reschedule whose original slot is unknown: the client's latest UPCOMING meeting
      const bySlot = async (d: string, t: string) =>
        (
          await pool.query(
            `SELECT * FROM calendly_meetings WHERE email = $1 AND meeting_date = $2 AND meeting_time = $3 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1`,
            [data.email, d, t]
          )
        ).rows[0] || null;
      let existingMeeting: any = await bySlot(data.meeting_date, data.meeting_time);
      if (!existingMeeting && hasPreviousSlot) {
        existingMeeting = await bySlot(data.previous_meeting_date as string, data.previous_meeting_time as string);
      }
      if (!existingMeeting && replacesEarlier && !hasPreviousSlot) {
        const latest = await pool.query(
          `SELECT * FROM calendly_meetings WHERE email = $1 AND deleted_at IS NULL
             AND meeting_status IN ('scheduled', 'rescheduled', 'upcoming')
           ORDER BY created_at DESC LIMIT 1`,
          [data.email]
        );
        existingMeeting = latest.rows[0] || null;
      }

      // A result recorded in the CRM wins over Calendly's automatic result
      if (existingMeeting && existingMeeting.outcome_locked && isCompleted) {
        return existingMeeting;
      }

      if (existingMeeting) {
        const updateRes = await pool.query(
          `UPDATE calendly_meetings 
           SET meeting_date = COALESCE($1, meeting_date),
               meeting_time = COALESCE($2, meeting_time),
               meeting_status = COALESCE($3, meeting_status), 
               meeting_link = COALESCE($4, meeting_link), 
               notes = COALESCE($5, notes),
               client_name = COALESCE($6, client_name),
               phone = COALESCE($7, phone),
               cancelled_at = CASE WHEN $3 = 'cancelled' THEN COALESCE(cancelled_at, NOW()) ELSE NULL END,
               outcome_locked = CASE WHEN $3 IN ('completed', 'not_conducted', 'no_show') THEN COALESCE(outcome_locked, FALSE) ELSE FALSE END
           WHERE id = $8 RETURNING *`,
          [
            data.meeting_date || null,
            data.meeting_time || null,
            finalStatus,
            data.meeting_link || null,
            mergeNotes(existingMeeting) || null,
            data.client_name || null,
            data.phone || null,
            existingMeeting.id,
          ]
        );
        const updated = updateRes.rows[0] || existingMeeting;

        try {
          await pool.query(
            `UPDATE leads 
             SET meeting_date = $1, meeting_time = $2, meeting_link = $3, meeting_status = $4, meeting_type = $5 
             WHERE email = $6`,
            [data.meeting_date, data.meeting_time, data.meeting_link, finalStatus, data.meeting_type || "Video Strategy Call", data.email]
          );
        } catch (_) {}

        return updated;
      }

      // Moved to the Recycle Bin in the CRM? Keep it there instead of re-creating it.
      {
        const slots: [string, string][] = [[data.meeting_date, data.meeting_time]];
        if (hasPreviousSlot) slots.push([data.previous_meeting_date as string, data.previous_meeting_time as string]);
        for (const [d, t] of slots) {
          const del = await pool.query(
            `SELECT * FROM calendly_meetings WHERE email = $1 AND meeting_date = $2 AND meeting_time = $3 AND deleted_at IS NOT NULL LIMIT 1`,
            [data.email, d, t]
          );
          if (del.rows[0]) return del.rows[0];
        }
      }

      const res = await pool.query(
        `INSERT INTO calendly_meetings (id, lead_id, client_name, email, phone, meeting_date, meeting_time, meeting_status, meeting_link, meeting_type, assigned_admin, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
         RETURNING *`,
        [
          id,
          data.lead_id || null,
          data.client_name,
          data.email,
          data.phone || null,
          data.meeting_date,
          data.meeting_time,
          finalStatus,
          data.meeting_link,
          data.meeting_type || "Video Strategy Call",
          data.assigned_admin || null,
          data.notes || null,
        ]
      );
      const inserted = res.rows[0];

      // Auto-link to matching lead in leads table (Section 14: Match Calendly meetings to existing leads)
      try {
        const cleanPhoneDigits = (data.phone || "").replace(/\D/g, "").slice(-10);
        const leadRows = await pool.query(
          `SELECT id FROM leads WHERE (email IS NOT NULL AND LOWER(email) = LOWER($1) AND $1 != '') OR (phone IS NOT NULL AND $2 != '' AND RIGHT(regexp_replace(phone, '\\D', '', 'g'), 10) = $2) LIMIT 1`,
          [(data.email || "").trim(), cleanPhoneDigits]
        );
        if (leadRows.rows.length > 0) {
          const matchedLeadId = leadRows.rows[0].id;
          await pool.query(
            `UPDATE leads SET meeting_date = $1, meeting_time = $2, meeting_link = $3, meeting_status = $4, meeting_type = $5 WHERE id = $6`,
            [data.meeting_date, data.meeting_time, data.meeting_link, finalStatus, data.meeting_type || "Video Strategy Call", matchedLeadId]
          );
        }
      } catch (linkErr) {
        console.warn("Auto-link Calendly meeting to lead warning:", linkErr);
      }

      return inserted;
    }
  } catch (err) {
    console.error("PostgreSQL saveCalendlyMeeting error:", err);
  }
  return record;
}

export async function getCalendlyMeetings(includeDeleted = false): Promise<CalendlyMeeting[]> {
  if (getSupabaseConfig()) {
    try {
      const endpoint = includeDeleted
        ? "calendly_meetings?select=*&order=created_at.desc"
        : "calendly_meetings?deleted_at=is.null&select=*&order=created_at.desc";
      const rows = await supabaseRest(endpoint);
      if (Array.isArray(rows)) return rows as CalendlyMeeting[];
    } catch (e) {
      console.warn("Supabase getCalendlyMeetings fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const query = includeDeleted
        ? "SELECT * FROM calendly_meetings ORDER BY created_at DESC"
        : "SELECT * FROM calendly_meetings WHERE (deleted_at IS NULL) ORDER BY created_at DESC";
      const res = await pool.query(query);
      return res.rows;
    }
  } catch (err) {
    console.error("PostgreSQL getCalendlyMeetings error:", err);
  }
  return [];
}

export async function updateCalendlyMeetingStatus(
  id: string,
  status: string,
  notes?: string,
  cancelled_at?: string
): Promise<boolean> {
  const cancelTimestamp = status === "cancelled" ? (cancelled_at || new Date().toISOString()) : null;
  let ok = false;
  if (getSupabaseConfig()) {
    try {
      const updateData: any = { meeting_status: status };
      if (notes) updateData.notes = notes;
      if (cancelTimestamp) updateData.cancelled_at = cancelTimestamp;
      await supabaseRest(`calendly_meetings?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateData),
      });
      ok = true;
    } catch (e) {
      console.warn("Supabase updateCalendlyMeetingStatus fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      if (notes) {
        await pool.query("UPDATE calendly_meetings SET meeting_status = $1, notes = $2, cancelled_at = $3 WHERE id = $4", [status, notes, cancelTimestamp, id]);
      } else {
        await pool.query("UPDATE calendly_meetings SET meeting_status = $1, cancelled_at = $2 WHERE id = $3", [status, cancelTimestamp, id]);
      }
      ok = true;
    }
  } catch (err) {
    console.error("PostgreSQL updateCalendlyMeetingStatus error:", err);
  }
  return ok;
}

export async function updateCalendlyMeetingDetails(
  id: string,
  updates: Partial<CalendlyMeeting>
): Promise<boolean> {
  if (updates.meeting_status === "cancelled" && !updates.cancelled_at) {
    updates.cancelled_at = new Date().toISOString();
  }
  let ok = false;
  if (getSupabaseConfig()) {
    try {
      await supabaseRest(`calendly_meetings?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      ok = true;
    } catch (e) {
      console.warn("Supabase updateCalendlyMeetingDetails fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const fields: string[] = [];
      const values: any[] = [];
      let i = 1;
      if (updates.client_name !== undefined) { fields.push(`client_name = $${i++}`); values.push(updates.client_name); }
      if (updates.email !== undefined) { fields.push(`email = $${i++}`); values.push(updates.email); }
      if (updates.phone !== undefined) { fields.push(`phone = $${i++}`); values.push(updates.phone); }
      if (updates.meeting_date !== undefined) { fields.push(`meeting_date = $${i++}`); values.push(updates.meeting_date); }
      if (updates.meeting_time !== undefined) { fields.push(`meeting_time = $${i++}`); values.push(updates.meeting_time); }
      if (updates.meeting_status !== undefined) { fields.push(`meeting_status = $${i++}`); values.push(updates.meeting_status); }
      if (updates.meeting_link !== undefined) { fields.push(`meeting_link = $${i++}`); values.push(updates.meeting_link); }
      if (updates.meeting_type !== undefined) { fields.push(`meeting_type = $${i++}`); values.push(updates.meeting_type); }
      if (updates.assigned_admin !== undefined) { fields.push(`assigned_admin = $${i++}`); values.push(updates.assigned_admin); }
      if (updates.notes !== undefined) { fields.push(`notes = $${i++}`); values.push(updates.notes); }
      if (updates.cancelled_at !== undefined) { fields.push(`cancelled_at = $${i++}`); values.push(updates.cancelled_at); }
      if (updates.deleted_at !== undefined) { fields.push(`deleted_at = $${i++}`); values.push(updates.deleted_at); }
      if (fields.length > 0) {
        values.push(id);
        await pool.query(`UPDATE calendly_meetings SET ${fields.join(", ")} WHERE id = $${i}`, values);
      }
      ok = true;
    }
  } catch (err) {
    console.error("PostgreSQL updateCalendlyMeetingDetails error:", err);
  }
  return ok;
}

export async function softDeleteCalendlyMeeting(id: string): Promise<boolean> {
  let ok = false;
  if (getSupabaseConfig()) {
    try {
      await supabaseRest(`calendly_meetings?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ deleted_at: new Date().toISOString() }),
      });
      ok = true;
    } catch (e) {
      console.warn("Supabase softDeleteCalendlyMeeting fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("UPDATE calendly_meetings SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
      if ((res.rowCount ?? 0) > 0) ok = true;
    }
  } catch (err) {
    console.error("PostgreSQL softDeleteCalendlyMeeting error:", err);
  }
  return ok;
}

export async function softDeleteCalendlyMeetings(ids: string[]): Promise<boolean> {
  if (!ids || ids.length === 0) return true;
  let ok = false;
  if (getSupabaseConfig()) {
    try {
      const inList = ids.map((id) => `"${id}"`).join(",");
      await supabaseRest(`calendly_meetings?id=in.(${inList})`, {
        method: "PATCH",
        body: JSON.stringify({ deleted_at: new Date().toISOString() }),
      });
      ok = true;
    } catch (e) {
      console.warn("Supabase softDeleteCalendlyMeetings fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("UPDATE calendly_meetings SET deleted_at = CURRENT_TIMESTAMP WHERE id = ANY($1::text[])", [ids]);
      if ((res.rowCount ?? 0) > 0) ok = true;
    }
  } catch (err) {
    console.error("PostgreSQL softDeleteCalendlyMeetings error:", err);
  }
  return ok;
}

export async function permanentDeleteCalendlyMeeting(id: string): Promise<boolean> {
  let ok = false;
  if (getSupabaseConfig()) {
    try {
      await supabaseRest(`calendly_meetings?id=eq.${id}`, { method: "DELETE" });
      ok = true;
    } catch (e) {
      console.warn("Supabase permanentDeleteCalendlyMeeting fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("DELETE FROM calendly_meetings WHERE id = $1", [id]);
      if ((res.rowCount ?? 0) > 0) ok = true;
    }
  } catch (err) {
    console.error("PostgreSQL permanentDeleteCalendlyMeeting error:", err);
  }
  return ok;
}

export async function permanentDeleteCalendlyMeetings(ids: string[]): Promise<boolean> {
  if (!ids || ids.length === 0) return true;
  let ok = false;
  if (getSupabaseConfig()) {
    try {
      const inList = ids.map((id) => `"${id}"`).join(",");
      await supabaseRest(`calendly_meetings?id=in.(${inList})`, { method: "DELETE" });
      ok = true;
    } catch (e) {
      console.warn("Supabase permanentDeleteCalendlyMeetings fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("DELETE FROM calendly_meetings WHERE id = ANY($1::text[])", [ids]);
      if ((res.rowCount ?? 0) > 0) ok = true;
    }
  } catch (err) {
    console.error("PostgreSQL permanentDeleteCalendlyMeetings error:", err);
  }
  return ok;
}

export async function restoreCalendlyMeeting(id: string): Promise<boolean> {
  let ok = false;
  if (getSupabaseConfig()) {
    try {
      await supabaseRest(`calendly_meetings?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ deleted_at: null }),
      });
      ok = true;
    } catch (e) {
      console.warn("Supabase restoreCalendlyMeeting fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("UPDATE calendly_meetings SET deleted_at = NULL WHERE id = $1", [id]);
      if ((res.rowCount ?? 0) > 0) ok = true;
    }
  } catch (err) {
    console.error("PostgreSQL restoreCalendlyMeeting error:", err);
  }
  return ok;
}

export async function deleteCalendlyMeeting(id: string): Promise<boolean> {
  return softDeleteCalendlyMeeting(id);
}

export async function deleteCalendlyMeetings(ids: string[]): Promise<boolean> {
  return softDeleteCalendlyMeetings(ids);
}

/** CRM user records what happened (completed / not conducted / no show) with a note. */
export async function setCalendlyMeetingOutcome(
  id: string,
  outcome: MeetingOutcome,
  note: string,
  setBy: string
): Promise<CalendlyMeeting | null> {
  const label = outcome === "completed" ? "Completed" : outcome === "no_show" ? "No Show" : "Not Conducted";
  const stamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });
  const line = `[${stamp} ET] Result set to ${label} by ${setBy}: ${note}`;
  const nowIso = new Date().toISOString();

  if (getSupabaseConfig()) {
    try {
      const cur = await supabaseRest(`calendly_meetings?id=eq.${encodeURIComponent(id)}&select=notes`);
      const prevNotes = Array.isArray(cur) && cur[0]?.notes ? String(cur[0].notes) : "";
      const rows = await supabaseRest(`calendly_meetings?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          meeting_status: outcome,
          outcome_locked: true,
          outcome_set_by: setBy,
          outcome_set_at: nowIso,
          notes: prevNotes ? `${prevNotes}\n${line}` : line,
        }),
      });
      if (Array.isArray(rows) && rows[0]) return rows[0];
    } catch (e) {
      console.warn("Supabase setCalendlyMeetingOutcome fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query(
        `UPDATE calendly_meetings
            SET meeting_status = $1, outcome_locked = TRUE, outcome_set_by = $2, outcome_set_at = NOW(),
                notes = CASE WHEN COALESCE(notes, '') = '' THEN $3 ELSE notes || E'\n' || $3 END
          WHERE id = $4 RETURNING *`,
        [outcome, setBy, line, id]
      );
      return res.rows[0] || null;
    }
  } catch (err) {
    console.error("PostgreSQL setCalendlyMeetingOutcome error:", err);
  }
  return null;
}

/**
 * Meetings older than the Calendly sync window: once their time has passed without a
 * recorded result, mark them "not_conducted" (never touches CRM-recorded results).
 */
export async function markPastMeetingsNotConducted(): Promise<number> {
  const meetings = await getCalendlyMeetings(false);
  const cutoff = Date.now() - 2 * 60 * 60 * 1000; // 2h buffer after the start time
  let count = 0;
  for (const m of meetings) {
    if (m.outcome_locked) continue;
    if (m.meeting_status !== "scheduled" && m.meeting_status !== "rescheduled" && m.meeting_status !== "upcoming") continue;
    const time = String(m.meeting_time || "").replace(/\s*E[SD]T$/i, "");
    const start = new Date(`${m.meeting_date} ${time} GMT-0400`).getTime();
    if (isNaN(start) || start > cutoff) continue;
    const ok = await updateCalendlyMeetingStatus(m.id, "not_conducted" as any);
    if (ok) count++;
  }
  return count;
}

/** Soft-delete meetings saved with placeholder data (old website-widget bug). */
const PLACEHOLDER_CALENDLY_EMAILS = ["client@calendly-booking.com", "client@calendly.com"];
export async function removePlaceholderCalendlyMeetings(): Promise<number> {
  let count = 0;
  if (getSupabaseConfig()) {
    try {
      const rows = await supabaseRest(
        `calendly_meetings?email=in.(${PLACEHOLDER_CALENDLY_EMAILS.map((e) => `"${e}"`).join(",")})&deleted_at=is.null`,
        { method: "PATCH", body: JSON.stringify({ deleted_at: new Date().toISOString() }) }
      );
      count = Array.isArray(rows) ? rows.length : 0;
    } catch (e) {
      console.warn("Supabase removePlaceholderCalendlyMeetings fallback:", e);
    }
  }
  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query(
        "UPDATE calendly_meetings SET deleted_at = NOW() WHERE email = ANY($1::text[]) AND deleted_at IS NULL",
        [PLACEHOLDER_CALENDLY_EMAILS]
      );
      count += res.rowCount ?? 0;
    }
  } catch (err) {
    console.error("PostgreSQL removePlaceholderCalendlyMeetings error:", err);
  }
  return count;
}

export async function clearAllCalendlyMeetings(): Promise<boolean> {
  let ok = false;
  if (getSupabaseConfig()) {
    try {
      await supabaseRest("calendly_meetings?id=neq.placeholder", { method: "DELETE" });
      ok = true;
    } catch (e) {
      console.warn("Supabase clearAllCalendlyMeetings fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      await pool.query("DELETE FROM calendly_meetings");
      ok = true;
    }
  } catch (err) {
    console.error("PostgreSQL clearAllCalendlyMeetings error:", err);
  }
  return ok;
}

// ==========================================
// CRM NOTIFICATIONS PERSISTENCE
// ==========================================

export async function saveCRMNotification(data: {
  type: string;
  title: string;
  message: string;
  entity_id?: string;
  actor?: string;
}): Promise<CRMNotification> {
  const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const record: CRMNotification = {
    id,
    type: data.type,
    title: data.title,
    message: data.message,
    entity_id: data.entity_id,
    actor: data.actor || "System",
    is_read: false,
    created_at: now,
  };

  if (getSupabaseConfig()) {
    try {
      const rows = await supabaseRest("crm_notifications", {
        method: "POST",
        body: JSON.stringify(record),
      });
      if (Array.isArray(rows) && rows[0]) return rows[0] as CRMNotification;
    } catch (e) {
      console.warn("Supabase saveCRMNotification fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query(
        `INSERT INTO crm_notifications (id, type, title, message, entity_id, actor, is_read, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING *`,
        [id, data.type, data.title, data.message, data.entity_id || null, data.actor || "System", false]
      );
      return res.rows[0];
    }
  } catch (err) {
    console.error("PostgreSQL saveCRMNotification error:", err);
  }
  return record;
}

export async function getCRMNotifications(limit = 50): Promise<CRMNotification[]> {
  if (getSupabaseConfig()) {
    try {
      const rows = await supabaseRest(`crm_notifications?select=*&order=created_at.desc&limit=${limit}`);
      if (Array.isArray(rows)) return rows as CRMNotification[];
    } catch (e) {
      console.warn("Supabase getCRMNotifications fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("SELECT * FROM crm_notifications ORDER BY created_at DESC LIMIT $1", [limit]);
      return res.rows;
    }
  } catch (err) {
    console.error("PostgreSQL getCRMNotifications error:", err);
  }
  return [];
}

export async function markNotificationRead(id: string): Promise<boolean> {
  if (getSupabaseConfig()) {
    try {
      await supabaseRest(`crm_notifications?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_read: true }),
      });
      return true;
    } catch (e) {
      console.warn("Supabase markNotificationRead fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      await pool.query("UPDATE crm_notifications SET is_read = TRUE WHERE id = $1", [id]);
      return true;
    }
  } catch (err) {
    console.error("PostgreSQL markNotificationRead error:", err);
  }
  return false;
}

export async function markAllNotificationsRead(): Promise<boolean> {
  if (getSupabaseConfig()) {
    try {
      await supabaseRest("crm_notifications?is_read=eq.false", {
        method: "PATCH",
        body: JSON.stringify({ is_read: true }),
      });
      return true;
    } catch (e) {
      console.warn("Supabase markAllNotificationsRead fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      await pool.query("UPDATE crm_notifications SET is_read = TRUE WHERE is_read = FALSE");
      return true;
    }
  } catch (err) {
    console.error("PostgreSQL markAllNotificationsRead error:", err);
  }
  return false;
}

export async function clearNotifications(): Promise<boolean> {
  if (getSupabaseConfig()) {
    try {
      await supabaseRest("crm_notifications", { method: "DELETE" });
      return true;
    } catch (e) {
      console.warn("Supabase clearNotifications fallback:", e);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      await pool.query("DELETE FROM crm_notifications");
      return true;
    }
  } catch (err) {
    console.error("PostgreSQL clearNotifications error:", err);
  }
  return false;
}

// Backward-compatible alias for deleteLead
export async function deleteLead(id: string): Promise<boolean> {
  return softDeleteLead(id);
}

// ==========================================
// ORDERS & PAYPAL PAYMENTS PERSISTENCE
// ==========================================

export async function saveOrder(data: {
  paypalOrderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | undefined;
  customerCompany?: string | undefined;
  itemType: "individual" | "package" | "setup" | string;
  itemId: string;
  itemName: string;
  amount: number;
  currency?: string | undefined;
  paymentStatus?: PaymentStatus | undefined;
  paypalStatus?: string | undefined;
  rawDetails?: string | undefined;
}): Promise<Order> {
  const id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const status: PaymentStatus = data.paymentStatus || "PENDING";
  const currency = data.currency || "USD";

  const record: Order = {
    id,
    paypal_order_id: data.paypalOrderId,
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    customer_phone: data.customerPhone || undefined,
    customer_company: data.customerCompany || undefined,
    item_type: data.itemType,
    item_id: data.itemId,
    item_name: data.itemName,
    amount: data.amount,
    currency,
    payment_status: status,
    paypal_status: data.paypalStatus || "CREATED",
    raw_details: data.rawDetails || undefined,
    created_at: now,
    updated_at: now,
  };

  // Strategy A: Supabase REST
  if (getSupabaseConfig()) {
    try {
      const result = await supabaseRest("orders", {
        method: "POST",
        body: JSON.stringify({
          id: record.id,
          paypal_order_id: record.paypal_order_id,
          customer_name: record.customer_name,
          customer_email: record.customer_email,
          customer_phone: record.customer_phone || null,
          customer_company: record.customer_company || null,
          item_type: record.item_type,
          item_id: record.item_id,
          item_name: record.item_name,
          amount: record.amount,
          currency: record.currency,
          payment_status: record.payment_status,
          paypal_status: record.paypal_status || null,
          raw_details: record.raw_details || null,
          created_at: record.created_at,
          updated_at: record.updated_at,
        }),
      });
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      }
      return record;
    } catch (supabaseError) {
      console.warn("Supabase REST saveOrder failed, falling back to PostgreSQL pool:", supabaseError);
    }
  }

  // Strategy B: PostgreSQL Pool
  await initDb();
  const pool = await getPool();
  if (pool) {
    const res = await pool.query(
      `INSERT INTO orders (id, paypal_order_id, customer_name, customer_email, customer_phone, customer_company, item_type, item_id, item_name, amount, currency, payment_status, paypal_status, raw_details, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
       RETURNING *`,
      [
        id,
        record.paypal_order_id,
        record.customer_name,
        record.customer_email,
        record.customer_phone || null,
        record.customer_company || null,
        record.item_type,
        record.item_id,
        record.item_name,
        record.amount,
        record.currency,
        record.payment_status,
        record.paypal_status || null,
        record.raw_details || null,
      ]
    );
    return res.rows[0];
  }

  return record;
}

export async function updateOrderPayment(data: {
  paypalOrderId: string;
  paypalCaptureId?: string | undefined;
  paymentStatus: PaymentStatus;
  paypalStatus?: string | undefined;
  rawDetails?: string | undefined;
}): Promise<Order | null> {
  const now = new Date().toISOString();

  if (getSupabaseConfig()) {
    try {
      const payload: Record<string, any> = {
        payment_status: data.paymentStatus,
        updated_at: now,
      };
      if (data.paypalCaptureId) payload["paypal_capture_id"] = data.paypalCaptureId;
      if (data.paypalStatus) payload["paypal_status"] = data.paypalStatus;
      if (data.rawDetails) payload["raw_details"] = data.rawDetails;

      const rows = await supabaseRest(`orders?paypal_order_id=eq.${data.paypalOrderId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0];
      }
    } catch (err) {
      console.warn("Supabase REST updateOrderPayment fallback:", err);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query(
        `UPDATE orders
         SET payment_status = $1,
             paypal_capture_id = COALESCE($2, paypal_capture_id),
             paypal_status = COALESCE($3, paypal_status),
             raw_details = COALESCE($4, raw_details),
             updated_at = NOW()
         WHERE paypal_order_id = $5
         RETURNING *`,
        [
          data.paymentStatus,
          data.paypalCaptureId || null,
          data.paypalStatus || null,
          data.rawDetails || null,
          data.paypalOrderId,
        ]
      );
      return res.rows[0] || null;
    }
  } catch (error) {
    console.error("PostgreSQL updateOrderPayment error:", error);
  }
  return null;
}

export async function getOrders(): Promise<Order[]> {
  // Strategy A: Supabase REST
  if (getSupabaseConfig()) {
    try {
      const rows = await supabaseRest("orders?select=*&order=created_at.desc");
      if (Array.isArray(rows)) {
        return rows as Order[];
      }
    } catch (err) {
      console.warn("Supabase REST getOrders fallback:", err);
    }
  }

  // Strategy B: PostgreSQL pool
  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
      return res.rows.map((r: any) => ({
        ...r,
        amount: typeof r.amount === "string" ? parseFloat(r.amount) : r.amount,
      }));
    }
  } catch (error) {
    console.error("PostgreSQL Select Orders error:", error);
  }
  return [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  return getOrderByAnyId(id);
}

export async function getOrderByAnyId(identifier: string): Promise<Order | null> {
  const cleanId = identifier.trim();
  if (getSupabaseConfig()) {
    try {
      const rows = await supabaseRest(
        `orders?or=(id.eq.${cleanId},paypal_order_id.eq.${cleanId},paypal_capture_id.eq.${cleanId})&select=*&limit=1`
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0];
      }
    } catch (err) {
      console.warn("Supabase REST getOrderByAnyId fallback:", err);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query(
        "SELECT * FROM orders WHERE id = $1 OR paypal_order_id = $1 OR paypal_capture_id = $1 LIMIT 1",
        [cleanId]
      );
      if (res.rows[0]) {
        return {
          ...res.rows[0],
          amount: typeof res.rows[0].amount === "string" ? parseFloat(res.rows[0].amount) : res.rows[0].amount,
        };
      }
    }
  } catch (error) {
    console.error("PostgreSQL getOrderByAnyId error:", error);
  }
  return null;
}

export async function updateOrderStatus(id: string, status: PaymentStatus): Promise<boolean> {
  if (getSupabaseConfig()) {
    try {
      await supabaseRest(`orders?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ payment_status: status, updated_at: new Date().toISOString() }),
      });
      return true;
    } catch (err) {
      console.warn("Supabase REST updateOrderStatus fallback:", err);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2", [status, id]);
      return (res.rowCount ?? 0) > 0;
    }
  } catch (error) {
    console.error("PostgreSQL updateOrderStatus error:", error);
  }
  return false;
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (getSupabaseConfig()) {
    try {
      await supabaseRest(`orders?id=eq.${id}`, {
        method: "DELETE",
      });
      return true;
    } catch (err) {
      console.warn("Supabase REST deleteOrder fallback:", err);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("DELETE FROM orders WHERE id = $1", [id]);
      return (res.rowCount ?? 0) > 0;
    }
  } catch (error) {
    console.error("PostgreSQL deleteOrder error:", error);
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// CRM Settings (key/value, shared by all admins and read by the server, e.g.
// for the notification email recipient)
// ─────────────────────────────────────────────────────────────────────────────
export async function getCrmSettings(): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  if (getSupabaseConfig()) {
    try {
      const rows = await supabaseRest("crm_settings?select=key,value");
      if (Array.isArray(rows)) {
        for (const r of rows) if (r?.key) out[r.key] = r.value ?? "";
        return out;
      }
    } catch (err) {
      console.warn("Supabase REST getCrmSettings fallback:", err);
    }
  }

  await initDb();
  try {
    const pool = await getPool();
    if (pool) {
      const res = await pool.query("SELECT key, value FROM crm_settings");
      for (const r of res.rows) out[r.key] = r.value ?? "";
    }
  } catch (error) {
    console.error("PostgreSQL getCrmSettings error:", error);
  }
  return out;
}

export async function saveCrmSettings(settings: Record<string, string>): Promise<boolean> {
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  if (rows.length === 0) return true;

  if (getSupabaseConfig()) {
    try {
      await supabaseRest("crm_settings?on_conflict=key", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(rows),
      });
      return true;
    } catch (err) {
      console.warn("Supabase REST saveCrmSettings fallback:", err);
    }
  }

  await initDb();
  const pool = await getPool();
  if (!pool) return false;
  for (const r of rows) {
    await pool.query(
      `INSERT INTO crm_settings (key, value, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [r.key, r.value]
    );
  }
  return true;
}

/**
 * Consecutive failed logins (by email, or by IP when known) inside the window,
 * counted back to the most recent successful login.
 */
export async function countRecentFailedLogins(email: string, ip: string | undefined, windowMinutes: number): Promise<number> {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
  const cleanEmail = (email || "").toLowerCase().trim();
  const cleanIp = ip && /^[0-9a-fA-F:.]+$/.test(ip) ? ip : "";
  let rows: { status: string; created_at: string }[] = [];

  let loaded = false;
  if (getSupabaseConfig()) {
    try {
      const orParts = [`email.eq."${cleanEmail}"`];
      if (cleanIp) orParts.push(`ip_address.eq."${cleanIp}"`);
      const endpoint =
        `login_logs?select=status,created_at&created_at=gte.${encodeURIComponent(since)}` +
        `&or=(${encodeURIComponent(orParts.join(","))})&order=created_at.desc&limit=100`;
      const res = await supabaseRest(endpoint);
      if (Array.isArray(res)) {
        rows = res;
        loaded = true;
      }
    } catch (err) {
      console.warn("Supabase REST countRecentFailedLogins fallback:", err);
    }
  }

  if (!loaded) {
    await initDb();
    try {
      const pool = await getPool();
      if (pool) {
        const res = await pool.query(
          `SELECT status, created_at FROM login_logs
           WHERE created_at >= $1 AND (LOWER(email) = $2 OR ($3 <> '' AND ip_address = $3))
           ORDER BY created_at DESC LIMIT 100`,
          [since, cleanEmail, cleanIp]
        );
        rows = res.rows;
      }
    } catch (error) {
      console.error("PostgreSQL countRecentFailedLogins error:", error);
    }
  }

  let count = 0;
  for (const r of rows) {
    if (r.status === "success") break;
    if (r.status === "failed") count++;
  }
  return count;
}
