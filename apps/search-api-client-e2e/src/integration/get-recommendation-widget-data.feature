Feature: Request recommendation widget data from Search REST API

    Scenario: Developer requests recommendation widget data from Middleware with a valid payload
        Given the '/get-recommendation-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
        Then the request with id '<testID>' will contain:
            """
            "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","recommendations":{}}]}
            """

        Examples:
            | testID                                                       |
            | getRecommendationWidgetDataFromMiddlewareWithValidPayload    |


   Scenario: Developer requests recommendation widget data from API with a valid payload
        Given the '/get-recommendation-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
        And the 'getRecommendationWidgetDataFromAPIWithValidPayload' button is clicked
        Then the request with id '<testID>' will contain:
            """
            "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","recommendations":{}}]}
            """

        Examples:
            | testID                                                |
            | getRecommendationWidgetDataFromAPIWithValidPayload    |
 

    Scenario: Developer requests recommendation widget data from browser with a valid payload
        Given the '/get-recommendation-widget-data' page is loaded
        When the widget item parameters are:
            """
            {
                "items": <items>
            }
            """
        And the 'getRecommendationWidgetData' button is clicked
        Then the widget data request is sent with parameters:
            """
            {
                "items": <items_payload>
            }
            """
        And Search REST API responds with status code '<status_code>'

        Examples:
            | items                                                                    | items_payload                                                            | status_code |                                                                                                                                                                                                                                                                                                                                                                                                                                                               
            | [{"rfkId":"rfkid_7","entity":"content"}]                                 | [{"rfkId":"rfkid_7","entity":"content"}]                                 | 200         |                                                                                                                                                                                                                                                                                                                                                                                                                                                     
            | [{"rfkId":"rfkid_7","entity":"content","recommendations":{}}]            | [{"rfkId":"rfkid_7","entity":"content","recommendations":{}}]            | 200         | 
          