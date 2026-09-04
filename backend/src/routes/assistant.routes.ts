import { Router } from 'express';
import { handleAssistantChat } from '../controllers/assistant.controller.js';

const router = Router();

router.post('/chat', handleAssistantChat);

export default router;
