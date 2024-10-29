Feature: Developer retrieves browser id

    Scenario: Developer retrieves browser id using the corresponding method from the window and a cookie exists on the browser
        Given the '/' page is loaded
        When the "getBrowserIdFromWindow" button is clicked
        Then the getBrowserId function returns the browser id

    Scenario: Developer retrieves browser id using the corresponding method from the window and no cookie exists on the browser
        Given the '/' page is loaded
        And no cookie is created on the '/' page
        When the "getBrowserIdFromWindow" button is clicked
        Then the getBrowserId function returns an empty string

    @Smoke-Test-Events
    Scenario: Developer retrieves browser id using Engage library
        Given the '/' page is loaded
        When the "getBrowserIdFromEngage" button is clicked
        Then the getBrowserId function returns the browser id
