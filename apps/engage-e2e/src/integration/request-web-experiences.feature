@personalize
Feature: Request web experiences from personalize API

# Scenario: Init is called with webFlowTarget with parameter
#     Given the '/webexperiences' page is loaded with query parameters
#         | webPersonalizationSettings |
#         | true                       |
#     Then an error is thrown: '[MV-0003] "pointOfSale" is required.'

Scenario Outline: User passed various values for webPersonalization settings
    Given the '/webexperiences' page is loaded with query parameters
        | webPersonalizationSettings   | pointOfSaleFromSettings |
        | <WebPersonalizationSettings> | spinair.com             |
    Then the window.Engage object should include the following settings
       | webPersonalizationSettings   | pointOfSaleFromSettings | async   |  defer  | webFlowTarget   |
       | <WebPersonalizationSettings> | spinair.com             | <Async> | <Defer> | <WebFlowTarget> |

     Examples:
        | WebPersonalizationSettings                              | Async | Defer | WebFlowTarget          |
        | true                                                    | true  | false |                        |
        | {"asyncScriptLoading":false,"deferScriptLoading":true}  | false | true  |                        |
        | {"asyncScriptLoading":true,"deferScriptLoading":false}  | true  | false |                        |  
        | {"asyncScriptLoading":true,"deferScriptLoading":true}   | true  | true  |                        | 
        | {"asyncScriptLoading":false,"deferScriptLoading":false} | false | false |                        | 
        | {"asyncScriptLoading":false}                            | false | false |                        |
        | {"asyncScriptLoading":true}                             | true  | false |                        |
        | {"deferScriptLoading":true}                             | true  | true  |                        |
        | {"deferScriptLoading":false}                            | true  | false |                        |
        | {"baseURLOverride":"customSetWebFlowTarget"}            | true  | false | customSetWebFlowTarget |
        | false                                                   |       |       |                        |
        |                                                         |       |       |                        |
        
Scenario Outline: Init is called with a baseURLOverride value passed in webPersonalization settings
    Given the '/webexperiences' page is loaded with query parameters
        | webPersonalizationSettings   | pointOfSaleFromSettings |
        | <WebPersonalizationSettings> | spinair.com             |
    Then the script tags src attributes include the following strings
        |  webFlowTarget  |
        | <webFlowTarget> |

    Examples:
        | WebPersonalizationSettings                   | webFlowTarget          |
        | {"baseURLOverride":"customSetWebFlowTarget"} | customSetWebFlowTarget |
        | {"baseURLOverride": "undefined"}             | default                |

@Smoke-Test
Scenario: webExperiences SDK is integrated with Engage and popup is triggered
    Given the '/webexperiences' page is loaded with query parameters
        | webPersonalizationSettings | pointOfSaleFromSettings |
        | true                       | spinair.com             |
    Then webExperiences 'is' loaded to DOM
    And popup content 'is' triggered
 
Scenario: webExperiences is integrated with Engage but is disabled
    Given the '/webexperiences' page is loaded with query parameters
        | webPersonalizationSettings | pointOfSaleFromSettings |
        | false                      | spinair.com             |
    Then webExperiences 'is not' loaded to DOM
    And popup content 'is not' triggered

Scenario: asyncScriptLoading setting is passed
    Given the '/webexperiences' page is loaded with query parameters
        | webPersonalizationSettings   | pointOfSaleFromSettings |
        | {"asyncScriptLoading":false} | spinair.com             |
    When webExperiences 'is' loaded to DOM
    Then the script tags have their async attributes set to the asyncScriptLoading setting value

Scenario: async setting on script is not set to asyncScriptLoading and defaults to 'true'
    Given the '/webexperiences' page is loaded with query parameters
        | webPersonalizationSettings | pointOfSaleFromSettings |
        | true                       | spinair.com             |
    When webExperiences 'is' loaded to DOM
    Then the script tags have their async attributes set to the default value of true

Scenario Outline: Web template appears when route matches
    Given the '<templatePage>' page is loaded with query parameters
        | webPersonalizationSettings | pointOfSaleFromSettings |
        | true                       | spinair.com             |
    Then webExperiences 'is' loaded to DOM
    And '<templateTitle>' template appeared

    Examples:
        | templatePage                    | templateTitle              |
        | /templates/alert-bar            | sitecoreAlertBar           |         
        | /templates/corner-popup         | sitecoreCornerPopup        |                   
        | /templates/email-capture-bar    | sitecoreEmailCaptureBar    |
        | /templates/email-capture-corner | sitecoreEmailCaptureCorner |
        | /templates/notification-widget  | sitecoreNotificationWidget |
        | /templates/popup-takeover       | sitecorePopUpTakeover      |
        | /templates/sidebar              | sitecoreSidebar            |

