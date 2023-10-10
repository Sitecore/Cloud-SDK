
Feature: User calls CDP with pointOfSale parameter on request body or on settings fallback

#-- CUSTOM EVENT --
Scenario: Developer sends custom event from server passing pointOfSale only in the settings
    Given the '/fallbackPointOfSale' page is loaded
    And the 'sendEventFromServerWithPointOfSaleFromSettings' button is clicked
    Then the event is sent successfully from the server

Scenario: Developer sends custom event from server without pointOfSale in the event and in the settings
    Given the '/fallbackPointOfSale' page is loaded
    And the 'sendEventFromServerWithoutPointOfSale' button is clicked
    Then api server event request responds with status code '500'

Scenario: Developer updates pointOfSale in settings but event is sent with pointOfSale defined in event request
    Given the '/fallbackPointOfSale' page is loaded
    And pointOfSale from settings is updated to 'ryanair.com'
    When the 'sendEventWithPosAndUpdatedPosSetting' button is clicked
    Then the event request is sent with parameters:
    """
        {
            "pos": "spinair.com"
        }
    """
Scenario: Developer sends an event with pointOfSale from settings only but with empty value
    Given the '/fallbackPointOfSale' page is loaded
    And pointOfSale from settings is updated to ' '
    When the 'sendEventWithUpdatedPosSetting' button is clicked
    Then an error is thrown: '[MV-0009] "pointOfSale" cannot be empty.'

Scenario: Developer sends an event without pointOfSale parameter & without fallback from settings
    Given the '/fallbackPointOfSale' page is loaded
    When the 'sendCustomEventWithoutPointOfSale' button is clicked
    Then an error is thrown: '[MV-0003] "pointOfSale" is required.'

Scenario: Developer sends an event without pointOfSale parameter & with fallback from settings
    Given the '/fallbackPointOfSale' page is loaded with query parameters:
    """
     { "pointOfSaleFromSettings": "foo" }
    """
    When the 'sendCustomEventWithoutPointOfSale' button is clicked
    Then the 'event' request is sent with parameters:
    """
     { "pos": "foo" }
    """
Scenario: Developer sends an event with pointOfSale parameter & without fallback from settings
    Given the '/fallbackPointOfSale' page is loaded
    When the 'sendCustomEventWithPointOfSale' button is clicked
    Then the 'event' request is sent with parameters:
    """
     { "pos": "spinair.com" }
    """
Scenario: Developer sends an event with pointOfSale parameter & with fallback from settings
    Given the '/fallbackPointOfSale' page is loaded with query parameters:
    """
     { "pointOfSaleFromSettings": "foo" }
    """
    When the 'sendCustomEventWithPointOfSale' button is clicked
    Then the 'event' request is sent with parameters:
    """
     { "pos": "spinair.com" }
    """

# #-- PERSONALIZE --
# Scenario: Developer calls personalize without pointOfSale parameter & without fallback from settings
#     Given the '/fallbackPointOfSale' page is loaded
#     When the 'callPersonalizeWithoutPointOfSale' button is clicked
#     Then an error is thrown: '[MV-0003] "pointOfSale" is required.'

# Scenario: Developer calls personalize without pointOfSale parameter & with fallback from settings
#     Given the '/fallbackPointOfSale' page is loaded with query parameters:
#     """
#      { "pointOfSaleFromSettings": "foo" }
#     """
#     When the 'callPersonalizeWithoutPointOfSale' button is clicked
#     Then the 'personalize' request is sent with parameters:
#     """
#      { "pointOfSale": "foo" }
#     """
# Scenario: Developer calls personalize with pointOfSale parameter & without fallback from settings
#     Given the '/fallbackPointOfSale' page is loaded
#     When the 'callPersonalizeWithPointOfSale' button is clicked
#     Then the 'personalize' request is sent with parameters:
#     """
#      { "pointOfSale": "spinair.com" }
#     """
# Scenario: Developer calls personalize with pointOfSale parameter & with fallback from settings
#     Given the '/fallbackPointOfSale' page is loaded with query parameters:
#     """
#      { "pointOfSaleFromSettings": "foo" }
#     """
#     When the 'callPersonalizeWithPointOfSale' button is clicked
#     Then the 'personalize' request is sent with parameters:
#     """
#      { "pointOfSale": "spinair.com" }
#     """