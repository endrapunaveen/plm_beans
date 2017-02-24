var app = require('../server');
var lodash = require('lodash');

var hierarchyTypes = [
  {
    hierarchyType: "Commercial",
    isAttributeHierarchy: false,
    createdAt: new Date(),
    lastModifiedAt: new Date()
  },
  {
    hierarchyType: "Catergory",
    isAttributeHierarchy: true,
    createdAt: new Date(),
    lastModifiedAt: new Date()
  }
];

var hierarchyTypeIds = [];
var hierarchyLevelIds = [];
var hierarchyNodeIds = [];

// this loads the plmdev configuration in ~/server/datasources.json
var dataSource = app.dataSources.plmdev;
 
// this automigrates the PlmNavHierarchyTypes model 
dataSource.automigrate('PlmNavHierarchyTypes', function(err) {
  if (err) throw err;
 
  // this loads the PlmNavHierarchyTypes model from ~/common/models/PlmNavHierarchyTypes.json
  var PlmNavHierarchyTypes = app.models.PlmNavHierarchyTypes;
  var count = hierarchyTypes.length;
  hierarchyTypes.forEach(function(hierarchyType) {
     // insert new records into the PlmNavHierarchyTypes table
     PlmNavHierarchyTypes.create(hierarchyType, function(err, hierarchyTypeRecord) {
      if (err) return console.log(err);
 
      console.log('Record created:', hierarchyTypeRecord);

      hierarchyTypeIds.push({
          hierarchyType: hierarchyTypeRecord.hierarchyType,
          id: hierarchyTypeRecord.id
        }
      );
 
      count--;
 
      if (count === 0) {
        console.log('done');

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

        // this automigrates the PlmNavHierarchyLevels model 
        dataSource.automigrate('PlmNavHierarchyLevels', function(err) {
          if (err) throw err;
         
          // this loads the PlmNavHierarchyLevels model from ~/common/models/PlmNavHierarchyLevels.json
          var PlmNavHierarchyLevels = app.models.PlmNavHierarchyLevels;
          var count = hierarchyLevels.length;
          hierarchyLevels.forEach(function(hierarchyLevel) {
            var pickedHierarchyType = lodash.filter(hierarchyTypeIds, 
              { 'hierarchyType':  hierarchyLevel.hierarchyTypeFkId} );

            console.log('>>>>>>>>>> ');
            console.log(pickedHierarchyType);
            console.log('===========');

            hierarchyLevel.hierarchyTypeFkId = pickedHierarchyType[0].id;

             // insert new records into the Account table
             PlmNavHierarchyLevels.create(hierarchyLevel, function(err, hierarchyLevelRecord) {
              if (err) return console.log(err);
         
              console.log('Record created:', hierarchyLevelRecord);

              hierarchyLevelIds.push({
                hierarchyLevelName: hierarchyLevelRecord.hierarchyLevelName,
                hierarchyTypeFkId : hierarchyLevelRecord.hierarchyTypeFkId,
                id: hierarchyLevelRecord.id
              });
         
              count--;
         
              if (count === 0) {
                console.log('-------- done --------');
                // dataSource.disconnect();
                
                /*
                var hierarchyNodes = [
                  {
                    hierarchyName: "Tesco Product Catalogue",
                    parentHierarchyId: null,
                    hierarchyTypeFkId: "Catergory",
                    hierarchyLevelFkId: "Tesco Product Catalogue",
                    createdAt: new Date(),
                    lastModifiedAt: new Date()
                  },
                  {
                    hierarchyName: "Clothing",
                    parentHierarchyId: "Tesco Product Catalogue",
                    hierarchyTypeFkId: "Category",
                    hierarchyLevelFkId: "Tesco Product Catalogue",
                    createdAt: new Date(),
                    lastModifiedAt: new Date()
                  }
                ];
                */

                // this automigrates the PlmNavHierarchyNodes model 
                dataSource.automigrate('PlmNavHierarchyNodes', function(err) {
                  if (err) throw err;
                 
                  // this loads the PlmNavHierarchyNodes model from ~/common/models/PlmNavHierarchyNodes.json
                  var PlmNavHierarchyNodes = app.models.PlmNavHierarchyNodes;
                  var count = hierarchyNodes.length;

                  hierarchyNodes.forEach(function(hierarchyNode) {


                    var pickedHierarchyLevel = lodash.filter(hierarchyLevelIds, 
                      { 'hierarchyLevelName':  hierarchyNode.hierarchyLevelFkId } );

                    console.log('============ ?????? ) ');
                    console.log(pickedHierarchyLevel);
                    console.log('===========');

                    hierarchyNode.hierarchyTypeFkId = pickedHierarchyLevel[0].hierarchyTypeFkId;
                    hierarchyNode.hierarchyLevelFkId = pickedHierarchyLevel[0].id;

                    if (hierarchyNode !== null) {
                      var parentHierarchy = lodash.filter(hierarchyNodeIds, 
                        { 'hierarchyName':  hierarchyNode.parentHierarchyId } );

                        hierarchyNode.parentHierarchyId = hierarchyNodeIds[0].id;
                    }

                    // insert new records into the Account table
                    PlmNavHierarchyNodes.create(hierarchyNode, function(err, record) {
                      if (err) return console.log(err);
                 
                      console.log('Record created:', record);
                  
                      hierarchyNodeIds.push({hierarchyName: record.record, id: record.id});

                      count--;
                 
                      if (count === 0) {
                        console.log('-------- done --------');
                        dataSource.disconnect();
                      }
                    });
                  });
                });
              }
            });
          });
        });
      }
    });
  });
});






/*
// this automigrates the PlmNavHierarchyLevels model 
dataSource.automigrate('PlmNavHierarchyLevels', function(err) {
  if (err) throw err;
 
  // this loads the PlmNavHierarchyLevels model from ~/common/models/PlmNavHierarchyLevels.json
  var PlmNavHierarchyLevels = app.models.PlmNavHierarchyLevels;
  var count = hierarchyLevels.length;
  hierarchyLevels.forEach(function(hierarchyLevel) {
     // insert new records into the Account table
     PlmNavHierarchyLevels.create(hierarchyLevel, function(err, record) {
      if (err) return console.log(err);
 
      console.log('Record created:', record);
 
      count--;
 
      if (count === 0) {
        console.log('-------- done --------');
       // dataSource.disconnect();
      }
    });
  });
});
*/

/*
// this automigrates the PlmNavHierarchyNodes model 
dataSource.automigrate('PlmNavHierarchyNodes', function(err) {
  if (err) throw err;
 
  // this loads the PlmNavHierarchyNodes model from ~/common/models/PlmNavHierarchyNodes.json
  var PlmNavHierarchyNodes = app.models.PlmNavHierarchyNodes;
  var count = hierarchyNodes.length;
  hierarchyNodes.forEach(function(hierarchyNode) {
     // insert new records into the Account table
     PlmNavHierarchyNodes.create(hierarchyNode, function(err, record) {
      if (err) return console.log(err);
 
      console.log('Record created:', record);
 
      count--;
 
      if (count === 0) {
        console.log('-------- done --------');
        dataSource.disconnect();
      }
    });
  });
});
*/