import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

/**
 * Generates QR codes for employee ID cards
 * 
 * Usage:
 * - Single employee: generateEmployeeQR('EMP001')
 * - Batch: generateBatchQR(['EMP001', 'EMP002', 'EMP003'])
 * 
 * QR codes are saved to /public/qr-codes/
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://infiniterigservices.com';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'qr-codes');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface QROptions {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  type: 'png' | 'svg';
  width: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
}

const defaultOptions: QROptions = {
  errorCorrectionLevel: 'H', // High error correction for durability
  type: 'png',
  width: 500, // Large size for printing
  margin: 4, // White border around QR
  color: {
    dark: '#004E89', // Navy blue from brand colors
    light: '#FFFFFF',
  },
};

/**
 * Generate QR code for a single employee
 */
export async function generateEmployeeQR(
  employeeId: string,
  options: Partial<QROptions> = {}
): Promise<string> {
  const mergedOptions = { ...defaultOptions, ...options };
  const url = `${BASE_URL}/verify/${employeeId}`;
  const filename = `${employeeId}.${mergedOptions.type}`;
  const filepath = path.join(OUTPUT_DIR, filename);

  try {
    await QRCode.toFile(filepath, url, mergedOptions);
    console.log(`✓ Generated QR code for ${employeeId}: ${filename}`);
    return filepath;
  } catch (error) {
    console.error(`✗ Failed to generate QR for ${employeeId}:`, error);
    throw error;
  }
}

/**
 * Generate QR codes for multiple employees
 */
export async function generateBatchQR(
  employeeIds: string[],
  options: Partial<QROptions> = {}
): Promise<string[]> {
  console.log(`Generating QR codes for ${employeeIds.length} employees...`);

  const results = await Promise.allSettled(
    employeeIds.map((id) => generateEmployeeQR(id, options))
  );

  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.length - successful;

  console.log(`\nComplete: ${successful} successful, ${failed} failed`);

  return results
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
    .map((r) => r.value);
}

/**
 * Generate QR codes from Supabase employee records
 */
export async function generateQRFromDatabase(
  statusFilter: 'active' | 'all' = 'active'
): Promise<void> {
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  let query = supabase.from('employees').select('employee_id');

  if (statusFilter === 'active') {
    query = query.eq('employment_status', 'active');
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch employees:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No employees found');
    return;
  }

  const employeeIds = data.map((emp) => emp.employee_id);
  await generateBatchQR(employeeIds);
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  tsx scripts/generate-qr.ts EMP001           # Single employee');
    console.log('  tsx scripts/generate-qr.ts EMP001 EMP002    # Multiple employees');
    console.log('  tsx scripts/generate-qr.ts --all            # All active employees from DB');
    process.exit(0);
  }

  if (args[0] === '--all') {
    generateQRFromDatabase('active').catch(console.error);
  } else {
    generateBatchQR(args).catch(console.error);
  }
}
