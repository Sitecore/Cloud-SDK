Feature: Create client side cookie when the page is loaded

Scenario: Init search library with enableBrowserCookie=true
    Given the 'sc_[sitecoreContextId]' domain cookie is not created
    When the '/init' page is loaded
    And the 'initSearchWithEnableBrowserCookieTrue' button is clicked
    Then the cookie is automatically set with the correct bid value for the user

Scenario: Init search library with enableBrowserCookie=false
    Then the 'sc_[sitecoreContextId]' domain cookie is not created
    When the '/init' page is loaded
    And the 'initSearchWithEnableBrowserCookieFalse' button is clicked
    Then the 'sc_[sitecoreContextId]' domain cookie is not created
