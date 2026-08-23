require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { CodingChallenge } = require('./models/CodingChallenge');
const Question = require('./models/Question');

const seed = async () => {
  await connectDB();

  const challengeCount = await CodingChallenge.countDocuments();
  if (challengeCount === 0) {
    await CodingChallenge.insertMany([
      {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'easy',
        languages: ['javascript', 'python', 'java'],
        timeLimit: 30,
        testCases: [
          { input: 'nums=[2,7,11,15], target=9', expectedOutput: '[0,1]', isHidden: false },
          { input: 'nums=[3,2,4], target=6', expectedOutput: '[1,2]', isHidden: true },
        ],
        topic: 'Arrays',
        company: 'Google',
      },
      {
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
        difficulty: 'easy',
        languages: ['javascript', 'python', 'java'],
        timeLimit: 20,
        testCases: [
          { input: 's="()"', expectedOutput: 'true', isHidden: false },
          { input: 's="(]"', expectedOutput: 'false', isHidden: true },
        ],
        topic: 'Stack',
        company: 'Amazon',
      },
      {
        title: 'Merge Intervals',
        description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
        difficulty: 'medium',
        languages: ['javascript', 'python', 'java'],
        timeLimit: 45,
        testCases: [
          { input: 'intervals=[[1,3],[2,6],[8,10]]', expectedOutput: '[[1,6],[8,10]]', isHidden: false },
        ],
        topic: 'Sorting',
        company: 'Microsoft',
      },
    ]);
    console.log('Coding challenges seeded');
  }

  const questionCount = await Question.countDocuments();
  if (questionCount === 0) {
    await Question.insertMany([
      { category: 'technical', difficulty: 'intermediate', question: 'Explain the difference between REST and GraphQL.', topic: 'API Design', company: 'Google' },
      { category: 'hr', difficulty: 'beginner', question: 'Tell me about yourself.', topic: 'Introduction', company: 'Amazon' },
      { category: 'behavioral', difficulty: 'intermediate', question: 'Describe a time you handled a conflict in a team.', topic: 'Teamwork', company: 'Microsoft' },
      { category: 'system-design', difficulty: 'advanced', question: 'Design a URL shortener like bit.ly.', topic: 'System Design', company: 'Meta' },
      { category: 'coding', difficulty: 'intermediate', question: 'Implement LRU Cache.', topic: 'Data Structures', company: 'Google' },
    ]);
    console.log('Questions seeded');
  }

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
