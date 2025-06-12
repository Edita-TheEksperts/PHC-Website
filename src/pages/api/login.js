import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // 🔍 Try logging in as User first
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role || "user" },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
return res.status(200).json({ token, role: user.role });
    }

    // 🔍 Try logging in as Employee if not a User
    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (employee && employee.password && await bcrypt.compare(password, employee.password)) {
      if (employee.status !== 'approved') {
        return res.status(403).json({ message: 'Your employee account is not yet approved.' });
      }

      const token = jwt.sign(
        { id: employee.id, email: employee.email, role: "employee" },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.status(200).json({ token, role: "employee" });
    }

    // ❌ If neither matched
    return res.status(401).json({ message: 'Invalid email or password' });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'Server error' });
  }
}
