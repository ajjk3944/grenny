import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';
import { prisma } from '../utils/prisma';
import { config } from '../config';

const router = Router();

router.post('/login-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email, role: 'ADMIN' },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/login-security', async (req, res) => {
  try {
    const { securityId, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { securityId, role: 'SECURITY' },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/login-phone', async (req, res) => {
  try {
    const { phone } = req.body;

    let user = await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: `User ${phone.slice(-4)}`,
          role: 'USER',
        },
      });
    }

    res.json({ userId: user.id, message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ error: 'Phone login failed' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

router.post('/login-google', async (req, res) => {
  try {
    const { idToken } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    let user = await prisma.user.findUnique({ where: { email: email || undefined } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || 'User',
          role: 'USER',
        },
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Google login failed' });
  }
});

router.post('/login-facebook', async (req, res) => {
  try {
    const { accessToken } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(accessToken);
    const { uid, email, name } = decodedToken;

    let user = await prisma.user.findUnique({ where: { email: email || undefined } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || 'User',
          role: 'USER',
        },
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Facebook login failed' });
  }
});

export default router;
