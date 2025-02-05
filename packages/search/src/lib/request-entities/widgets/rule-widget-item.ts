// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import { ErrorMessages } from '../../consts';
import type { ArrayOfAtLeastOne, Filter } from '../filters/interfaces';
import type { BoostRuleDTO, IncludeRuleDTO, PinItemDTO, SearchRuleDTO, SearchRuleOptions } from './interfaces';
import { WidgetItem } from './widget-item';

/** Base class for widgets that support rules functionality */
export class RuleWidgetItem extends WidgetItem {
  protected _rule?: SearchRuleOptions;

  /**
   *
   * @param entity - the entity value of the RuleWidgetItem.
   * @param widgetId - the widgetId value of the RuleWidgetItem.
   * @param rule - the {@link SearchRuleOptions} of the RuleWidgetItem.
   * @throws - {@link ErrorMessages.IV_0027} | {@link ErrorMessages.IV_0028}
   */
  constructor(entity: string, widgetId: string, rule?: SearchRuleOptions) {
    super(entity, widgetId);

    if (rule) {
      this._validateRule(rule);
      this._rule = rule;
    }
  }

  /**
   * Sets the `rule` property
   * @param rule - the {@link SearchRuleOptions} value to be applied.
   * @throws - {@link ErrorMessages.IV_0027} | {@link ErrorMessages.IV_0028}
   */
  set rule(rule: SearchRuleOptions) {
    this._validateRule(rule);
    this._rule = rule;
  }

  /**
   * @returns the {@link SearchRuleOptions} `rule` property of the RuleWidgetItem.
   */
  get rule(): SearchRuleOptions | undefined {
    return this._rule;
  }

  resetRule(): void {
    this._rule = undefined;
  }

  /**
   * Throws error if on of the rule properties has invalid data.
   * @param rule - {@link SearchRuleOptions}
   * @throws - {@link ErrorMessages.IV_0027} | {@link ErrorMessages.IV_0028}
   */
  protected _validateRule(rule?: SearchRuleOptions): void {
    if (!rule) return;

    // Validate pin rules
    rule.pin?.forEach((pin) => {
      this._validateNonEmptyString(ErrorMessages.IV_0027, pin.id);
      this._validatePositiveInteger(ErrorMessages.IV_0028, pin.slot);
    });

    // Validate boost rules
    rule.boost?.forEach((item) =>
      item.slots?.forEach((slot) => this._validatePositiveInteger(ErrorMessages.IV_0028, slot))
    );

    // Validate include rules
    rule.include?.forEach((item) =>
      item.slots.forEach((slot) => this._validatePositiveInteger(ErrorMessages.IV_0028, slot))
    );
  }

  /**
   *
   * @param rules - array of {@link ArrayOfAtLeastOne} object with properties `filter` `slots` `weight`
   * @returns the rule property in a boost rule DTO format {@link BoostRuleDTO}[].
   */
  private _convertToBoostRuleDTO(
    rules: ArrayOfAtLeastOne<{
      filter: Filter;
      slots?: ArrayOfAtLeastOne<number>;
      weight?: number;
    }>
  ): ArrayOfAtLeastOne<BoostRuleDTO> {
    return rules.map((rule) => ({
      filter: rule.filter.toDTO(),
      slots: rule.slots,
      weight: rule.weight
    })) as ArrayOfAtLeastOne<BoostRuleDTO>;
  }

  /**
   *
   * @param rules - array of {@link ArrayOfAtLeastOne} object with properties `filter` `slots`
   * @returns the rule property in IncludeRuleDTO format {@link IncludeRuleDTO}[].
   */
  private _convertToIncludeRuleDTO(
    rules: ArrayOfAtLeastOne<{
      filter: Filter;
      slots: ArrayOfAtLeastOne<number>;
    }>
  ): ArrayOfAtLeastOne<IncludeRuleDTO> {
    return rules.map((rule) => ({
      filter: rule.filter.toDTO(),
      slots: rule.slots
    })) as ArrayOfAtLeastOne<IncludeRuleDTO>;
  }

  /**
   *
   * @param rule - {@link SearchRuleOptions}
   * @returns - returns RuleWidgetItem in its DTO format {@link SearchRuleDTO}.
   */
  protected _ruleToDTO(rule?: SearchRuleOptions): SearchRuleDTO | undefined {
    if (!rule) return undefined;

    const dto: SearchRuleDTO = {
      behaviors: rule.behaviors
    };

    if (rule.blacklist) dto.blacklist = { filter: rule.blacklist.filter.toDTO() };
    if (rule.boost) dto.boost = this._convertToBoostRuleDTO(rule.boost);
    if (rule.bury) dto.bury = { filter: rule.bury.filter.toDTO() };
    if (rule.include) dto.include = this._convertToIncludeRuleDTO(rule.include);
    if (rule.pin) dto.pin = rule.pin as ArrayOfAtLeastOne<PinItemDTO>;

    return dto;
  }
}
