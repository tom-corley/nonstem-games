jest.mock('../../middleware/auth', () => (req, res, next) => next());

const request = require('supertest');
const app = require('../../app');

const Games = require('../../models/Games');
jest.mock('../../models/Games'); 

describe('Game Controller', () => {
  describe('POST /games/start', () => {
    it('returns 201 and game data on success', async () => {
      const mockGame = { id: 1, category: 'Europe', total_questions: 3 };
      const mockQuestions = [{ id: 1, question: 'What is the capital of France?' }];

      Games.start.mockResolvedValue({ game: mockGame, game_questions: mockQuestions });

      const res = await request(app)
        .post('/games/start')
        .send({ user_id: 1, category: 'Europe', num_questions: 3 });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('game');
      expect(res.body).toHaveProperty('game_questions');
    });

    it('returns 500 on error', async () => {
      Games.start.mockRejectedValue(new Error('Start game failed'));

      const res = await request(app)
        .post('/games/start')
        .send({ user_id: 1, category: 'Europe', num_questions: 3 });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Start game failed');
    });
  });

  describe('PATCH /games/:game_id/submit', () => {
    it('returns 200 and updated game on success', async () => {
      const updatedGame = { id: 1, score: 2, correct_answers: 2 };
      Games.submitResults.mockResolvedValue(updatedGame);

      const res = await request(app)
        .patch('/games/1/submit')
        .send({ results: [{ question_id: 1, was_correct: true }] });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('score', 2);
    });

    it('returns 500 on error', async () => {
      Games.submitResults.mockRejectedValue(new Error('Submit failed'));

      const res = await request(app)
        .patch('/games/1/submit')
        .send({ results: [{ question_id: 1, was_correct: true }] });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Submit failed');
    });
  });
});
