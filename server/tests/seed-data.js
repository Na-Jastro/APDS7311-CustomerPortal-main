


const employees = [
  {
    username: 'admin.admin',
    password: 'Admin123!',
    fullName: 'Admin',
    role: 'admin',
    department: 'System Administration',
    employeeId: 'ADM001',
    email: 'admin.admin@bank.com'
  },
  {
    username: 'Mpho.Magagula',
    password: 'Admin123!',
    fullName: 'Mpho Magagula',
    role: 'employee',
    department: 'Head Of IT',
    employeeId: 'ST10389916',
    email: 'mpho.magagula@bank.com'
  }
];

const customers = [
  {
    fullName: 'Justice Ngwenya',
    idNumber: '0001015800080',
    accountNumber: '8963214582',
    username: 'Justice.Ngwenya',
    password: 'Admin123@'
  }
];







const payments = [  // Pending payments
  {
    customerUsername: 'benjamin.carter',
    amount: 15000.00,
    currency: 'USD',
    provider: 'SWIFT',
    payeeAccountNumber: 'GB29NWBK60161331926819', // UK IBAN
    swiftCode: 'NWBKGB2L',
    payeeName: 'TechCorp Solutions Ltd',
    status: 'pending'
  }
];


const testEmployees = [
  employees.find(emp => emp.username === 'sarah.chen'),      // Manager
  employees.find(emp => emp.username === 'emily.watson'),    // Employee
  employees.find(emp => emp.username === 'michael.rodriguez') // Admin
];

const testCustomers = [
  customers.find(cust => cust.username === 'benjamin.carter'),
  customers.find(cust => cust.username === 'catherine.williams')
];

const testPayments = [
  payments.find(pay => pay.customerUsername === 'benjamin.carter'),
  payments.find(pay => pay.customerUsername === 'catherine.williams')
];

/**
 * Utility functions for accessing seed data
 */
const getSeedData = {
  // Get all employees
  getAllEmployees: () => employees,

  // Get all customers
  getAllCustomers: () => customers,

  // Get all payments
  getAllPayments: () => payments,

  // Get employees by role
  getEmployeesByRole: (role) => employees.filter(emp => emp.role === role),

  // Get payments by status
  getPaymentsByStatus: (status) => payments.filter(pay => pay.status === status),

  // Get payments by customer
  getPaymentsByCustomer: (username) => payments.filter(pay => pay.customerUsername === username),

  // Get specific employee by username
  getEmployee: (username) => employees.find(emp => emp.username === username),

  // Get specific customer by username
  getCustomer: (username) => customers.find(cust => cust.username === username),

  // Get test subsets
  getTestEmployees: () => testEmployees,
  getTestCustomers: () => testCustomers,
  getTestPayments: () => testPayments, 

  // Get credentials for authentication testing
  getManagerCredentials: () => employees.find(emp => emp.role === 'manager'),
  getAdminCredentials: () => employees.find(emp => emp.role === 'admin'),
  getEmployeeCredentials: () => employees.find(emp => emp.role === 'employee'),
  getCustomerCredentials: () => customers[0]
};

module.exports = {
  employees,
  customers,
  payments,
  testEmployees,
  testCustomers,
  testPayments,
  getSeedData
};
