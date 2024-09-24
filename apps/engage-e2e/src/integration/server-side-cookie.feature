Feature: Developer is setting for the creation of a server-set cookie

    @RestartServer-Middleware
    Scenario: Error is thrown if no browser id is retrieved
        #Artificial way to make the get cookie from EP fail by passing a valid random url
        Given '/middleware-server-cookie' page is loaded with enableServerCookie true and an invalid sitecoreEdgeContextId parameter
        Then an error is thrown: '[IE-0003] Unable to set the "sc_{SitecoreEdgeContextId}" cookie because the browser ID could not be retrieved from the server. Make sure to set the correct values for "sitecoreEdgeContextId" and "siteName". If the issue persists, try again later or use try-catch blocks to handle this error.'

    @Smoke-Test-Events @RestartServer-Middleware
    Scenario: create a server site cookie when no cookie exists on a page
        Given no cookie is created on the '/middleware-server-cookie' page
        When server cookies are created on the '/middleware-server-cookie' page
        Then the server cookies contain the browserID and guestID cookies returned from the API call

    @RestartServer-Middleware
    Scenario: A cookie already exists on the page, enableServerCookie doesn't create a new cookie but updates TTL
        Given server cookies are created on the '/middleware-server-cookie' page
        When '/middleware-server-cookie' page is loaded again with enableServerCookie parameter
        Then the server updates the TTL of the server cookies according to the settings

    @RestartServer-Server-Side-Props
    Scenario Outline: Cookies are not created when an invalid cookieDomain is given
        Given server cookies are requested to be created at '/server-side-props-server-cookie' page with '<domain>' domain
        Then the '<domain>' domain cookie is not created

        Examples:
            | domain         |
            | 52214y4ry45    |
            | localhost/     |
            | test.localhost |
            | foo            |
            | /              |

    @RestartServer-Server-Side-Props
    Scenario Outline: Cookies are created when a valid cookieDomain is given
        Given server cookies are requested to be created at '/server-side-props-server-cookie' page with '<domain>' domain
        Then server cookies are created with '<expected_domain>' domain

        Examples:
            | domain    | expected_domain |
            | localhost | localhost       |
            |           | localhost       |

    @RestartServer-Server-Side-Props
    Scenario: a cookie exists on the page another cookie won't be set when page is visited directly
        Given server cookies are created on the '/server-side-props-server-cookie' page
        When page is reloaded
        Then the server updates the TTL of the server cookies according to the settings

    @Smoke-Test-Events @RestartServer-Server-Side-Props
    Scenario: Developer requests cookie from server using initServer with timeOut and EP fails to respond
        Given the initServer function is triggered from '/server-side-props-server-cookie' page with timeout: '<timeout>'
        Then an error is thrown: '[IE-0002] Timeout exceeded. The server did not respond within the allotted time.'

        Examples:
            | timeout |
            | 0       |
            | 1       |

    @Smoke-Test-Events @RestartServer-Server-Side-Props
    Scenario: Developer requests cookie from server using initServer with timeOut and EP responds timely
        Given the initServer function is triggered from '/server-side-props-server-cookie' page with timeout: '5000'
        Then no error is thrown

    @Smoke-Test-Events @RestartServer-Server-Side-Props
    Scenario: Developer requests cookie from server with invalid timeout input
        Given the initServer function is triggered from '/server-side-props-server-cookie' page with timeout: '-10'
        Then an error is thrown: '[IV-0006] Incorrect value for "timeout". Set the value to an integer greater than or equal to 0.'

    @RestartServer-Server-Side-Props
    Scenario: Developer requests cookie from server using initServer without specifying timeout
        Given Engage is initialized in server visiting '/server-side-props-custom-event' page
        Then no error is thrown