const request = require('supertest');
const app = require('../server/app'); // Adjust if needed

jest.mock('../server/models/Questions', () => ({
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));

const Questions = require('../server/models/Questions');

describe('Questions Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /questions', () => {
    it('should return all questions with status 200', async () => {
      const mockQuestions = [{ id: 1, text: 'Question 1' }];
      Questions.getAll.mockResolvedValue(mockQuestions);

      const res = await request(app).get('/questions');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockQuestions);
      expect(Questions.getAll).toHaveBeenCalledTimes(1);
    });

    it('should handle server errors', async () => {
      Questions.getAll.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/questions');
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('DB error');
    });
  });

  describe('GET /questions/:id', () => {
    it('should return a question by ID', async () => {
      const mockQuestion = { id: 1, text: 'Q1' };
      Questions.findById.mockResolvedValue(mockQuestion);

      const res = await request(app).get('/questions/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockQuestion);
    });

    it('should handle server errors', async () => {
      Questions.findById.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/questions/1');
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('DB error');
    });
  });

  describe('POST /questions', () => {
    it('should create a new question', async () => {
      const newQ = { text: 'New Q' };
      const createdQ = { id: 2, ...newQ };
      Questions.create.mockResolvedValue(createdQ);

      const res = await request(app).post('/questions').send(newQ);
      expect(res.statusCode).toBe(201);
      expect(res.body.data).toEqual(createdQ);
      expect(Questions.create).toHaveBeenCalledWith(newQ);
    });

    it('should handle server errors', async () => {
      Questions.create.mockRejectedValue(new Error('Create failed'));

      const res = await request(app).post('/questions').send({ text: 'Q' });
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Create failed');
    });
  });

  describe('PATCH /questions/:id', () => {
    it('should update a question', async () => {
      const updatedQ = { id: 1, text: 'Updated Q' };
      const mockQuestion = {
        id: 1,
        text: 'Old Q',
        update: jest.fn().mockResolvedValue(updatedQ),
      };
      Questions.findById.mockResolvedValue(mockQuestion);

      const res = await request(app).patch('/questions/1').send({ text: 'Updated Q' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updatedQ);
      expect(mockQuestion.update).toHaveBeenCalledWith({ text: 'Updated Q' });
    });

    it('should handle server errors', async () => {
      Questions.findById.mockRejectedValue(new Error('Update failed'));

      const res = await request(app).patch('/questions/1').send({ text: 'Fail' });
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Update failed');
    });
  });

  describe('DELETE /questions/:id', () => {
    it('should delete a question', async () => {
      const mockQuestion = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(),
      };
      Questions.findById.mockResolvedValue(mockQuestion);

      const res = await request(app).delete('/questions/1');
      expect(res.statusCode).toBe(204);
      expect(mockQuestion.destroy).toHaveBeenCalled();
    });

    it('should handle server errors', async () => {
      Questions.findById.mockRejectedValue(new Error('Delete failed'));

      const res = await request(app).delete('/questions/1');
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Delete failed');
    });
  });
});
