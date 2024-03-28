Feature: Developer is setting for the creation of a server-set cookie

@Middleware-Server-Side-Cookie
Scenario: Error is thrown if no browser id is retrieved
    #Artificial way to make the get cookie from EP fail by passing a valid random url
    Given '/middleware-server-cookie' page is loaded with enableServerCookie true and an invalid sitecoreEdgeContextId parameter
    Then an error is thrown: '[IE-0003] Unable to set the cookie because the browser ID could not be retrieved from the server. Try again later, or use try-catch blocks to handle this error.'

@Smoke-Test-Events @Middleware-Server-Side-Cookie
Scenario: create a server site cookie when no cookie exists on a page
    Given no cookie is created on the '/middleware-server-cookie' page
    When a server cookie is created on the '/middleware-server-cookie' page
    Then the server cookie contains the browserID returned from the API call

@Middleware-Server-Side-Cookie
Scenario: A cookie already exists on the page, enableServerCookie doesn't create a new cookie but updates TTL
   Given a server cookie is created on the '/middleware-server-cookie' page
   When '/middleware-server-cookie' page is loaded again with enableServerCookie parameter
   Then the server updates the TTL of the server cookie according to the settings

@Server-Side-Props-Server-Cookie
Scenario Outline: Cookie is not created when an invalid cookieDomain is given
    Given a server cookie is requested to be created at '/server-side-props-server-cookie' page with '<domain>' domain
    Then the '<domain>' domain cookie is not created

    Examples:
        | domain         |
        | 52214y4ry45    |
        | localhost/     |
        | test.localhost |
        | foo            |
        | /              |

@Server-Side-Props-Server-Cookie
Scenario Outline: Cookie is created when a valid cookieDomain is given
    Given a server cookie is requested to be created at '/server-side-props-server-cookie' page with '<domain>' domain
    Then a server cookie is created with '<expected_domain>' domain

    Examples:
        | domain         | expected_domain |
        | localhost      | localhost       |
        |                | localhost       |

@Server-Side-Props-Server-Cookie
Scenario: a cookie exists on the page another cookie won't be set when page is visited directly
    Given a server cookie is created on the '/server-side-props-server-cookie' page
    When page is reloaded
    Then the server updates the TTL of the server cookie according to the settings

@Smoke-Test-Events @Server-Side-Props-Server-Cookie
Scenario: Developer requests cookie from server using initServer with timeOut and EP fails to respond
    Given the initServer function is triggered from '/server-side-props-server-cookie' page with timeout: '<timeout>'
    Then an error is thrown: '[IE-0002] Timeout exceeded. The server did not respond within the allotted time.'

    Examples:
        | timeout |
        |    0    |
        |    1    |

@Smoke-Test-Events @Server-Side-Props-Server-Cookie
Scenario: Developer requests cookie from server using initServer with timeOut and EP responds timely
    Given the initServer function is triggered from '/server-side-props-server-cookie' page with timeout: '5000'
    Then no error is thrown

@Smoke-Test-Events @Server-Side-Props-Server-Cookie
Scenario: Developer requests cookie from server with invalid timeout input
    Given the initServer function is triggered from '/server-side-props-server-cookie' page with timeout: '-10'
    Then an error is thrown: '[IV-0006] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.'

@Server-Side-Props-Server-Cookie
Scenario: Developer requests cookie from server using initServer without specifying timeout
Given Engage is initialized in server visiting '/server-side-props-custom-event' page
Then no error is thrown