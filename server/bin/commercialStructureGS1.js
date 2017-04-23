var app = require('../server');
var lodash = require('lodash');
var async = require('async');
var colors = require('colors/safe');

var mysql      = require('mysql');

var inputFileName = "CatalogueStructureGS1.xlsx";

if(typeof require !== 'undefined') XLSX = require('xlsx');

/* Call XLSX */
var workbook = XLSX.readFile(inputFileName);

var sheet_name_list = workbook.SheetNames;
var attributeGroups = [];
var valueSets = [];

var hierarchyNode1Lists = [];
var parentHierarchyMap = {};
var hierarchyLevelsMap = {};
var groupedCategoriesList = [];
var previousCategoryLevel = '';

// this loads the plmdev configuration in ~/server/datasources.json
var dataSource = app.dataSources.plmdev;

var CategoryLevelList = [];

var createGroupedArray = function(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
}

var totalCategoryLevelsCount = 0;

sheet_name_list.forEach(function(y) {
  if (y == "Sheet2") {
    var worksheet = workbook.Sheets[y];
    var categories = XLSX.utils.sheet_to_json(worksheet, {raw: true});

    groupedCategoriesList = lodash.groupBy(categories, "CategoryLevel");
    totalCategoryLevelsCount = groupedCategoriesList.length;

    Object.keys(groupedCategoriesList).forEach(function(key) {
      CategoryLevelList.push(key);
    });
    previousCategoryLevel = CategoryLevelList[0];
    async.eachSeries(CategoryLevelList, processCategoryNodes, function() {
      process.exit()
    });
  }
}, function(err){
    console.log("User For Loop Completed");
    process.exit();
});

function processCategoryNodes(key, next) {
  
  var groupedCategories = groupedCategoriesList[key];
  async.waterfall(
  [
      function(callback) {
        var PlmNavHierarchyLevels = app.models.PlmNavHierarchyLevels;

        PlmNavHierarchyLevels.find(
          { fields: {id: true, hierarchyLevelName: true, hierarchyTypeFkId: true} }, 
        function(err, hierarchyLevels) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, hierarchyLevels);
          }
        });
      },
      function(hierarchyLevelsList, callback) {
        
        var CategoryLevel = key;
        
        var parentHierarchyLevel = lodash.filter(hierarchyLevelsList, 
              { 'hierarchyLevelName':  previousCategoryLevel } );
        
        var PlmNavHierarchyNodes = app.models.PlmNavHierarchyNodes;
        PlmNavHierarchyNodes.find(
          {  where: {hierarchyLevelFkId: parentHierarchyLevel[0].id}, 
            fields: {id: true, hierarchyName: true, } 
          }, 
        function(err, parentHierarchies) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, hierarchyLevelsList, parentHierarchies, groupedCategories);  
          }
        });
      },
      function(hierarchyLevelsList, parentHierarchiesList, categories, callback) {
        
        var connectionSettings = dataSource.settings;
        connectionSettings.connectTimeout = 60000 * 3;
        var conn = mysql.createConnection(dataSource.settings);

        var sql = "INSERT into PlmNavHierarchyNodes (hierarchyName, uniqueKey, parentHierarchyId, hierarchyTypeFkId, hierarchyLevelFkId, createdAt, lastModifiedAt) VALUES ?";
        var values = [];

        var PlmNavHierarchyNodes = app.models.PlmNavHierarchyNodes;
        var totalCount = categories.length;

        var hierarchyNodesBatches = createGroupedArray(categories, 100);
        var totalBatches = hierarchyNodesBatches.length;

        console.log("totalBatches : "+totalBatches);

        for (i=0; i<totalBatches; i++) { 
          hierarchyNodesBatch = hierarchyNodesBatches[i]; 
          hierarchyNodesBatch.forEach(function(hierarchyNode) {
            
            if (!hierarchyLevelsMap.hasOwnProperty(hierarchyNode.CategoryLevel)) {
              var pickedHierarchyLevel = lodash.filter(hierarchyLevelsList, 
                { 'hierarchyLevelName':  hierarchyNode.CategoryLevel } );
              
              hierarchyLevelsMap[hierarchyNode.CategoryLevel] = {
                hierarchyTypeFkId: pickedHierarchyLevel[0].hierarchyTypeFkId,
                hierarchyLevelFkId: pickedHierarchyLevel[0].id
              };
            }

            hierarchyNode1 = { hierarchyName: hierarchyNode.CategoryName,
                              uniqueKey: "",
                              parentHierarchyId: null, // hierarchyNode.ParentNode,
                              hierarchyTypeFkId: hierarchyLevelsMap[hierarchyNode.CategoryLevel].hierarchyTypeFkId,
                              hierarchyLevelFkId: hierarchyLevelsMap[hierarchyNode.CategoryLevel].hierarchyLevelFkId,
                              createdAt: new Date(),
                              lastModifiedAt: new Date()
                            };
            if (hierarchyNode.ParentNode != undefined && hierarchyNode.ParentNode.length > 0) {
              if (!parentHierarchyMap.hasOwnProperty(hierarchyNode.ParentNode )) {
                var pickedParentHierarchy = lodash.filter(parentHierarchiesList, 
                { 'hierarchyName':  hierarchyNode.ParentNode } );
                
                parentHierarchyMap[hierarchyNode.ParentNode] = pickedParentHierarchy[0].id;
              }

              hierarchyNode1.parentHierarchyId = parentHierarchyMap[hierarchyNode.ParentNode];
            }

            values.push(
              [ hierarchyNode1.hierarchyName, hierarchyNode1.uniqueKey, 
                hierarchyNode1.parentHierarchyId , hierarchyNode1.hierarchyTypeFkId , 
                hierarchyNode1.hierarchyLevelFkId, hierarchyNode1.createdAt,
                hierarchyNode1.lastModifiedAt
              ]);

            hierarchyNode1Lists.push(hierarchyNode1);
                  
          });
          
          conn.query(sql, [values], function(err) {
              if (err) {
                console.log(err);
                throw err;
              }
              //conn.end();

              totalBatches--;
              console.log('pending batches : '+totalBatches);
              if (totalBatches === 0) {
                
                conn.end();
                var caption = " HierarchyNodes Loading : Done ";
                callback(null, caption);
              }
          });
          
          hierarchyNode1Lists = [];
          values = [];
        }
      },
      function(caption, callback) {
        callback(null, caption);
      }
  ],
    function (err, caption) {
      if (!err) {
        console.log(colors.green(caption)); 
      } else {
        console.log(colors.red(caption)); 
      }
      previousCategoryLevel = key;
      next(null);
      //process.exit();
    }
  );
}

