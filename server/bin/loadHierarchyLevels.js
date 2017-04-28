var app = require('../server');
var lodash = require('lodash');
var async = require('async');

//var hierarchyTypesList = [];
var hierarchyLevelIds = [];
var hierarchyNodeIds = [];

// this loads the plmdev configuration in ~/server/datasources.json
var dataSource = app.dataSources.plmdev;

var hierarchyLevels = [
  {
    hierarchyLevelName: "CommercialRoot",
    hierarchyTypeFkId: "Commercial",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyLevelName: "Class",
    hierarchyTypeFkId: "Commercial",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyLevelName: "Department",
    hierarchyTypeFkId: "Commercial",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyLevelName: "Division",
    hierarchyTypeFkId: "Commercial",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyLevelName: "Group",
    hierarchyTypeFkId: "Commercial",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyLevelName: "Subclass",
    hierarchyTypeFkId: "Commercial",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyLevelName: "Tesco Product Catalogue",
    hierarchyTypeFkId: "Catergory",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyLevelName: "Segment",
    hierarchyTypeFkId: "Catergory",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyLevelName: "Family",
    hierarchyTypeFkId: "Catergory",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyLevelName: "GPCClass",
    hierarchyTypeFkId: "Catergory",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyLevelName: "Brick",
    hierarchyTypeFkId: "Catergory",
    createdAt: new Date(),
    lastModifiedAt: new Date()
  }
];

async.waterfall(
  [
      function(callback) {
        var PlmHierarchyLevels = app.models.PlmHierarchyLevels;
        PlmHierarchyLevels.destroyAll({}, function(err, info, count) {
          if (err) {
            //return console.log(err);
            callback(err, null);
          } else {
            callback(null);  
          }
          
        });
      },
      function(callback) {
        
        var PlmHierarchyTypes = app.models.PlmHierarchyTypes;
        PlmHierarchyTypes.find(
          { fields: {id: true, hierarchyType: true, isAttributeHierarchy: true} }, 
        function(err, hierarchyTypes) {
          if (err) {
            //return console.log(err);
            callback(err, null);
          } else {
            callback(null, hierarchyTypes);  
          }
          
        });
      },
      function(hierarchyTypesList, callback) {

        // this loads the PlmHierarchyLevels model from ~/common/models/PlmHierarchyLevels.json
        var PlmHierarchyLevels = app.models.PlmHierarchyLevels;

        var count = hierarchyLevels.length;

        hierarchyLevels.forEach(function(hierarchyLevel) {
          var pickedHierarchyType = lodash.filter(hierarchyTypesList, 
            { 'hierarchyType':  hierarchyLevel.hierarchyTypeFkId} );

          hierarchyLevel.hierarchyTypeFkId = pickedHierarchyType[0].id;

           // insert new records into the Account table
           PlmHierarchyLevels.create(hierarchyLevel, function(err, hierarchyLevelRecord) {
            if (err) return console.log(err);

            count--;

            if (count === 0) {
              dataSource.disconnect();
              
              var caption = " hierarchyLevels Loading : Done ";
              callback(null, caption);
            }
          });
        });
      },
      function(caption, callback) {
          callback(null, caption);
      }
  ],
  function (err, caption) {
      console.log(caption);
      process.exit();
  }
);