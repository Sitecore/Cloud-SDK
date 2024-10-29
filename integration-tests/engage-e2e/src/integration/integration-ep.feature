@Integration
Feature: Developer sends events using Engage lib and EP returns the events under user's session

    Scenario: Developer sends a VIEW client side event with pageVariandId
        Given the '/' page is loaded
        When the pageView function is called
            | variantid |
            | vid       |
        Then EP returns the event with 'VIEW' type
            | pageVariantId | page      |
            | vid           | Home Page |

    Scenario: Developer sends CUSTOM client side event with ext attributes
        Given the '/customevent' page is loaded
        When the event parameters are:
            """
            {
                "type": "TEST_TYPE",
                "topLevelAttr0": "test0",
                "uid": 123,
                "booleanValue": true,
                "ext": {
                    "test": {
                        "a": "a"
                    }
                }
            }
            """
        And the 'sendEvent' button is clicked
        Then EP returns the event with parameters:
            """
            {
                "type": "TEST_TYPE",
                "topLevelAttr0": "test0",
                "uid": 123,
                "booleanValue": true,
                "ext": {
                    "test_a": "a"
                }
            }
            """

    Scenario: Developer sends IDENTITY client side event
        Given the '/identity' page is loaded
        When the user fills the identity form
            | email        | title | firstname | lastname | gender | dob              | mobile    | phone   | street       | city  | state  | country | postal_code |
            | test@tst.com | Mrs   | Test1     | Last1    | female | 2022-01-01T00:00 | 688000121 | 2213330 | Test1 Street | City1 | State1 | GR      | 12345       |
        And the 'sendIdentityEvent' button is clicked
        Then EP returns the event with 'IDENTITY' type
            | email        | title | firstname | lastname | gender | dob              | mobile    | phone   | street       | city  | state  | country | postal_code | page     |
            | test@tst.com | Mrs   | Test1     | Last1    | female | 2022-01-01T00:00 | 688000121 | 2213330 | Test1 Street | City1 | State1 | GR      | 12345       | identity |
        And EP returns the 'test@tst.com' as identifier

    Scenario: Developer sends VIEW event with referrer from server multiple times on the same session with Page attribute
        Given the '/' page is loaded
        And the 'sendEventFromServer' button is clicked
        Then EP returns the event with 'VIEW' type
            | referrer                |
            | https://www.google.com/ |
        And the 'sendEventFromServer' button is clicked
        Then EP returns the event with 'VIEW' type
            | referrer                | page     |
            | https://www.google.com/ | api-view |

    Scenario: Developer sends VIEW event with referrer from server and client side on the same session
        Given the '/' page is loaded
        When the 'sendEventFromServer' button is clicked
        Then EP returns the event with 'VIEW' type
            | referrer                |
            | https://www.google.com/ |
        And the '/' page is loaded with a different document.referrer hostname
        When the pageView function is called
        Then the event is sent with the referrer


    #We explicitly set page param on view & custom events for middleware, serverSideProps and api routs except identity to check all cases
    Scenario: Developer sends events using API and page is sent for each respective page except identity
        Given the '/' page is loaded
        And the 'sendEventFromServer' button is clicked
        Then EP returns the event with 'VIEW' type
            | page     |
            | api-view |
        When the 'customEventPage' button is clicked
        And the 'sendEventFromServer' button is clicked
        Then EP returns the event with 'CUSTOM' type
            | page       |
            | api-custom |
        When the 'identityEventPage' button is clicked
        And the 'sendEventFromServer' button is clicked
        Then EP returns the event with 'IDENTITY' type

    Scenario: Developer sends events using middleware and infer page is sent for each respective page except identity
        Given Engage is initialized in server visiting '/middleware-view-event' page
        Then EP returns the event with 'VIEW' type
            | page            |
            | middleware-view |
        When the 'middlewareCustomEventPage' button is clicked
        Then EP returns the event with 'MIDDLEWARE-CUSTOM' type
            | page              |
            | middleware-custom |
        When the 'middlewareIdentityEventPage' button is clicked
        Then EP returns the event with 'IDENTITY' type

    Scenario: Developer sends events using serverSideProps and referrer is sent for each respective page except identity
        Given Engage is initialized in server visiting '/server-side-props-view-event' page
        Then EP returns the event with 'VIEW' type
            | page                 |
            | serverSideProps-view |
        When the 'serverSidePropsCustomEventPage' button is clicked
        Then EP returns the event with 'SERVERSIDEPROPS_CUSTOM' type
            | page                   |
            | serverSideProps-custom |
        When the 'serverSidePropsIdentityEventPage' button is clicked
        Then EP returns the event with 'IDENTITY' type
