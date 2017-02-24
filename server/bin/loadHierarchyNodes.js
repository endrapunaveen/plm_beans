var app = require('../server');
var lodash = require('lodash');
var async = require('async');

var mysql      = require('mysql');

const args = process.argv;
//console.log(args);

var hierarchyTypes = process.argv[2];
//console.log(hierarchyTypes);

var hierarchyFile = "";
var parentHierarchyLevel = "";

if (hierarchyTypes == "root") {
  hierarchyFile = require("./out_root.json");
} else if (hierarchyTypes == "division") {
  hierarchyFile = require("./out_division.json");
  parentHierarchyLevel = "Commercialroot";
} else if (hierarchyTypes == "group") {
  hierarchyFile = require("./out_group.json");
  parentHierarchyLevel = "Division";
} else if (hierarchyTypes == "department") {
  hierarchyFile = require("./out_department.json");
  parentHierarchyLevel = "Group";
} else if (hierarchyTypes == "class") {
  hierarchyFile = require("./out_class.json");
  parentHierarchyLevel = "Department";
} else if (hierarchyTypes == "subclass") {
  hierarchyFile = require("./out_subclass.json");
  parentHierarchyLevel = "Class";
}

var hierarchyNode1Lists = [];
var parentHierarchyMap = {};
var hierarchyLevelsMap = {};

var hierarchyNodes = hierarchyFile.Hierarchy;

// this loads the plmdev configuration in ~/server/datasources.json
var dataSource = app.dataSources.plmdev;

//console.log(dataSource.settings);

var createGroupedArray = function(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
}

async.waterfall(
  [
      /*
      function(callback) {
        var PlmNavHierarchyNodes = app.models.PlmNavHierarchyNodes;
        PlmNavHierarchyNodes.destroyAll({}, function(err, info, count) {
          if (err) {
            callback(err, null);
          } else {
            console.log('1');
            callback(null);  
          }
          
        });
      },
      */
      function(callback) {
        //console.log('2');

        var PlmNavHierarchyLevels = app.models.PlmNavHierarchyLevels;

        PlmNavHierarchyLevels.find(
          { fields: {id: true, hierarchyLevelName: true, hierarchyTypeFkId: true} }, 
        function(err, hierarchyLevels) {
          if (err) {
            callback(err, null);
          } else {

            var parentHierarchyLevel = lodash.filter(hierarchyLevels, 
                { 'hierarchyLevelName':  parentHierarchyLevel } );
            
            var PlmNavHierarchyNodes = app.models.PlmNavHierarchyNodes;
            PlmNavHierarchyNodes.find(
              {  where: {hierarchyLevelFkId: parentHierarchyLevel.id}, 
                fields: {id: true, uniqueKey: true} 
              }, 
            function(err, parentHierarchies) {
              if (err) {
                callback(err, null);
              } else {
                //console.log(parentHierarchies);
                callback(null, hierarchyLevels, parentHierarchies);  
              }
              
            }); 
          }
          
        });
      },
      function(hierarchyLevelsList, parentHierarchiesList, callback) {
        //console.log('creating mysql connection');
        var connectionSettings = dataSource.settings;
        connectionSettings.connectTimeout = 60000 * 3;
        var conn = mysql.createConnection(dataSource.settings);

        var sql = "INSERT into PlmNavHierarchyNodes (hierarchyName, uniqueKey, parentHierarchyId, hierarchyTypeFkId, hierarchyLevelFkId, createdAt, lastModifiedAt) VALUES ?";
        var values = [];

        //////////

        var PlmNavHierarchyNodes = app.models.PlmNavHierarchyNodes;
        var totalCount = hierarchyNodes.length;

        var hierarchyNodesBatches = createGroupedArray(hierarchyNodes, 100);
        var totalBatches = hierarchyNodesBatches.length;
        
        //hierarchyNodesBatches.foreach(function(hierarchyNodesBatch){
        for (i=0; i<totalBatches; i++) { 
          hierarchyNodesBatch = hierarchyNodesBatches[i]; 
          hierarchyNodesBatch.forEach(function(hierarchyNode) {

            if (!hierarchyLevelsMap.hasOwnProperty(hierarchyNode.hierarchyLevel)) {
              //console.log('not in map... get it from list..')
              var pickedHierarchyLevel = lodash.filter(hierarchyLevelsList, 
                { 'hierarchyLevelName':  hierarchyNode.hierarchyLevel } );
              //console.log(pickedHierarchyLevel);
              hierarchyLevelsMap[hierarchyNode.hierarchyLevel] = {
                hierarchyTypeFkId: pickedHierarchyLevel[0].hierarchyTypeFkId,
                hierarchyLevelFkId: pickedHierarchyLevel[0].id
              };
              //console.log(hierarchyLevelsMap);
            }

            hierarchyNode1 = { hierarchyName: hierarchyNode.categoryName,
                              uniqueKey: hierarchyNode.uniqueKey,
                              parentHierarchyId: null, // hierarchyNode.parentId,
                              hierarchyTypeFkId: hierarchyLevelsMap[hierarchyNode.hierarchyLevel].hierarchyTypeFkId,
                              hierarchyLevelFkId: hierarchyLevelsMap[hierarchyNode.hierarchyLevel].hierarchyLevelFkId,
                              createdAt: new Date(),
                              lastModifiedAt: new Date()
                            };

            //console.log(hierarchyNode1);

            if (hierarchyNode.parentId.length > 0) {
              if (!parentHierarchyMap.hasOwnProperty(hierarchyNode.parentId )) {
                var pickedParentHierarchy = lodash.filter(parentHierarchiesList, 
                { 'uniqueKey':  hierarchyNode.parentId } );
                
                parentHierarchyMap[pickedParentHierarchy.uniqueKey] = pickedParentHierarchy[0].id;
              }

              hierarchyNode1.parentHierarchyId = parentHierarchyMap[hierarchyNode.parentId];
            }

            values.push(
              [ hierarchyNode1.hierarchyName, hierarchyNode1.uniqueKey, 
                hierarchyNode1.parentHierarchyId , hierarchyNode1.hierarchyTypeFkId , 
                hierarchyNode1.hierarchyLevelFkId, hierarchyNode1.createdAt,
                hierarchyNode1.lastModifiedAt
              ]);

            hierarchyNode1Lists.push(hierarchyNode1);
                  
          });

          //console.log(values)
          conn.query(sql, [values], function(err) {
              if (err) throw err;
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
        //})
           
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
