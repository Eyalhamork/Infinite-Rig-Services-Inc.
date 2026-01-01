-- Infinite Rig Services Employee Data
-- Run this after creating the employees table

INSERT INTO public.employees (
    employee_id,
    full_name,
    position,
    department,
    photo_url,
    employment_status,
    card_issue_date,
    card_expiry_date
) VALUES
(
    'IRS-CEO-001',
    'Melee Kermue',
    'CEO/Managing Partner',
    'Executive Management',
    '/images/employees/melee.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-DCEO-002',
    'Mansfield Wrotto',
    'Deputy CEO',
    'Executive Management',
    '/images/employees/mansfield.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-HR-003',
    'Nathaniel Jallah',
    'Admin/Human Resource Manager',
    'HR & Administration',
    '/images/employees/nathaniel.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-PS-004',
    'Prince Howard',
    'Procurement/Supply Manager',
    'Procurement & Supply',
    '/images/employees/prince.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-PS-005',
    'Francis Mcdonnough',
    'Procurement and Supply Consultant',
    'Procurement & Supply',
    '/images/employees/francis.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-IT-006',
    'Mohammed Kromah',
    'IT Manager',
    'IT & Administration',
    '/images/employees/mohammed.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-IT-007',
    'Kester Howard',
    'IT Specialist',
    'IT & Administration',
    '/images/employees/kester.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-LOG-008',
    'Daniel M. Jallah',
    'Expeditor',
    'Logistics & Transportation',
    '/images/employees/daniel.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-COM-009',
    'Kadiatu Mildred Jallah',
    'Corporate Communications Officer',
    'Corporate Communications',
    '/images/employees/kadiatu.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-OPS-010',
    'Lorpu Guzeh',
    'Offshore Manager',
    'Operations',
    '/images/employees/lorpu.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-EA-011',
    'Korto Adama Massalay',
    'Executive Assistant - Office of the CEO',
    'Executive Management',
    '/images/employees/korto.png',
    'active',
    '2025-01-01',
    '2027-01-01'
),
(
    'IRS-COM-012',
    'Woods Nyanton',
    'Communication Manager',
    'Corporate Communications',
    '/images/employees/woods.png',
    'active',
    '2025-01-01',
    '2027-01-01'
);

-- Verify data inserted successfully
SELECT employee_id, full_name, position, department FROM public.employees ORDER BY employee_id;
