import { createClient } from '@/lib/supabase/server';
import { EmploymentStatus } from './employee';

/**
 * Utility functions for employee management
 */

/**
 * Change employment status of an employee
 */
export async function changeEmployeeStatus(
  employeeId: string,
  newStatus: EmploymentStatus
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('employees')
    .update({ employment_status: newStatus })
    .eq('employee_id', employeeId);

  return !error;
}

/**
 * Deactivate an employee (set status to inactive)
 */
export async function deactivateEmployee(employeeId: string): Promise<boolean> {
  return changeEmployeeStatus(employeeId, 'inactive');
}

/**
 * Reactivate an employee (set status to active)
 */
export async function reactivateEmployee(employeeId: string): Promise<boolean> {
  return changeEmployeeStatus(employeeId, 'active');
}

/**
 * Terminate an employee (set status to terminated)
 */
export async function terminateEmployee(employeeId: string): Promise<boolean> {
  return changeEmployeeStatus(employeeId, 'terminated');
}

/**
 * Check if employee card is expired
 */
export function isCardExpired(expiryDate: string | null): boolean {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

/**
 * Get employees by status
 */
export async function getEmployeesByStatus(status: EmploymentStatus) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('employment_status', status)
    .order('full_name');

  if (error) {
    console.error('Error fetching employees:', error);
    return [];
  }

  return data || [];
}

/**
 * Get employees by department
 */
export async function getEmployeesByDepartment(department: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('department', department)
    .order('full_name');

  if (error) {
    console.error('Error fetching employees:', error);
    return [];
  }

  return data || [];
}

/**
 * Get employees with expired cards
 */
export async function getEmployeesWithExpiredCards() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .not('card_expiry_date', 'is', null)
    .lt('card_expiry_date', new Date().toISOString());

  if (error) {
    console.error('Error fetching employees:', error);
    return [];
  }

  return data || [];
}

/**
 * Search employees by name or employee ID
 */
export async function searchEmployees(query: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .or(
      `full_name.ilike.%${query}%,employee_id.ilike.%${query}%,position.ilike.%${query}%`
    )
    .order('full_name');

  if (error) {
    console.error('Error searching employees:', error);
    return [];
  }

  return data || [];
}
