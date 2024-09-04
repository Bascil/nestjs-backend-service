import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LeadService {
  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    // Fetching leads with their associated role
    const leads = await prisma.lead.findMany({
      skip: skip,
      take: pageSize,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        source: true,
        email: true,
        phoneNumber: true,
        address: true,
        status: true,
      },
    });

    // Counting total leads for pagination
    const totalLeads = await prisma.lead.count();
    const totalPages = Math.ceil(totalLeads / pageSize);

    // Structuring the response to include role name
    const formattedLeads = leads.map((lead) => ({
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phoneNumber: lead.phoneNumber,
      source: lead.source,
      address: lead.address,
      status: lead.status,
    }));

    return {
      data: formattedLeads, // Moving leads to data field
      meta: {
        from: skip + 1,
        to: skip + leads.length,
        total: totalLeads,
        perPage: pageSize,
        lastPage: totalPages,
        currentPage: page,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    };
  }

  async getLeadById(leadId: string) {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        source: true,
        address: true,
        status: true,
      },
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    return {
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      source: lead.source,
      address: lead.address,
      status: lead.status,
    };
  }

  async createLead(leadData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    source: string;
    address: string;
  }) {
    const newLead = await prisma.lead.create({
      data: {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phoneNumber: leadData.phoneNumber,
        source: leadData.source,
        address: leadData.address,
      },
    });

    return newLead;
  }

  async updateLead(
    leadId: string,
    updateData: Partial<{
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
      source: string;
      address: string;
    }>,
  ) {
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        phoneNumber: updateData.phoneNumber,
        email: updateData.email,
        source: updateData.source,
        address: updateData.address,
      },
    });

    return updatedLead;
  }

  async deleteLead(leadId: string) {
    await prisma.lead.delete({
      where: { id: leadId },
    });
    return { message: 'Lead deleted successfully' };
  }
}

export default LeadService;
