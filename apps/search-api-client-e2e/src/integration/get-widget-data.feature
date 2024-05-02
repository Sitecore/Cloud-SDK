Feature: Request widget data from Search REST API

Scenario: Developer requests widget data from browser with a valid payload 
    Given the '/get-widget-data' page is loaded
    When the widget item parameters are:
    """
        { 
            "items": [{"rfkId":"rfkid_7","entity":"content"}]
        }
    """
    And the 'getWidgetData' button is clicked
    Then the widget data request is sent with parameters:
    """
        {
            "items": [{"rfkId":"rfkid_7","entity":"content"}]
        }
    """
    And Search REST API responds with status code '200'

Scenario: Developer requests widget data from browser without widget items
    Given the '/get-widget-data' page is loaded
    When the widget item parameters are:
    """
        { 
            "items": []
        }
    """
    And the 'getWidgetData' button is clicked
    Then an error is thrown: '[MV-OO11] "widgetItems" array should not be empty'

Scenario: Developer creates a WidgetItem with invalid rfkId
    Given the '/get-widget-data' page is loaded
    When the widget item parameters are:
    """
        { 
            "items": [{"rfkId":" ","entity":"content"}]
        }
    """
    And the 'getWidgetData' button is clicked
    Then an error is thrown: '[MV-OO10] "rfkId" is required'

Scenario: Developer creates a WidgetItem with invalid entity
    Given the '/get-widget-data' page is loaded
    When the widget item parameters are:
    """
        { 
            "items": [{"rfkId":"rfkid_7","entity":" "}]
        }
    """
    And the 'getWidgetData' button is clicked
    Then an error is thrown: '[MV-OO09] "entity" is required'

Scenario: Developer requests widget data from Middleware with a valid payload
    Given the '/get-widget-data' page is loaded with 'testID' name and '<testID>' value query parameter
    Then the request with id '<testID>' will contain '<name>' with '<value>' value in the body
    Examples:
        | testID                                            | name   | value                                               |
        | getWidgetDataFromMiddlewareWithValidPayload       | widget | {"items":[{"entity":"content","rfk_id":"rfkid_7"}]} |


Scenario: Developer requests widget data from API with a valid payload
    Given the '/get-widget-data' page is loaded
    And the '<testID>' button is clicked
    Then the request with id '<testID>' will contain '<name>' with '<value>' value in the body
    Examples:
        | testID                               | name   | value                                               |
        | getWidgetDataFromAPIWithValidPayload | widget | {"items":[{"entity":"content","rfk_id":"rfkid_7"}]} |

        
