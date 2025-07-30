// __tests__/questions.model.test.js

const db = require('../../database/connect');
const Questions = require('../../models/Questions');

jest.mock('../../database/connect');

describe('Questions model (mocked)', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAll()', () => {
    it('returns an array of Questions instances', async () => {
      db.query.mockResolvedValueOnce({
        rows: [
          { id: 1, category: 'Geography', question_text: 'What is the capital of France?' }
        ],
      });

      const result = await Questions.getAll();

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM questions');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeInstanceOf(Questions);
      expect(result[0].category).toBe('Geography');
      expect(result[0].question_text).toBe('What is the capital of France?');
    });

    it('returns empty array if no questions found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const result = await Questions.getAll();

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM questions');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('findById()', () => {
    it('returns a Question instance when found', async () => {
      const mockRow = { id: 1, category: 'Science', question_text: 'What is H2O?' };
      db.query.mockResolvedValueOnce({ rows: [mockRow] });

      const question = await Questions.findById(1);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id = $1'), [1]);
      expect(question).toBeInstanceOf(Questions);
      expect(question.id).toBe(1);
      expect(question.category).toBe('Science');
      expect(question.question_text).toBe('What is H2O?');
    });

    it('throws error when question not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(Questions.findById(999)).rejects.toThrow('Question not found');
    });
  });

  describe('create()', () => {
    it('creates and returns new Question instance', async () => {
      const newQuestionData = {
        category: 'History',
        difficulty: 'Medium',
        question_text: 'Who was the first president of the USA?',
        correct_answer: 'George Washington',
        question_type: 'multiple_choice',
        is_active: true,
        choice_a: 'George Washington',
        choice_b: 'Thomas Jefferson',
        choice_c: 'Abraham Lincoln',
        choice_d: 'John Adams',
        image_url: null
      };

      const dbResponse = {
        rows: [
          { id: 42, ...newQuestionData }
        ],
      };

      db.query.mockResolvedValueOnce(dbResponse);

      const newQuestion = await Questions.create(newQuestionData);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO questions'),
        [
          newQuestionData.category,
          newQuestionData.difficulty,
          newQuestionData.question_text,
          newQuestionData.correct_answer,
          newQuestionData.question_type,
          newQuestionData.is_active,
          newQuestionData.choice_a,
          newQuestionData.choice_b,
          newQuestionData.choice_c,
          newQuestionData.choice_d,
          newQuestionData.image_url
        ]
      );

      expect(newQuestion).toBeInstanceOf(Questions);
      expect(newQuestion.id).toBe(42);
      expect(newQuestion.category).toBe('History');
    });
  });

  // Optional: Add update() and destroy() tests if those instance methods exist on your model
});
