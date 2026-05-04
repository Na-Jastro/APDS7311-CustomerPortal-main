// APDS7311 - ST10389916 - THE Database Seeding Script
// This is the ONLY script needed to seed the entire database with employees, customers, and payments
// Creates a complete dataset for development, testing, and demonstration purposes

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { employees, customers, payments } = require('./seed-data');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for database seeding');

    // Clear existing data (for development only)
    await Employee.deleteMany({});
    await User.deleteMany({});
    await Payment.deleteMany({});
    console.log('🧹 Cleared existing employees, customers, and payments');

    // Seed employees
    console.log('\n👥 Creating employee accounts...');
    for (const empData of employees) {
      // Create employee (password will be hashed by the model's pre-save middleware)
      const employee = new Employee({
        ...empData
      });

      await employee.save();
      console.log(`👤 Created employee: ${empData.fullName} (${empData.username}) - ${empData.role}`);
    }

    // Seed customers
    console.log('\n🏢 Creating customer accounts...');
    const createdCustomers = new Map(); // To store customer ObjectIds
    for (const custData of customers) {
      // Create customer (password will be hashed by the model's pre-save middleware)
      const customer = new User({
        ...custData
      });

      const savedCustomer = await customer.save();
      createdCustomers.set(custData.username, savedCustomer._id);
      console.log(`🏢 Created customer: ${custData.fullName} (${custData.username})`);
    }

    // Seed payments
    console.log('\n💳 Creating payment records...');
    const createdEmployees = await Employee.find({});
    const employeeMap = new Map(createdEmployees.map(emp => [emp.username, emp._id]));
    
    for (const paymentData of payments) {
      const customerId = createdCustomers.get(paymentData.customerUsername);
      if (!customerId) {
        console.warn(`⚠️  Customer not found for payment: ${paymentData.customerUsername}`);
        continue;
      }

      const paymentDoc = {
        customerId: customerId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        provider: paymentData.provider,
        payeeAccountNumber: paymentData.payeeAccountNumber,
        swiftCode: paymentData.swiftCode,
        payeeName: paymentData.payeeName,
        status: paymentData.status
      };

      // Add verification details if payment is verified
      if (paymentData.status === 'verified' && paymentData.verifiedBy) {
        const verifierId = employeeMap.get(paymentData.verifiedBy);
        if (verifierId) {
          paymentDoc.verifiedBy = verifierId;
          paymentDoc.verifiedAt = new Date();
        }
      }

      // Add submission date for submitted/completed payments
      if (['submitted', 'completed'].includes(paymentData.status)) {
        paymentDoc.submittedAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Random date within last week
      }

      // Add rejection reason for rejected payments
      if (paymentData.status === 'rejected' && paymentData.rejectionReason) {
        paymentDoc.rejectionReason = paymentData.rejectionReason;
      }

      const payment = new Payment(paymentDoc);
      await payment.save();
      console.log(`💳 Created payment: ${paymentData.amount} ${paymentData.currency} to ${paymentData.payeeName} (${paymentData.status})`);
    }    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Created: ${employees.length} employees, ${customers.length} customers, ${payments.length} payments`);
    console.log('\n📋 Employee Login Credentials:');
    console.log('=====================================');
    employees.forEach(emp => {
      console.log(`${emp.role.toUpperCase().padEnd(8)} | ${emp.fullName.padEnd(20)} | ${emp.username.padEnd(20)} | ${emp.password}`);
    });
    
    console.log('\n🏢 Customer Login Credentials:');
    console.log('=====================================');
    customers.forEach(cust => {
      console.log(`CUSTOMER | ${cust.fullName.padEnd(20)} | ${cust.username.padEnd(20)} | ${cust.password}`);
    });
    console.log('=====================================\n');    console.log('✨ Complete dataset ready for testing and development!');
    console.log('🎯 This dataset supports:');
    console.log('   • Authentication testing (customers & employees)');
    console.log('   • Payment workflow testing (all statuses)');
    console.log('   • Security testing (role-based access)');
    console.log('   • Integration testing (complete workflows)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`   ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the database seeding
console.log('🌱 Starting database seeding...');
console.log('📊 This will create a complete dataset: 8 employees, 10 customers, and 10 payment records');
console.log('🎯 Supporting comprehensive testing of all Customer  features');
seedDatabase();
