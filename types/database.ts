// =====================================================
// INFINITE RIG SERVICES TYPE DEFINITIONS
// Auto-generated from database schema
// =====================================================

export type UserRole =
  | 'super_admin'
  | 'management'
  | 'editor'
  | 'support'
  | 'client'
  | 'applicant';

export type ApplicationStatus =
  | 'submitted'
  | 'reviewing'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_extended'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export type JobStatus = 'draft' | 'published' | 'closed' | 'filled';

export type ProjectStatus =
  | 'planning'
  | 'in_progress'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'awaiting_response'
  | 'resolved'
  | 'closed';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  department: string | null;
  phone: string | null;
  avatar_url: string | null;
  company_name: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience_level: string | null;
  salary_range: string | null;
  description: string;
  requirements: string;
  responsibilities: string | null;
  benefits: string | null;
  status: JobStatus;
  closing_date: string | null;
  positions_available: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  resume_url: string;
  cover_letter: string | null;
  phone: string;
  linkedin_url: string | null;
  portfolio_url: string | null;
  years_experience: number | null;
  current_position: string | null;
  expected_salary: string | null;
  availability_date: string | null;
  notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_type: string;
  document_name: string;
  document_url: string;
  uploaded_at: string;
}

export interface Client {
  id: string;
  company_name: string;
  industry: string | null;
  primary_contact_id: string | null;
  address: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  project_name: string;
  project_code: string | null;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  project_manager_id: string | null;
  location: string | null;
  vessel_name: string | null;
  service_type: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  milestone_name: string;
  description: string | null;
  due_date: string | null;
  completion_date: string | null;
  is_completed: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  category: string | null;
  project_id: string | null;
  client_id: string | null;
  uploaded_by: string | null;
  is_confidential: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentAccess {
  id: string;
  document_id: string;
  user_id: string;
  can_view: boolean;
  can_download: boolean;
  can_edit: boolean;
  granted_by: string | null;
  granted_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string | null;
  visitor_email: string | null;
  visitor_name: string | null;
  is_bot_conversation: boolean;
  assigned_to: string | null;
  status: string;
  started_at: string;
  closed_at: string | null;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: 'bot' | 'user' | 'support';
  sender_id: string | null;
  message: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string | null;
  subject: string;
  description: string;
  category: string | null;
  status: TicketStatus;
  priority: PriorityLevel;
  assigned_to: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketResponse {
  id: string;
  ticket_id: string;
  responder_id: string | null;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  author_id: string | null;
  category: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_roles: UserRole[] | null;
  priority: PriorityLevel;
  is_active: boolean;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

// Form data types for creating/updating
export type CreateJobPosting = Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'created_by'>;
export type UpdateJobPosting = Partial<CreateJobPosting>;

export type CreateApplication = Omit<Application, 'id' | 'created_at' | 'updated_at' | 'status'>;
export type UpdateApplication = Partial<Application>;

export type CreateProject = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProject = Partial<CreateProject>;

// API Response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  profile: Profile | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

// =====================================================
// EMPLOYEE VERIFICATION TYPES
// =====================================================

export type EmploymentStatus = 'active' | 'inactive' | 'terminated';

export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  position: string;
  department: string;
  photo_url: string | null;
  employment_status: EmploymentStatus;
  card_issue_date: string;
  card_expiry_date: string | null;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeVerification {
  employee: Employee;
  is_expired: boolean;
  verification_time: Date;
}

export type EmployeeInsert = Omit<
  Employee,
  'id' | 'created_at' | 'updated_at' | 'last_verified_at'
>;

export type EmployeeUpdate = Partial<EmployeeInsert>;

