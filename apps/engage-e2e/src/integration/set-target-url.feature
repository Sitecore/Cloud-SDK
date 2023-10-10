Feature: Developer initializes library with targetURL setting

Scenario: Developer initializes library with a valid targetURL using https protocol
    Given that the user uses a valid targetUrl that includes "https" protocol
    When the user visits the application with the url param
    Then no error is thrown

Scenario: Developer initializes library with an invalid targetURL setting
    Given that the user uses an invalid targetUrl setting
    When the user visits the application with the url param   
    Then an error is thrown: '[IV-0001] Incorrect value for "targetURL". Set the value to a valid URL string.'