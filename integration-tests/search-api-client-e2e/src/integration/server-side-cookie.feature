Feature: Create server side cookie when the page is loaded

Scenario: Developer calls new init from Middleware with enableServerCookie=false
    Given the 'sc_[sitecoreContextId]' domain cookie is not created
    When the '/init' page is loaded with 'testID' name and 'initFromMiddlewareWithEnableServerCookieFalse' value query parameter
    Then the 'sc_[sitecoreContextId]' domain cookie is not created
    And server: debug log is printed out in the console with message including 'searchServer library initialized' from testID 'initFromMiddlewareWithEnableServerCookieFalse'

Scenario: Developer calls new init from Middleware with enableServerCookie=true
    Given the 'sc_[sitecoreContextId]' domain cookie is not created
    When the '/init' page is loaded with 'testID' name and 'initFromMiddlewareWithEnableServerCookieTrue' value query parameter
    Then the cookie is automatically set with the correct bid value for the user
    And server: debug log is printed out in the console with message including 'searchServer library initialized' from testID 'initFromMiddlewareWithEnableServerCookieTrue'
