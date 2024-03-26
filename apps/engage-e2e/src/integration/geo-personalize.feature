@personalize
Feature: Auto-populate geolocation data in NextJS middleware

Scenario: Geolocation data is available in the request.geo object
    Given the '/middleware-personalize-geo' page is loaded without init function
    When the 'middlewarePersonalizeGeoButton' button is clicked
    Then we display the request payload UI:
    """
        {"channel":"WEB","currency":"EUR","email":"test_personalize_callflows@test.com","friendlyId":"personalizeintegrationtest","language":"EN","geo":{"city":"Athens","country":"GR","region":"I"}}
    """

Scenario: Partial geolocation data is available in the request.geo object
    Given the '/middleware-personalize-geo-partial' page is loaded without init function
    When the 'middlewarePersonalizeGeoButton' button is clicked
    Then we display the request payload UI:
    """
        {"channel":"WEB","currency":"EUR","email":"test_personalize_callflows@test.com","friendlyId":"personalizeintegrationtest","language":"EN","geo":{"city":"Athens","region":"I"}}
    """

Scenario: No geolocation data is available in the request.geo object
    Given the '/middleware-personalize-geo-no-data' page is loaded without init function
    When the 'middlewarePersonalizeGeoButton' button is clicked
    Then we display the request payload UI:
    """
        {"channel":"WEB","currency":"EUR","email":"test_personalize_callflows@test.com","friendlyId":"personalizeintegrationtest","language":"EN"}
    """

Scenario: Geolocation data is available in the request.geo object and in personalizeInput
    Given the '/middleware-personalize-geo-omit' page is loaded without init function
    When the 'middlewarePersonalizeGeoButton' button is clicked
    Then we display the request payload UI:
    """
        {"channel":"WEB","currency":"EUR","email":"test_personalize_callflows@test.com","friendlyId":"personalizeintegrationtest","language":"EN","geo":{"city":"Tarnów","country":"PL","region":"12"}}
    """
