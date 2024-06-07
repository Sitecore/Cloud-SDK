Feature: Request search widget data from Search REST API

Scenario: Developer requests search widget data from Middleware with a valid payload
    Given the '/get-search-widget-data' page is loaded with 'testID' name and 'getSearchWidgetDataFromMiddlewareWithValidPayload' value query parameter
    Then the request with id 'getSearchWidgetDataFromMiddlewareWithValidPayload' will contain:
    """
        "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","search":{"facet":{"all":true,"max":50}}}]}
    """

Scenario: Developer search requests widget data from API with a valid payload
    Given the '/get-search-widget-data' page is loaded
    And the 'getSearchWidgetDataFromAPIWithValidPayload' button is clicked
    Then the request with id 'getSearchWidgetDataFromAPIWithValidPayload' will contain:
    """
        "widget":{"items":[{"entity":"content","rfk_id":"rfkid_7","search":{"facet":{"all":true,"max":50}}}]}
    """
    
Scenario Outline: Developer requests search widget data from browser with a valid payload
  Given the '/get-search-widget-data' page is loaded
  When the widget item parameters are:
  """
      { 
          "items": <items>
      }
  """
  And the 'getSearchWidgetData' button is clicked
  Then the widget data request is sent with parameters:
  """
      {
          "items": <items_payload>
      }
  """
  And Search REST API responds with status code '<status_code>'


  Examples:
    | items                                                                             | items_payload                                                                     | status_code | 
    | [{"rfkId":"rfkid_7","entity":"content"}]                                          | [{"rfkId":"rfkid_7","entity":"content"}]                                          | 200         |  
    | [{"rfkId":"rfkid_7","entity":"content","facet":{}}]                               | [{"rfkId":"rfkid_7","entity":"content"}]                                          | 200         |  
    | [{"rfkId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"max":50}}}] | [{"rfkId":"rfkid_7","entity":"content","search":{"facet":{"all":true,"max":50}}}] | 200         |  
    | [{"rfkId":"rfkid_7","entity":"content","search":{"facet":{"all":false}}}]         | [{"rfkId":"rfkid_7","entity":"content","search":{"facet":{"all":false}}}]         | 200         |  
    | [{"rfkId":"rfkid_7","entity":"content","search":{"facet":{"max":50}}}]            | [{"rfkId":"rfkid_7","entity":"content","search":{"facet":{"max":50}}}]            | 200         |  

Scenario Outline: Developer requests search widget data from browser with invalid max attribute
  Given the '/get-search-widget-data' page is loaded
  When the widget item parameters are:
  """
      { 
          "items": <items>
      }
  """
  And the 'getSearchWidgetData' button is clicked
  Then an error is thrown: '<error_code>'
  
  Examples:
    | items                                                                   | error_code                                                                                    | 
    | [{"rfkId":"rfkid_7","entity":"content","search":{"facet":{"max":150}}}] | [IV-0014] Incorrect value for "max"​​. Set the value to an integer between 1 and 100 inclusive. | 
    | [{"rfkId":"rfkid_7","entity":"content","search":{"facet":{"max":0}}}]   | [IV-0014] Incorrect value for "max"​​. Set the value to an integer between 1 and 100 inclusive. | 
    