Feature: Request page widget data from Search REST API

Scenario: Developer requests page widget data from Middleware with a valid pathname
    Given the '/get-page-widget-data' page is loaded with 'testID' name and 'getPageWidgetDataFromMiddlewareWithValidPayload' value query parameter
    Then the request with id 'getPageWidgetDataFromMiddlewareWithValidPayload' will contain:
    """
        "context":{"page":{"uri":"/test"}}
    """

Scenario: Developer requests page widget data from API with a valid pathname
    Given the '/get-page-widget-data' page is loaded
    And the 'getPageWidgetDataFromAPIWithValidPayload' button is clicked
    Then the request with id 'getPageWidgetDataFromAPIWithValidPayload' will contain:
    """
        "context":{"page":{"uri":"/test"}}
    """   

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
  And Search REST API for page widget data responds with status code '<status_code>'
  Examples:
    | pathname | context                    | status_code |
    | /test    | {"page":{"uri":"/test"}}   | 200         |
    | /search  | {"page":{"uri":"/search"}} | 200         |
