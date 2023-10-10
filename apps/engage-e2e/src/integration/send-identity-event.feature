Feature: User sends identity events to CDP

@Smoke-Test
Scenario: Developer sends identity event from server
    Given the '/identity' page is loaded with query parameters
        | pointOfSale   | email         |
        | spinair.com   | test@test.com |
    And the 'sendEventFromServer' button is clicked
    Then the event is sent successfully from the server

Scenario: Developer sends identity event from server omitting required parameter "pointOfSale" or provide a bad "email"
    Given the '/identity' page is loaded with query parameters
        | pointOfSale   | email   |
        | <pointOfSale> | <email> |
    And the 'sendEventFromServer' button is clicked
    Then api server event request responds with status code '500'

        Examples:
        | pointOfSale | email         |
        |             | test@test.com |
        | spinair.com | bademail      |

Scenario Outline: User fills form and triggers identity event
    Given the '/identity' page is loaded
    When the user fills the identity form
        | email | title | firstname | lastname | gender | dob | mobile | phone | street | city | state | country | postal_code |
        | <Email> | <Title> | <FirstName> | <LastName> | <Gender> | <DoB> | <Mobile> | <Phone> | <Street> | <City> | <State> | <Country> | <PostalCode> |
    And the 'sendIdentityEvent' button is clicked    
    Then the event is sent with 'IDENTITY' type
        | email | title | firstname | lastname | gender | dob | mobile | phone | street | city | state | country | postal_code |
        | <Email> | <Title> | <FirstName> | <LastName> | <Gender> | <DoB> | <Mobile> | <Phone> | <Street> | <City> | <State> | <Country> | <PostalCode> |
    And the '<Email>' email is sent as the identifier

    Examples:
        | Email | Title | FirstName | LastName | Gender | DoB | Mobile | Phone | Street | City | State | Country | PostalCode |
        | test_identity_1@tst.com | Mrs | Test1 | Last1 | female | 2022-01-01T00:00 | 688000121 | 2213330 | Test1 Street | City1 | State1 | GR | 12345 |
        | test_identity_5@tst.com |   |   |   |   |   |   |   |   |   |   |   |   |
        |   |   |   |   |   |   |   |   |   |   |   |   |   |

Scenario: User fills form with invalid email and an error is thrown
    Given the '/identity' page is loaded
    When the user inputs an invalid email to identity form
    And the 'sendIdentityEvent' button is clicked   
    Then an error is thrown: '[IV-0003] Incorrect value for "email". Set the value to a valid email address.'

Scenario Outline: User fills form with invalid date data and triggers identity event
    Given the '/identity' page is loaded
    When the user inputs an invalid date format in '<field>' of identity form
    And the 'sendIdentityEvent' button is clicked    
    Then an error is thrown: '<errorMessage>'

    Examples:
        | field       | errorMessage                                                                        |
        | dob         | [IV-0002] Incorrect value for "dob". Format the value according to ISO 8601.        |      
        | expiry_date | [IV-0004] Incorrect value for "expiryDate". Format the value according to ISO 8601. |  

Scenario: Developer sends IDENTITY event without ext object
    Given the '/identity' page is loaded
    When the 'sendIdentityWithoutExtObject' button is clicked
    Then the event is sent without ext

Scenario: Developer sends IDENTITY event with empty ext object
    Given the '/identity' page is loaded
    When the 'sendIdentityWithEmptyExt' button is clicked
    Then the event is sent without ext

@Smoke-Test
Scenario Outline: Developer creates identity event with ext attributes
    Given the '/identity' page is loaded with query parameters
       | extAttributesNumber | nested                   |
       | 3                   | {"a":"a","b":1,"c":true} |
    And the 'sendIdentityWithExtObject' button is clicked
    Then the event is sent with 'IDENTITY' type
        | extAttributesNumber | nested                   |
        | 3                   | {"a":"a","b":1,"c":true} |  

Scenario Outline: Developer creates identity event with ext attributes that exceed the limit
    Given the '/identity' page is loaded with query parameters
        | extAttributesNumber | nested                    |
        | 48                   | {"a":"a","b":1,"c":true} |
    And the 'sendIdentityWithExtObject' button is clicked
    Then an error is thrown: '[IV-0005] This event supports maximum 50 attributes. Reduce the number of attributes.'

