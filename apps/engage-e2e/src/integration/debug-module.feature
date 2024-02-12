Feature: Developer accesses debug logs when initCore is called

Scenario: Developer loads next app and core lib is initialized so logs are printed in console 
    Given the '/' page is loaded 
    Then debug log is printed out in the console with message including 'sitecore-cloudsdk:core'

#When logs for events & personalize are added, we should assert that on pages where only each of them are initialised, we do not get logs for the other
Scenario: Developer loads next app and core lib is initialized so logs are printed in console 
    Given the '/' page is loaded 
    Then debug log is not printed out in the console with message including 'sitecore-cloudsdk:events'