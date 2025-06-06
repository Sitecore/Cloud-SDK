// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { ArrayOfAtLeastOne } from '../filters/interfaces';
import type {
  ExactAnswerOptions,
  QuestionsAnswersOptions,
  QuestionsAnswersWidgetItemDTO,
  RelatedQuestionsOptions
} from './interfaces';
import { RuleWidgetItem } from './rule-widget-item';

export class QuestionsAnswersWidgetItem extends RuleWidgetItem {
  private _keyphrase: string;
  private _exactAnswer?: ExactAnswerOptions;
  private _relatedQuestions?: RelatedQuestionsOptions;

  /**
   * Creates and holds the functionality of a questions answers widget item.
   * @param entity - The widget's item entity.
   * @param widgetId - The widget's item id.
   * @param questionsAnswersOptions - The widget's {@link QuestionsAnswersOptions} object.
   * @param sources - The widget's sources.
   * @throws - {@link ErrorMessages.IV_0007} | {@link ErrorMessages.IV_0008} | {@link ErrorMessages.IV_0009}
   */
  constructor(
    entity: string,
    widgetId: string,
    questionsAnswersOptions: QuestionsAnswersOptions,
    sources?: ArrayOfAtLeastOne<string>
  ) {
    super(entity, widgetId, questionsAnswersOptions.rule, sources);

    this._validateStringLengthInRange1To100(ErrorMessages.IV_0009, questionsAnswersOptions.keyphrase);
    this._keyphrase = questionsAnswersOptions.keyphrase;

    this._exactAnswer = questionsAnswersOptions.exactAnswer;
    if (questionsAnswersOptions.relatedQuestions) {
      this._validateRelatedQuestions(questionsAnswersOptions.relatedQuestions);
      this._relatedQuestions = questionsAnswersOptions.relatedQuestions;
    }
  }

  /**
   * Throws an error if limit is outside of range of 1 ~ 100 or offset is not a positive integer
   * @param relatedQuestions - {@link RelatedQuestionsOptions}
   * @throws - {@link ErrorMessages.IV_0007} | {@link ErrorMessages.IV_0008}
   */
  private _validateRelatedQuestions(relatedQuestions: RelatedQuestionsOptions) {
    this._validateNumberInRange1To100(ErrorMessages.IV_0007, relatedQuestions.limit);
    this._validatePositiveInteger(ErrorMessages.IV_0008, relatedQuestions.offset);
  }

  /**
   * Sets the keyphrase for the QuestionsAnswersWidgetItem.
   * This method updates the `keyphrase` property of the questions answers configuration.
   *
   * @param keyphrase - The keyphrase that the visitor enters to search for relevant content.
   * @throws - {@link ErrorMessages.IV_0009}
   */
  set keyphrase(keyphrase: string) {
    this._validateStringLengthInRange1To100(ErrorMessages.IV_0009, keyphrase);

    this._keyphrase = keyphrase;
  }

  /**
   * @returns The keyphrase property of the QuestionsAnswersWidgetItem.
   */
  get keyphrase(): string {
    return this._keyphrase;
  }

  /**
   * Sets the exactAnswer for the QuestionsAnswersWidgetItem.
   * This method updates the `exactAnswer` property of the questions answers configuration.
   *
   * @param exactAnswer - The {@link ExactAnswerOptions} that the visitor enters to search for relevant content.
   */
  set exactAnswer(exactAnswer: ExactAnswerOptions) {
    this._exactAnswer = exactAnswer;
  }

  /**
   * @returns The {@link ExactAnswerOptions} `exactAnswer` property of the QuestionsAnswersWidgetItem.
   */
  get exactAnswer(): ExactAnswerOptions | undefined {
    return this._exactAnswer;
  }

  /**
   * Sets the exactAnswer to undefined
   */
  resetExactAnswer(): void {
    this._exactAnswer = undefined;
  }

  /**
   * Sets the relatedQuestions for the QuestionsAnswersWidgetItem.
   * This method updates the `relatedQuestions` property of the questions answers configuration.
   *
   * @param relatedQuestions - {@link RelatedQuestionsOptions} that the visitor enters to search for relevant content.
   * @throws - {@link ErrorMessages.IV_0007} | {@link ErrorMessages.IV_0008}
   */
  set relatedQuestions(relatedQuestions: RelatedQuestionsOptions) {
    this._validateRelatedQuestions(relatedQuestions);

    this._relatedQuestions = relatedQuestions;
  }

  /**
   * @returns The {@link RelatedQuestionsOptions} `relatedQuestions` property of the QuestionsAnswersWidgetItem.
   */
  get relatedQuestions(): RelatedQuestionsOptions | undefined {
    return this._relatedQuestions;
  }

  /**
   * Sets the relatedQuestions to undefined
   */
  resetRelatedQuestions(): void {
    this._relatedQuestions = undefined;
  }

  /**
   *
   * @returns exactAnswer property in its DTO format.
   */
  private _exactAnswerToDTO() {
    if (!this._exactAnswer) return;

    return { include_sources: this._exactAnswer.includeSources, query_types: this._exactAnswer.queryTypes };
  }

  /**
   *
   * @returns relatedQuestions property in its DTO format.
   */
  private _relatedQuestionsToDTO() {
    if (!this._relatedQuestions) return;

    return {
      filter: this._relatedQuestions.filter?.toDTO(),
      include_sources: this._relatedQuestions.includeSources,
      limit: this._relatedQuestions.limit,
      offset: this._relatedQuestions.offset,
      rule: this._ruleToDTO(this._rule)
    };
  }

  /**
   * Maps the questions answers widget item to its DTO format {@link QuestionsAnswersWidgetItemDTO}.
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
