import { Router } from 'express';

const router = new Router();

router.get('/', (req, res) => {
  res.json(['Test Movie 1', 'Test Movie 2']);
});

export default router;
