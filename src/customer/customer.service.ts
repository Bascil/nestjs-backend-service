import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerService {
  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    // Fetching customers with their associated role
    const customers = await prisma.customer.findMany({
      skip: skip,
      take: pageSize,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        address: true,
        isActive: true,
      },
    });

    // Counting total customers for pagination
    const totalCustomers = await prisma.customer.count();
    const totalPages = Math.ceil(totalCustomers / pageSize);

    // Structuring the response to include role name
    const formattedCustomers = customers.map((customer) => ({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      isActive: customer.isActive,
    }));

    return {
      data: formattedCustomers, // Moving customers to data field
      meta: {
        from: skip + 1,
        to: skip + customers.length,
        total: totalCustomers,
        perPage: pageSize,
        lastPage: totalPages,
        currentPage: page,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    };
  }

  async getCustomerById(customerId: string) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        address: true,
        isActive: true,
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      isActive: customer.isActive,
    };
  }

  async createCustomer(customerData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
  }) {
    const newCustomer = await prisma.customer.create({
      data: {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phoneNumber: customerData.phoneNumber,
        address: customerData.address,
      },
    });

    return newCustomer;
  }

  async updateCustomer(
    customerId: string,
    updateData: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      address: string;
    }>,
  ) {
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber,
        address: updateData.address,
      },
    });

    return updatedCustomer;
  }

  async deleteCustomer(customerId: string) {
    await prisma.customer.delete({
      where: { id: customerId },
    });
    return { message: 'Customer deleted successfully' };
  }
}

export default CustomerService;
