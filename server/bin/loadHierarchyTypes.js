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

// this loads the plmdev configuration in ~/server/datasources.json
var dataSource = app.dataSources.plmdev;
 
// this loads the PlmHierarchyTypes model from ~/common/models/PlmHierarchyTypes.json
var PlmHierarchyTypes = app.models.PlmHierarchyTypes;
var count = hierarchyTypes.length;

hierarchyTypes.forEach(function(hierarchyType) {
   // insert new records into the PlmHierarchyTypes table
   PlmHierarchyTypes.create(hierarchyType, function(err, hierarchyTypeRecord) {
    if (err) return console.log(err);

    // console.log('Record created:', hierarchyTypeRecord);

    count--;

    if (count === 0) {
      console.log('HierarchyTypes Loading - Done');
      dataSource.disconnect();
      process.exit();
    }
  });
});
