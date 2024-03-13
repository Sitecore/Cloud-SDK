Feature: Developer accesses debug logs when initCore is called

Scenario: Developer loads next app and core lib is initialized so logs are printed in console 
    Given the '/' page is loaded 
    Then debug log is printed out in the console with message including 'sitecore-cloudsdk:core'
