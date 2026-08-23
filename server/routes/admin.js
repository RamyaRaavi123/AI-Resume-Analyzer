const express = require('express');
const {
  getUsers,
  updateUserRole,
  deleteUser,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  moderateContent,
  getAnalytics,
  createChallenge,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();
router.use(protect, admin);

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.patch('/questions/:id/moderate', moderateContent);
router.post('/challenges', createChallenge);

module.exports = router;
