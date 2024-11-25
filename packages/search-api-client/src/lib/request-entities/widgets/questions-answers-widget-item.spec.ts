import { ErrorMessages } from '../../consts';
import { ComparisonFilter } from '../filters/comparison-filter';
import { QuestionsAnswersWidgetItem } from './questions-answers-widget-item';

describe('QuestionsAnswersWidgetItem widget item class', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('QuestionsAnswersWidgetItem main properties with constructor', () => {
    it('should set only the mandatory properties', () => {
      const widgetItem = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', { keyphrase: 'test' });
      const dto = widgetItem.toDTO();

      expect(dto.questions.exact_answer).toBeUndefined();
      expect(dto.questions.related_questions).toBeUndefined();
      expect(dto.entity).toEqual('content');
      expect(dto.rfk_id).toEqual('rfkid_qa');
      expect(dto.questions.keyphrase).toBe('test');
    });

    it('should set the optional properties to empty objects', () => {
      const widgetItem = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', {
        exactAnswer: {},
        keyphrase: 'test',
        relatedQuestions: {}
      });
      const dto = widgetItem.toDTO();

      expect(dto.questions.exact_answer).toEqual({});
      expect(dto.questions.related_questions).toEqual({});
    });

    it('should set the optional properties to their full values', () => {
      const widgetItem = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', {
        exactAnswer: { includeSources: true, queryTypes: ['keyword'] },
        keyphrase: 'test',
        relatedQuestions: {
          filter: new ComparisonFilter('test', 'eq', 'te'),
          includeSources: true,
          limit: 10,
          offset: 5
        }
      });
      const dto = widgetItem.toDTO();
      expect(dto.questions.exact_answer).toEqual({
        include_sources: true,
        query_types: ['keyword']
      });
      expect(dto.questions.related_questions).toEqual({
        filter: { name: 'test', type: 'eq', value: 'te' },
        include_sources: true,
        limit: 10,
        offset: 5
      });
    });
  });

  describe('QuestionsAnswersWidgetItem main properties with setters', () => {
    it('should set only the mandatory properties', () => {
      const widgetItem = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', { keyphrase: 'test' });

      widgetItem.keyphrase = 'mutated';
      const dto = widgetItem.toDTO();

      expect(dto.questions.keyphrase).toBe('mutated');
    });

    it('should set the optional properties to empty objects', () => {
      const widgetItem = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', {
        keyphrase: 'test'
      });

      widgetItem.exactAnswer = {};
      widgetItem.relatedQuestions = {};

      const dto = widgetItem.toDTO();

      expect(dto.questions.exact_answer).toEqual({});
      expect(dto.questions.related_questions).toEqual({});
    });

    it('should set the optional properties to their full values', () => {
      const widgetItem = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', {
        keyphrase: 'test'
      });

      widgetItem.exactAnswer = { includeSources: true, queryTypes: ['keyword'] };
      widgetItem.relatedQuestions = {
        filter: new ComparisonFilter('test', 'eq', 'te'),
        includeSources: true,
        limit: 10,
        offset: 5
      };

      const dto = widgetItem.toDTO();
      expect(dto.questions.exact_answer).toEqual({
        include_sources: true,
        query_types: ['keyword']
      });
      expect(dto.questions.related_questions).toEqual({
        filter: { name: 'test', type: 'eq', value: 'te' },
        include_sources: true,
        limit: 10,
        offset: 5
      });
    });
  });

  describe('QuestionsAnswersWidgetItem reset functions', () => {
    it('should reset the optional properties', () => {
      const widgetItem = new QuestionsAnswersWidgetItem('content', 'rfkid_qa', {
        exactAnswer: {},
        keyphrase: 'test',
        relatedQuestions: {}
      });
      let dto = widgetItem.toDTO();

      expect(dto.questions.exact_answer).toEqual({});
      expect(dto.questions.related_questions).toEqual({});

      widgetItem.resetExactAnswer();
      widgetItem.resetRelatedQuestions();

      dto = widgetItem.toDTO();

      expect(dto.questions.exact_answer).toBeUndefined();
      expect(dto.questions.related_questions).toBeUndefined();
    });
  });

  describe('QuestionsAnswersWidgetItem validations', () => {
    it.each(['', 't'.repeat(101)])('should throw error if invalid keyphrase is provided', (keyphrase) => {
      expect(() => {
        new QuestionsAnswersWidgetItem('content', 'rfkid_qa', {
          keyphrase: keyphrase as string
        });
      }).toThrow(ErrorMessages.IV_0009);
    });

    it.each(['t', ' t ', 't'.repeat(100)])('should not throw error if valid keyphrase is provided', (keyphrase) => {
      expect(() => {
        new QuestionsAnswersWidgetItem('content', 'rfkid_qa', {
          keyphrase: keyphrase as string
        });
      }).not.toThrow(ErrorMessages.IV_0009);
    });

    it.each([-1])('should throw error if invalid offset is provided', (offset) => {
      expect(() => {
        new QuestionsAnswersWidgetItem('content', 'rfkid_qa', {
          keyphrase: 'test',
          relatedQuestions: { offset: offset as unknown as number }
        });
      }).toThrow(ErrorMessages.IV_0008);
    });

    it.each([0, 1, 101])('should not throw error if valid offset is provided', (offset) => {
      expect(() => {
        new QuestionsAnswersWidgetItem('content', 'rfkid_qa', {
          keyphrase: 'test',
          relatedQuestions: { offset: offset as unknown as number }
        });
      }).not.toThrow();
    });
  });
});
