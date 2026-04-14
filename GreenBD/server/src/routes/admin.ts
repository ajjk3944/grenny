import { Router } from 'express';
import bcrypt from 'bcrypt';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/roleGuard';
import { prisma } from '../utils/prisma';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.post('/security-users', async (req: AuthRequest, res) => {
  try {
    const { name, phone, email, password, assignedArea } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const securityId = `SEC${Date.now().toString().slice(-6)}`;

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        securityId,
        assignedArea,
        role: 'SECURITY',
      },
    });

    res.status(201).json({ user, securityId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create security user' });
  }
});

router.get('/security-users', async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'SECURITY' },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        securityId: true,
        assignedArea: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch security users' });
  }
});

router.put('/security-users/:id', async (req: AuthRequest, res) => {
  try {
    const { name, phone, email, assignedArea, password } = req.body;

    const updateData: any = { name, phone, email, assignedArea };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id, role: 'SECURITY' },
      data: updateData,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update security user' });
  }
});

router.delete('/security-users/:id', async (req: AuthRequest, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id, role: 'SECURITY' },
    });

    res.json({ message: 'Security user deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete security user' });
  }
});

router.get('/users', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 50, search, district } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { role: 'USER' };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (district) {
      where.district = district;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        district: true,
        totalPoints: true,
        grade: true,
        banned: true,
        redMarked: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    });

    const total = await prisma.user.count({ where });

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id/ban', async (req: AuthRequest, res) => {
  try {
    const { banned, banExpiry } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        banned,
        banExpiry: banExpiry ? new Date(banExpiry) : null,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ban status' });
  }
});

router.put('/users/:id/redmark', async (req: AuthRequest, res) => {
  try {
    const { redMarked } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { redMarked },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update red mark status' });
  }
});

router.get('/messages', async (req: AuthRequest, res) => {
  try {
    const { status, type } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: { id: true, name: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.put('/messages/:id/resolve', async (req: AuthRequest, res) => {
  try {
    const { adminReply } = req.body;

    const message = await prisma.message.update({
      where: { id: req.params.id },
      data: {
        status: 'RESOLVED',
        adminReply,
        resolvedAt: new Date(),
      },
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve message' });
  }
});

router.post('/notices', async (req: AuthRequest, res) => {
  try {
    const { title, body, priority, recipientType, recipientIds, recipientDistrict } = req.body;

    const notice = await prisma.notice.create({
      data: {
        title,
        body,
        priority,
        recipientType,
        recipientIds: recipientIds || [],
        recipientDistrict,
      },
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

router.get('/config', async (req: AuthRequest, res) => {
  try {
    const configs = await prisma.appConfig.findMany();
    const configMap = configs.reduce((acc, c) => ({ ...acc, [c.key]: c.value }), {});
    res.json(configMap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

router.put('/config', async (req: AuthRequest, res) => {
  try {
    const updates = req.body;

    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.appConfig.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      )
    );

    res.json({ message: 'Config updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

export default router;
