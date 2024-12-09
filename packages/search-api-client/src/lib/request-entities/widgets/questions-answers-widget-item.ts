// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type {
  ExactAnswerOptions,
  QuestionsAnswersOptions,
  QuestionsAnswersWidgetItemDTO,
  RelatedQuestionsOptions
} from './interfaces';
import { WidgetItem } from './widget-item';

export class QuestionsAnswersWidgetItem extends WidgetItem {
  private _keyphrase: string;
  private _exactAnswer?: ExactAnswerOptions;
  private _relatedQuestions?: RelatedQuestionsOptions;

  /**
   * Creates and holds the functionality of a questions answers widget item.
   * @param entity - The widget's item entity.
   * @param rfkId - The widget's item rfkId.
   * @param questionsAnswersOptions - The widget's questions answers options object.
   */
  constructor(entity: string, rfkId: string, questionsAnswersOptions: QuestionsAnswersOptions) {
    super(entity, rfkId);

    this._validateStringLengthInRange1To100(ErrorMessages.IV_0009, questionsAnswersOptions.keyphrase);
    this._keyphrase = questionsAnswersOptions.keyphrase;

    this._exactAnswer = questionsAnswersOptions.exactAnswer;
    if (questionsAnswersOptions.relatedQuestions) {
      this._validateRelatedQuestions(questionsAnswersOptions.relatedQuestions);
      this._relatedQuestions = questionsAnswersOptions.relatedQuestions;
    }
  }

  private _validateRelatedQuestions(relatedQuestions: RelatedQuestionsOptions) {
    this._validateNumberInRange1To100(ErrorMessages.IV_0007, relatedQuestions.limit);
    this._validatePositiveInteger(ErrorMessages.IV_0008, relatedQuestions.offset);
  }

  /**
   * Sets the keyphrase for the QuestionsAnswersWidgetItem.
   * This method updates the `keyphrase` property of the questions answers configuration.
   *
   * @param keyphrase - The keyphrase that the visitor enters to search for relevant content.
   */
  set keyphrase(keyphrase: string) {
    this._validateStringLengthInRange1To100(ErrorMessages.IV_0009, keyphrase);

    this._keyphrase = keyphrase;
  }

  /**
   * @returns The keyphrase property of the QuestionsAnswersWidgetItem.
   */
  get keyphrase() {
    return this._keyphrase;
  }

  /**
   * Sets the exactAnswer for the QuestionsAnswersWidgetItem.
   * This method updates the `exactAnswer` property of the questions answers configuration.
   *
   * @param exactAnswer - The exactAnswer that the visitor enters to search for relevant content.
   */
  set exactAnswer(exactAnswer: ExactAnswerOptions) {
    this._exactAnswer = exactAnswer;
  }

  /**
   * @returns The exactAnswer property of the QuestionsAnswersWidgetItem.
   */
  get exactAnswer(): ExactAnswerOptions | undefined {
    return this._exactAnswer;
  }

  /**
   * Sets the exactAnswer to undefined
   */
  resetExactAnswer() {
    this._exactAnswer = undefined;
  }

  /**
   * Sets the relatedQuestions for the QuestionsAnswersWidgetItem.
   * This method updates the `relatedQuestions` property of the questions answers configuration.
   *
   * @param relatedQuestions - The relatedQuestions that the visitor enters to search for relevant content.
   */
  set relatedQuestions(relatedQuestions: RelatedQuestionsOptions) {
    this._validateRelatedQuestions(relatedQuestions);

    this._relatedQuestions = relatedQuestions;
  }

  /**
   * @returns The relatedQuestions property of the QuestionsAnswersWidgetItem.
   */
  get relatedQuestions(): RelatedQuestionsOptions | undefined {
    return this._relatedQuestions;
  }

  /**
   * Sets the relatedQuestions to undefined
   */
  resetRelatedQuestions() {
    this._relatedQuestions = undefined;
  }

  private _exactAnswerToDTO() {
    if (!this._exactAnswer) return;

    return { include_sources: this._exactAnswer.includeSources, query_types: this._exactAnswer.queryTypes };
  }

  private _relatedQuestionsToDTO() {
    if (!this._relatedQuestions) return;

    return {
      filter: this._relatedQuestions.filter?.toDTO(),
      include_sources: this._relatedQuestions.includeSources,
      limit: this._relatedQuestions.limit,
      offset: this._relatedQuestions.offset
    };
  }

  /**
   * Maps the questions answers widget item to its DTO format.
   */
  toDTO(): QuestionsAnswersWidgetItemDTO {
    return {
      ...super.toDTO(),
      questions: {
        keyphrase: this._keyphrase,
        ...{ exact_answer: this._exactAnswerToDTO() },
        ...{ related_questions: this._relatedQuestionsToDTO() }
      }
    };
  }
}
