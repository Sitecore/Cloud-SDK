Feature: Request page widget data from Search REST API

    Scenario: Developer requests page widget data from Middleware with a valid pathname
        Given the '/get-page-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
        Then the request with id '<testID>' will contain:
            """
            "context":{"page":{"uri":"/test"}}
            """

        Examples:
            | testID                                                 |
            | getPageWidgetDataFromMiddlewareWithValidPayload        |
            | getPageWidgetDataFromMiddlewareWithValidContextPayload |


    Scenario: Developer requests page widget data from API with a valid pathname
        Given the '/get-page-widget-data' page is loaded
        And the 'getPageWidgetDataFromAPIWithValidPayload' button is clicked
        Then the request with id 'getPageWidgetDataFromAPIWithValidPayload' will contain:
            """
            "context":{"page":{"uri":"/test"}}
            """

        Examples:
            | testID                                          |
            | getPageWidgetDataFromAPIWithValidPayload        |
            | getPageWidgetDataFromAPIWithValidContextPayload |

    Scenario Outline: Developer requests page widget data with a valid pathname
        Given the '/get-page-widget-data' page is loaded
        When the pathname parameter is '<pathname>'
        And the 'getPageWidgetData' button is clicked
        Then the page widget data request is sent with parameters:
            """
            {
                "context": <context>
            }
            """

        Examples:
            | pathname | context                    |
            | /test    | {"page":{"uri":"/test"}}   |
            | /search  | {"page":{"uri":"/search"}} |

    Scenario Outline: Developer requests page widget data with a valid context
        Given the '/get-page-widget-data' page is loaded
        When the context parameter is '<context>'
        And the 'getPageWidgetDataWithContext' button is clicked
        Then the page widget data request is sent with parameters:
            """
            {
                "context": <context>
            }
            """

        Examples:
            | context                    |
            | {"page":{"uri":"/test"}  } |
            | {"page":{"uri":"/search"}} |


    Scenario: Developer requests page widget data with a invalid context
        Given the '/get-page-widget-data' page is loaded
        When the context parameter is '<context>'
        And the 'getPageWidgetDataWithContext' button is clicked
        Then an error is thrown: '<error_message>'


        Examples:
            | context | error_message                             |
            | {  }    | [MV-0006] "context.page.uri" is required. |
