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
 
// this loads the PlmNavHierarchyTypes model from ~/common/models/PlmNavHierarchyTypes.json
var PlmNavHierarchyTypes = app.models.PlmNavHierarchyTypes;
var count = hierarchyTypes.length;

hierarchyTypes.forEach(function(hierarchyType) {
   // insert new records into the PlmNavHierarchyTypes table
   PlmNavHierarchyTypes.create(hierarchyType, function(err, hierarchyTypeRecord) {
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
