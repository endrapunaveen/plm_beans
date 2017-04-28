var async = require("async");
var sleep = require('sleep');
var _ = require('lodash')


var resArray = [
    {
      "id": 8526,
      "hierarchyName": "Tesco Product Catalogue",
      "parentHierarchyId": null
    },
    {
      "id": 8539,
      "hierarchyName": "Food/Beverage/Tobacco",
      "parentHierarchyId": 8526
    },
    {
      "id": 8595,
      "hierarchyName": "Beverages",
      "parentHierarchyId": 8539
    },
    {
      "id": 8847,
      "hierarchyName": "Alcoholic Beverages",
      "parentHierarchyId": 8595
    }
  ]

  var list =  _.map(resArray,"id");

  console.log(list);