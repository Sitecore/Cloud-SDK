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
            | testID                                                                      |
            | getRecommendationWidgetDataFromAPIWithEmptyContent           |
 
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
            | items                                                                                                 | items_request_payload                                                                              | status_code |
            | [{"rfkId":"rfkid_7","entity":"content"}]                                                              | [{"rfk_id":"rfkid_7","entity":"content"}]                                                          | 200         |
            | [{"rfkId":"rfkid_7","entity":"content","recommendations":{}}]                                         | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{}}]                                     | 200         |
            | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"content":{}}}]                             | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"content":{}}}]                         | 200         |
            | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"content":{"fields":["id"]}}}]              | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"content":{"fields":["id"]}}}]          | 200         |
            | [{"rfkId":"rfkid_7","entity":"content","recommendations":{"content":{"fields":["id","type"]}}}]       | [{"rfk_id":"rfkid_7","entity":"content","recommendations":{"content":{"fields":["id","type"]}}}]   | 200         |
          