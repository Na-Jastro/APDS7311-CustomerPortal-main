


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
  },
  {
    username: 'Lerato.Mokoena',
    password: 'Admin123!',
    fullName: 'Lerato Mokoena',
    role: 'employee',
    department: 'Finance',
    employeeId: 'EMP002',
    email: 'lerato.mokoena@bank.com'
  },
  {
    username: 'Sipho.Dlamini',
    password: 'Admin123!',
    fullName: 'Sipho Dlamini',
    role: 'employee',
    department: 'Customer Support',
    employeeId: 'EMP003',
    email: 'sipho.dlamini@bank.com'
  },
  {
    username: 'Thabo.Nkosi',
    password: 'Admin123!',
    fullName: 'Thabo Nkosi',
    role: 'manager',
    department: 'Operations',
    employeeId: 'EMP004',
    email: 'thabo.nkosi@bank.com'
  },
  {
    username: 'Ayanda.Khumalo',
    password: 'Admin123!',
    fullName: 'Ayanda Khumalo',
    role: 'employee',
    department: 'Cyber Security',
    employeeId: 'EMP005',
    email: 'ayanda.khumalo@bank.com'
  },
  {
    username: 'Naledi.Mabena',
    password: 'Admin123!',
    fullName: 'Naledi Mabena',
    role: 'employee',
    department: 'Human Resources',
    employeeId: 'EMP006',
    email: 'naledi.mabena@bank.com'
  },
  {
    username: 'Brian.Molefe',
    password: 'Admin123!',
    fullName: 'Brian Molefe',
    role: 'employee',
    department: 'Software Development',
    employeeId: 'EMP007',
    email: 'brian.molefe@bank.com'
  },
  {
    username: 'Zanele.Ndlovu',
    password: 'Admin123!',
    fullName: 'Zanele Ndlovu',
    role: 'manager',
    department: 'Compliance',
    employeeId: 'EMP008',
    email: 'zanele.ndlovu@bank.com'
  }
];

const customers = [
  {
    fullName: 'Justice Ngwenya',
    idNumber: '0001015800080',
    accountNumber: '8963214582',
    username: 'Justice.Ngwenya',
    password: 'Admin123@'
  },
  {
    fullName: 'Precious Mthembu',
    idNumber: '9203040675087',
    accountNumber: '7854123690',
    username: 'Precious.Mthembu',
    password: 'Customer123@'
  },
  {
    fullName: 'Sibusiso Zulu',
    idNumber: '8709125432081',
    accountNumber: '6321457890',
    username: 'Sibusiso.Zulu',
    password: 'Customer123@'
  },
  {
    fullName: 'Nomsa Dube',
    idNumber: '9507210987085',
    accountNumber: '4521789630',
    username: 'Nomsa.Dube',
    password: 'Customer123@'
  },
  {
    fullName: 'Kagiso Molefe',
    idNumber: '9901154789082',
    accountNumber: '3216549870',
    username: 'Kagiso.Molefe',
    password: 'Customer123@'
  },
  {
    fullName: 'Lindokuhle Nene',
    idNumber: '0102035678088',
    accountNumber: '7412589631',
    username: 'Lindokuhle.Nene',
    password: 'Customer123@'
  },
  {
    fullName: 'Amanda Cele',
    idNumber: '9306112345089',
    accountNumber: '8523697410',
    username: 'Amanda.Cele',
    password: 'Customer123@'
  },
  {
    fullName: 'Tshepo Ramokgopa',
    idNumber: '8808247890086',
    accountNumber: '9632587410',
    username: 'Tshepo.Ramokgopa',
    password: 'Customer123@'
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
