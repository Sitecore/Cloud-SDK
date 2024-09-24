Feature: Create client side cookie when the page is loaded

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

    @Smoke-Test-Events
    Scenario: Init engage library when no cookie exists
        Given no cookie is created on the '/' page
        When the '/' page is loaded
        Then the cookie is automatically set with the correct bid and gid value for the user

    @Smoke-Test-Events
    Scenario: Init engage library when cookie exists
        Given the '/' page is loaded
        When page is reloaded
        Then only one cookie is set

    Scenario Outline: Cookie is created with a valid defined cookieDomain attribute
        Given the '<page>' page is loaded
        When a client cookie is created at '<page>' page with '<domain>' domain
        Then '<result>' cookie is created with the '<expected_domain>' domain

        Examples:
            | page | domain    | expected_domain |
            | /    | localhost | localhost       |
            | /    |           | localhost       |

    @Smoke-Test-Events
    Scenario: Cookie is created with expiry upon initialization of Engage library
        Given the '/' page is loaded
        When no TTL setting has been specified
        Then the cookie is set with the default expiry

    Scenario: Error is thrown if no browser id is retrieved
        #Artificial way to make the get cookie from edge proxy fail by passing a valid random url
        Given '/' page is loaded with enableBrowserCookie true and an invalid sitecoreEdgeContextId parameter
        Then an error is thrown: '[IE-0003] Unable to set the "sc_{SitecoreEdgeContextId}" cookie because the browser ID could not be retrieved from the server. Make sure to set the correct values for "sitecoreEdgeContextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.'
