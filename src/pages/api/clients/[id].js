import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Initialize Prisma Client

// API route to get client details by ID
export default async function handler(req, res) {
  const { id } = req.query;  // Get the client ID from the URL parameter

  if (req.method === 'GET') {
    try {
      const client = await prisma.user.findUnique({
        where: { id: id },  // Find the client by ID
      });

      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      res.status(200).json(client);  // Return the client details
    } catch (error) {
      console.error('Error fetching client details:', error);
      res.status(500).json({ message: 'Failed to fetch client details' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
