Feature: User retrieves the version of the library

    @Smoke-Test-Events
    Scenario: Developer retrieves Events version from the window object
        Given the '/' page is loaded
        When the "getVersionLibFromWindowEvents" button is clicked
        Then the expected 'events' version is returned

    Scenario: Developer retrieves Events version by calling engage.version
        Given the '/' page is loaded
        When the "getVersionLibFromEvents" button is clicked
        Then the expected 'events' version is returned

    @Smoke-Test-Events
    Scenario: Developer retrieves Personalize version from the window object
        Given the '/' page is loaded
        When the "getVersionLibFromWindowPersonalize" button is clicked
        Then the expected 'personalize' version is returned

    Scenario: Developer retrieves Personalize version by calling engage.version
        Given the '/' page is loaded
        When the "getVersionLibFromPersonalize" button is clicked
        Then the expected 'personalize' version is returned

