Feature: Init CloudSDK core with all possible settings

Scenario: Developer initializes CloudSDK core 
    Given the init core page is loaded
    When the 'initializeCore' button is clicked
    Then the core settings are injected to the window object
     """
     { 
         "scCloudSDK": { "core": {"settings": {"sitecoreEdgeContextId": "83d8199c-2837-4c29-a8ab-1bf234fea2d1", "sitecoreEdgeUrl": "https://edge-platform.sitecorecloud.io"}}}
     }
    """