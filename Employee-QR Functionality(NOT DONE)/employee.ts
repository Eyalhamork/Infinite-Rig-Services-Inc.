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
