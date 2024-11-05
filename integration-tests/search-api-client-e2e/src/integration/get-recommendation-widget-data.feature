Feature: Request recommendation widget data from Search REST API

  Scenario: Developer requests recommendation widget data from Middleware with a valid payload
    Given the '/get-recommendation-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will contain:
      """
      "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","recommendations":{"content":{"fields":["id"]}}}]}
      """

    Examples:
      | testID                                                               |
      | getRecommendationWidgetDataFromMiddlewareWithValidPayload            |
      | getRecommendationWidgetDataFromMiddlewareWithValidPayloadUsingSetter |

  Scenario: Developer requests recommendation widget data from Middleware with filter payload
    Given the '/get-recommendation-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will contain:
      """
      "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","recommendations":{"filter":{"name":"title","type":"eq","value":"title1"}}}]}
      """

    Examples:
      | testID                                               |
      | getRecommendationWidgetDataFromMiddlewareWithFilters |

  Scenario: Developer requests recommendation widget data from Middleware with groupBy payload
    Given the '/get-recommendation-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will contain:
      """
      "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","recommendations":{"group_by":"type"}}]}
      """

    Examples:
      | testID                                               |
      | getRecommendationWidgetDataFromMiddlewareWithGroupBy |

  Scenario: Developer requests recommendation widget data from Middleware with limit payload
    Given the '/get-recommendation-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will contain:
      """
      "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","recommendations":{"limit":1}}]}
      """

    Examples:
      | testID                                             |
      | getRecommendationWidgetDataFromMiddlewareWithLimit |

  Scenario: Developer requests recommendation widget data from API with a valid payload
    Given the '/get-recommendation-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    And the 'getRecommendationWidgetDataFromAPIWithValidPayload' button is clicked
    Then the request with id '<testID>' will contain:
      """
      "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","recommendations":{"content":{"fields":["id"]}}}]}
      """

    Examples:
      | testID                                                        |
      | getRecommendationWidgetDataFromAPIWithValidPayload            |
      | getRecommendationWidgetDataFromAPIWithValidPayloadUsingSetter |

  Scenario: Developer requests recommendation widget data from API with empty content
    Given the '/get-recommendation-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    And the 'getRecommendationWidgetDataFromAPIWithEmptyContent' button is clicked
    Then the request with id '<testID>' will contain:
      """
      "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","recommendations":{"content":{}}}]}
      """

    Examples:
      | testID                                             |
      | getRecommendationWidgetDataFromAPIWithEmptyContent |

  Scenario: Developer requests recommendation widget data from browser with a valid payload
    Given the '/get-recommendation-widget-data' page is loaded
    When the widget item parameters are:
      """
      {
        "items": <items>
      }
      """
    And the 'getRecommendationWidgetData' button is clicked
    Then the recommendation widget data request is sent with parameters:
      """
      {
        "items": <items_request_payload>
      }
      """
    Then Search API responds with status code '<status_code>'

    Examples:
      | items                                                                                                                                                                                       | items_request_payload                                                                                                                                                                        | status_code |
      | [{"rfkId":"rfkid_7","entity":"content"}]                                                                                                                                                    | [{"rfk_id":"rfkid_7","entity":"content"}]                                                                                                                                                    | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{}}]                                                                                                                               | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{}}]                                                                                                                               | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"content":{}}}]                                                                                                                   | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"content":{}}}]                                                                                                                   | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"content":{"fields":["id"]}}}]                                                                                                    | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"content":{"fields":["id"]}}}]                                                                                                    | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"content":{"fields":["id","type"]}}}]                                                                                             | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"content":{"fields":["id","type"]}}}]                                                                                             | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"filter":{"name":"title","type":"eq","value":"title1"}}}]                                                                         | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"filter":{"name":"title","type":"eq","value":"title1"}}}]                                                                         | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"filter":{"type":"or","filters":[{"type":"lt","name":"title","value":"50"},{"type":"gt","name":"title","value":"0"}]}}}]          | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"filter":{"type":"or","filters":[{"type":"lt","name":"title","value":"50"},{"type":"gt","name":"title","value":"0"}]}}}]          | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"filter":{"type":"geoDistance","name":"title","distance":"10km"}}}]                                                               | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"filter":{"type":"geoDistance","name":"title","distance":"10km"}}}]                                                               | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"filter":{"type":"allOf","name":"title","values":["test"]}}}]                                                                     | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"filter":{"type":"allOf","name":"title","values":["test"]}}}]                                                                     | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"filter":{"type":"geoWithin","name":"title","coordinates":[{"lat":0.3,"lon":0.3},{"lat":0.3,"lon":0.3},{"lat":0.3,"lon":0.3}]}}}] | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"filter":{"type":"geoWithin","name":"title","coordinates":[{"lat":0.3,"lon":0.3},{"lat":0.3,"lon":0.3},{"lat":0.3,"lon":0.3}]}}}] | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"groupBy": "type"}}]                                                                                                              | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"group_by":"type"}}]                                                                                                              | 200         |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"limit":1}}]                                                                                                                      | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"limit":1}}]                                                                                                                      | 200         |

  Scenario: Developer requests recommendation widget data from browser with a invalid payload
    Given the '/get-recommendation-widget-data' page is loaded
    When the widget item parameters are:
      """
      {
        "items": <items>
      }
      """
    And the 'getRecommendationWidgetData' button is clicked
    Then an error is thrown: '<error_code>'

    Examples:
      | items                                                                     | error_code                                                                                      |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"limit":-1}}]   | [IV-0007] Incorrect value for "limit". Set the value to an integer between 1 and 100 inclusive. |
      | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"groupBy":""}}] | [IV-0022] Incorrect value for "groupBy". Set the value to a non-empty string.                   |
