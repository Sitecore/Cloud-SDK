Feature: Request questions widget data from Search REST API

  Scenario: Developer requests questions widget data from Middleware with a valid payload
    Given the '/get-questions-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will contain:
      """
      "widget":{"items":[{"entity":"content","rfk_id":"rfkid_qa","questions":{"keyphrase":"test"}}]}
      """

    Examples:
      | testID                                                          |
      | getQuestionsWidgetDataFromMiddlewareWithValidPayload            |
      | getQuestionsWidgetDataFromMiddlewareWithValidPayloadUsingSetter |

  Scenario: Developer requests questions widget data from Middleware with all properties
    Given the '/get-questions-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will contain:
      """
      "widget":{"items":[{"entity":"content","rfk_id":"rfkid_qa","questions":{"keyphrase":"test","exact_answer":{"include_sources":true,"query_types":["keyword","question","statement"]},"related_questions":{"filter":{"name":"title","type":"eq","value":"title1"},"include_sources":true,"limit":1,"offset":1}}}]}
      """

    Examples:
      | testID                                                           |
      | getQuestionsWidgetDataFromMiddlewareWithAllPropertiesUsingSetter |
      | getQuestionsWidgetDataFromMiddlewareWithAllProperties            |


  Scenario: Developer requests questions widget data from API with a valid payload
    Given the '/get-questions-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    And the 'getQuestionsWidgetDataFromAPIWithValidPayload' button is clicked
    Then the request with id '<testID>' will contain:
      """
      "widget":{"items":[{"entity":"content","rfk_id":"rfkid_qa","questions":{"keyphrase":"test"}}]}
      """

    Examples:
      | testID                                                   |
      | getQuestionsWidgetDataFromAPIWithValidPayload            |
      | getQuestionsWidgetDataFromAPIWithValidPayloadUsingSetter |

  Scenario: Developer requests questions widget data from API with all properties
    Given the '/get-questions-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    And the 'getQuestionsWidgetDataFromAPIWithValidPayload' button is clicked
    Then the request with id '<testID>' will contain:
      """
      "widget":{"items":[{"entity":"content","rfk_id":"rfkid_qa","questions":{"keyphrase":"test","exact_answer":{"include_sources":true,"query_types":["keyword","question","statement"]},"related_questions":{"filter":{"name":"title","type":"eq","value":"title1"},"include_sources":true,"limit":1,"offset":1,"rule":{"behaviors":true,"blacklist":{"filter":{"name":"title","type":"eq","value":"title1"}},"boost":[{"filter":{"name":"title","type":"eq","value":"title1"},"slots":[1],"weight":1}],"bury":{"filter":{"name":"title","type":"eq","value":"title1"}},"include":[{"filter":{"name":"title","type":"eq","value":"title1"},"slots":[1]}],"pin":[{"id":"id1","slot":3}]}}}}]}
      """

    Examples:
      | testID                                                    |
      | getQuestionsWidgetDataFromAPIWithAllPropertiesUsingSetter |
      | getQuestionsWidgetDataFromAPIWithAllProperties            |



  Scenario: Developer requests questions widget data from browser with a valid payload
    Given the '/get-questions-widget-data' page is loaded
    When the widget item parameters are:
      """
      {
        "items": <items>
      }
      """
    And the 'getQuestionsWidgetData' button is clicked
    Then the questions widget data request is sent with parameters:
      """
      {
        "items": <items_request_payload>
      }
      """

    Examples:
      | items                                                                                                                                                                                                       | items_request_payload                                                                                                                                                                                       |
      | [{"widgetId":"rfkid_qa","entity":"content","questions":{"keyphrase":"test"}}]                                                                                                                               | [{"rfk_id":"rfkid_qa","entity":"content","questions":{"keyphrase":"test"}}]                                                                                                                                 |
      | [{"widgetId":"rfkid_qa","entity":"content","questions":{"exactAnswer":{},"keyphrase":"test"}}]                                                                                                              | [{"rfk_id":"rfkid_qa","entity":"content","questions":{"exact_answer":{},"keyphrase":"test"}}]                                                                                                               |
      | [{"widgetId":"rfkid_qa","entity":"content","questions":{"relatedQuestions":{},"keyphrase":"test"}}]                                                                                                         | [{"rfk_id":"rfkid_qa","entity":"content","questions":{"related_questions":{},"keyphrase":"test"}}]                                                                                                          |
      | [{"widgetId":"rfkid_qa","entity":"content","questions":{"exactAnswer":{ "includeSources":true, "queryTypes": ["keyword", "question", "statement"] },"keyphrase":"test"}}]                                   | [{"rfk_id":"rfkid_qa","entity":"content","questions":{"exact_answer":{ "include_sources":true, "query_types": ["keyword", "question", "statement"] },"keyphrase":"test"}}]                                  |
      | [{"widgetId":"rfkid_qa","entity":"content","questions":{"keyphrase":"test","relatedQuestions":{"filter":{"type":"eq","name":"test","value":["test","test2"]},"includeSources":true,"limit":1,"offset":1}}}] | [{"rfk_id":"rfkid_qa","entity":"content","questions":{"keyphrase":"test","related_questions":{"filter":{"type":"eq","name":"test","value":["test","test2"]},"include_sources":true,"limit":1,"offset":1}}}] |


  Scenario: Developer requests question widget data from browser with a invalid payload
    Given the '/get-questions-widget-data' page is loaded
    When the widget item parameters are:
      """
      {
        "items": <items>
      }
      """
    And the 'getQuestionsWidgetData' button is clicked
    Then an error is thrown: '<error_code>'

    Examples:
      | items                                                                                                          | error_code                                                                                                      |
      | [{"widgetId":"rfkid_qa","entity":"content","questions":{"keyphrase":""}}]                                      | [IV-0009] Incorrect value for "​keyphrase"​​. Set the value to a string between 1 and 100 characters inclusive. |
      | [{"widgetId":"rfkid_qa","entity":"content","questions":{"relatedQuestions":{"limit":-1},"keyphrase":"test"}}]  | [IV-0007] Incorrect value for "limit". Set the value to an integer between 1 and 100 inclusive.                 |
      | [{"widgetId":"rfkid_qa","entity":"content","questions":{"relatedQuestions":{"limit":200},"keyphrase":"test"}}] | [IV-0007] Incorrect value for "limit". Set the value to an integer between 1 and 100 inclusive.                 |
      | [{"widgetId":"rfkid_qa","entity":"content","questions":{"relatedQuestions":{"offset":-1},"keyphrase":"test"}}] | [IV-0008] Incorrect value for "offset". Set the value to an integer greater than or equal to 0.                 |
