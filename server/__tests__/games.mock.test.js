// __tests__/games.model.mock.test.js
const db = require('../database/connect');
const Games = require('../models/Games');
const Questions = require('../models/Questions');

jest.mock('../database/connect'); // mock db.query
jest.mock('../models/Questions'); // optional, to avoid real Questions logic

describe('Games model (mocked db)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('start()', () => {
    it('calls correct queries to start a game', async () => {
      const user_id = 5;
      const category = 'Geography';
      const num_questions = 2;

      db.query
        .mockResolvedValueOnce({
          rows: [
            { id: 101, category, is_active: true },
            { id: 102, category, is_active: true },
          ]
        }) // mock SELECT questions
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            user_id,
            category,
            total_questions: 2,
            score: 0,
            started_at: new Date(),
            ended_at: null,
            correct_answers: 0
          }]
        }) // mock INSERT game
        .mockResolvedValueOnce({ rows: [{ id: 201 }] }) // mock first game_question insert
        .mockResolvedValueOnce({ rows: [{ id: 202 }] }); // mock second game_question insert

      const result = await Games.start(user_id, category, num_questions);

      expect(db.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('SELECT * FROM questions'),
        [category, num_questions]
      );
      expect(db.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO games'),
        [user_id, category, 2]
      );
      expect(db.query).toHaveBeenNthCalledWith(3,
        expect.stringContaining('INSERT INTO game_questions'),
        [1, 101, 1, category]
      );
      expect(db.query).toHaveBeenNthCalledWith(4,
        expect.stringContaining('INSERT INTO game_questions'),
        [1, 102, 2, category]
      );

      expect(result).toHaveProperty('game');
      expect(result).toHaveProperty('game_questions');
      expect(result.game_questions.length).toBe(2);
    });
  });

  describe('submitResults()', () => {
    it('calls correct queries to update results', async () => {
      const game_id = 1;
      const results = [
        { question_id: 101, was_correct: true },
        { question_id: 102, was_correct: false },
      ];

      db.query
        // mock UPDATE game_questions (twice)
        .mockResolvedValueOnce({}) 
        .mockResolvedValueOnce({}) 
        // mock UPDATE games
        .mockResolvedValueOnce({
          rows: [{
            id: game_id,
            score: 1,
            correct_answers: 1,
            ended_at: new Date()
          }]
        });

      const updatedGame = await Games.submitResults(game_id, results);

      expect(db.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('UPDATE game_questions SET was_correct'),
        [true, game_id, 101]
      );
      expect(db.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('UPDATE game_questions SET was_correct'),
        [false, game_id, 102]
      );
      expect(db.query).toHaveBeenNthCalledWith(3,
        expect.stringContaining('UPDATE games SET correct_answers'),
        [1, game_id]
      );

      expect(updatedGame).toHaveProperty('id', game_id);
      expect(updatedGame.score).toBe(1);
    });
  });
});
