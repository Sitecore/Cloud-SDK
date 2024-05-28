Feature: Request widget data from Search REST API

Scenario: Developer requests widget data from Middleware with a valid payload
    Given the '/get-widget-data' page is loaded with 'testID' name and 'getWidgetDataFromMiddlewareWithValidPayload' value query parameter
    Then the request with id 'getWidgetDataFromMiddlewareWithValidPayload' will contain:
    """
        "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7"}]}
    """

Scenario: Developer requests widget data from API with a valid payload
    Given the '/get-widget-data' page is loaded
    And the 'getWidgetDataFromAPIWithValidPayload' button is clicked
    Then the request with id 'getWidgetDataFromAPIWithValidPayload' will contain:
    """
        "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7"}]}
    """
    
Scenario Outline: Developer requests widget data from browser with a valid payload
  Given the '/get-widget-data' page is loaded
  When the widget item parameters are:
  """
      { 
          "items": <items>
      }
  """
  And the 'getWidgetData' button is clicked
  Then the widget data request is sent with parameters:
  """
      {
          "items": <items_with_search>
      }
  """
  And Search REST API responds with status code '<status_code>'
  And Search API responds with:
  """
      {
          "items": <response>
      }
  """

  Examples:
    | items                                                                                             | items_with_search                                                                                              | status_code     |                     response |
    | [{"rfkId":"rfkid_7","entity":"content"}]                                                          | [{"rfkId":"rfkid_7","entity":"content"}]                                                                     | 200             |     [{"rfkId":"rfkid_7","entity":"content"}]  |
    | [{"rfkId":"rfkid_7","entity":"content", "search":{"limit":11,"offset":1}}]                        | [{"rfkId":"rfkid_7","entity":"content","search":{"limit":11,"offset":1}}]                                    | 200             |     [{"rfkId":"rfkid_7","entity":"content","search":{"limit":11,"offset":1}}]  |
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"offset": 1,"limit": 5,"content": {"fields": ["name"]}}}]        | [{"rfkId":"rfkid_7","entity":"content","search": {"offset": 1,"limit": 5,"content": {"fields": ["name"]}}}]  | 200         | [{"rfkId":"rfkid_7","entity":"content","search": {"offset": 1,"limit": 5,"content": 5}}]|
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"offset": 1,"limit": 5,"content": {}}}]        | [{"rfkId":"rfkid_7","entity":"content","search": {"offset": 1,"limit": 5,"content": {}}}]                   | 200         |  [{"rfkId":"rfkid_7","entity":"content","search": {"offset": 1,"limit": 5,"content": 5}}]|
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"content": {}}}]        | [{"rfkId":"rfkid_7","entity":"content","search": {"content": {}}}]   | 200         |  [{"rfkId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 0,"content": 10}}]|
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"limit": 10, "content": {}}}]        | [{"rfkId":"rfkid_7","entity":"content","search": {"limit": 10,"content": {}}}]   | 200         | [{"rfkId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 0,"content": 10}}]|
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"offset": 5,"content": {"fields": ["name"]}}}]        | [{"rfkId":"rfkid_7","entity":"content","search": {"offset": 5,"content": {"fields": ["name"]}}}]       | 200         | [{"rfkId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 5,"content": 10}}]|
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "symposium"}}}]        | [{"rfkId":"rfkid_7","entity":"content","search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "symposium"}}}]   | 200         | [{"rfkId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 5,"content": 10, "query": {"keyphrase": "symposium"}}}]|
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "XB123!*&)-+"}}}]        | [{"rfkId":"rfkid_7","entity":"content","search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "XB123!*&)-+"}}}]   | 200         | [{"rfkId":"rfkid_7","entity":"content","search": {"limit": 10,"offset": 5,"content": 10, "query": {"keyphrase": "XB123!*&)-+"}}}]|
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "Sitecore Ireland", "operator": "or"}}}]        | [{"rfkId":"rfkid_7","entity":"content","search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "Sitecore Ireland", "operator": "or"}}}]   | 200         | [{"rfkId":"rfkid_7","entity":"content","search": {"limit":10, "offset": 5,"content": 10, "query": {"keyphrase": "Sitecore Ireland", "operator": "or"}}}] |
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "Sitecore Ireland", "operator": "and"}}}]        | [{"rfkId":"rfkid_7","entity":"content","search": {"offset": 5,"content": {"fields": ["name"]}, "query": {"keyphrase": "Sitecore Ireland", "operator": "and"}}}]   | 200         | [{"rfkId":"rfkid_7","entity":"content","search": {"limit":10, "offset": 5,"content": 10, "query": {"keyphrase": "Sitecore Ireland", "operator": "and"}}}]|
    
    

Scenario Outline: Developer requests widget data from browser without widget items
  Given the '/get-widget-data' page is loaded
  When the widget item parameters are:
  """
      { 
          "items": <items>
      }
  """
  And the 'getWidgetData' button is clicked
  Then an error is thrown: '<error_code>'
  Examples:
    | items   | error_code |
    | []      | [MV-0012] "widgetItems" array should not be empty        |
    | [{"rfkId":" ","entity":"content"}]         | [MV-0011] "rfkId" is required         |
    | [{"rfkId":"rfkid_7","entity":" "}]         | [MV-0010] "entity" is required         |
    | [{"rfkId":"rfkid_7","entity":"content","search":{"limit":101,"offset":0}}]         | [IV-0007] Incorrect value for "limit". Set the value to an integer between 1 and 100 inclusive.         |
    | [{"rfkId":"rfkid_7","entity":"content","search":{"limit":20,"offset":-1}}]         | [IV-0008] Incorrect value for "offset". Set the value to an integer greater than or equal to 0.         |
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"query": {"keyphrase": "aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaa"}}}]         | [IV-0009] Incorrect value for "​keyphrase"​​. Set the value to a string between 1 and 100 characters inclusive.         |
    | [{"rfkId":"rfkid_7","entity":"content", "search": {"query": {"keyphrase": ""}}}]         | [IV-0009] Incorrect value for "​keyphrase"​​. Set the value to a string between 1 and 100 characters inclusive.         |
    

Scenario Outline: Developer requests widget data with context object from browser with a valid payload
  Given the '/get-widget-data' page is loaded
  When the widget item parameters are:
  """
      { 
          "items": <items>
      }
  """
  And the context parameters are:
    """
      { 
          "context": <context>
      }
  """
  And the 'getWidgetData' button is clicked
  Then the widget data request is sent with parameters:
  """
      {
          "items": <items>,
          "context": <context>
      }
  """
  And Search REST API responds with status code '<status_code>'
  Examples:
    | items                                                                           | context                                          | status_code |
    | [{"rfkId":"rfkid_7","entity":"content","search":{"limit":20,"offset":1}}]       | {"locale":{"country":"us","language":"en"}}      | 200         |



        
