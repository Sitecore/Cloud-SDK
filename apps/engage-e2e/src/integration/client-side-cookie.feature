Feature: Create client side cookie when the page is loaded

@Smoke-Test
Scenario Outline: Cookie is not created with an invalid defined cookieDomain attribute
    Given a client cookie is created at '<page>' page with '<domain>' domain
    Then the '<domain>' domain cookie is not created

    Examples:
        | page | domain         |
        | /    | test test      |
        | /    | foo            |
        | /    | localhost/     |
        | /    | test.localhost |
        | /    | /              |

@Smoke-Test
Scenario: Init engage library when no cookie exists
    Given no cookie is created on the '/' page
    When the '/' page is loaded
    Then the cookie is automatically set with the correct bid value for the user

Scenario: Init engage library when cookie exists
    Given the '/' page is loaded
    When page is reloaded
    Then only one cookie is set

@Smoke-Test
Scenario Outline: Cookie is created with a valid defined cookieDomain attribute
    Given the '<page>' page is loaded
    When a client cookie is created at '<page>' page with '<domain>' domain
    Then '<result>' cookie is created with the '<expected_domain>' domain

    Examples:
        | page | domain    | expected_domain |
        | /    | localhost | localhost       |
        | /    |           | localhost       | 

@Smoke-Test
Scenario: Cookie is created with expiry upon initialization of Engage library
    Given the '/' page is loaded
    When no TTL setting has been specified
    Then the cookie is set with the default expiry