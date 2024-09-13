@EnableClientDebug
Feature: Create client side cookie when the page is loaded

Scenario: Init search package with enableBrowserCookie=false
    Given the 'sc_[sitecoreContextId]' domain cookie is not created
    When the '/init' page is loaded
    And the 'initSearchWithEnableBrowserCookieFalse' button is clicked
    And the 'sc_[sitecoreContextId]' domain cookie is not created
    Then client: debug log is printed out in the console with message including 'searchClient library initialized'

Scenario: Init search package with enableBrowserCookie=true
    Given the 'sc_[sitecoreContextId]' domain cookie is not created
    When the '/init' page is loaded
    And the 'initSearchWithEnableBrowserCookieTrue' button is clicked
    And the cookie is automatically set with the correct bid value for the user
    Then client: debug log is printed out in the console with message including 'searchClient library initialized'

