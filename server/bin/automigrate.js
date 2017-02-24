var app = require('../server');

var PlmNavHierarchyLevelsModel = require('../../common/models/plm-nav-hierarchy-levels.json');
var PlmNavHierarchyTypesModel = require('../../common/models/plm-nav-hierarchy-types.json');
var PlmNavHierarchyNodesModel = require('../../common/models/plm-nav-hierarchy-nodes.json');
var PlmNavAttrValueSetValuesModel = require('../../common/models/plm-nav-attr-value-sets.json');
var PlmNavAttrValueSetsModel = require('../../common/models/plm-nav-attr-value-set-values.json');
var PlmNavAttrGroupsModel = require('../../common/models/plm-nav-attr-groups.json');
var PlmNavAttributesModel = require('../../common/models/plm-nav-attributes.json');

var PlmNavFlexibleEntitiesModel = require('../../common/models/plm-nav-flexible-entities.json');
var PlmNavFlexibleEntitiesColumnsModel = require('../../common/models/plm-nav-flexible-entities-columns.json');
var PlmNavFlexibleEntityValuesModel = require('../../common/models/plm-nav-flexible-entity-values.json');

var listOfModels = [
	{"modelName": 'PlmNavHierarchyLevels', "model": PlmNavHierarchyLevelsModel},
	{"modelName": 'PlmNavHierarchyTypes', "model": PlmNavHierarchyTypesModel},
	{"modelName": 'PlmNavHierarchyNodes', "model": PlmNavHierarchyNodesModel},
	{"modelName": 'PlmNavAttrValueSetValues', "model": PlmNavAttrValueSetValuesModel},
	{"modelName": 'PlmNavAttrValueSets', "model": PlmNavAttrValueSetsModel},
	{"modelName": 'PlmNavAttrGroups', "model": PlmNavAttrGroupsModel},
	{"modelName": 'PlmNavAttributes', "model": PlmNavAttributesModel},
	{"modelName": 'PlmNavFlexibleEntities', "model": PlmNavFlexibleEntitiesModel},
	{"modelName": 'PlmNavFlexibleEntitiesColumns', "model": PlmNavFlexibleEntitiesColumnsModel},
	{"modelName": 'PlmNavFlexibleEntityValues', "model": PlmNavFlexibleEntityValuesModel},
];

var totalModels = listOfModels.length;
var completedModels = 0;

// this loads the accountDb configuration in ~/server/datasources.json
var dataSource = app.dataSources.plmdev;

var createTableFromModel = function(model, modelName, callback) {
	dataSource.createModel(model.name, 
		model.properties, 
		model.options
	);

	dataSource.autoupdate(model.name, function (err, result) {
	  dataSource.discoverModelProperties(modelName, function (err, props) {
	    callback(err, props);
	    completedModels += 1;

	    console.log('completedModels : '+completedModels);
	    if (completedModels == totalModels) {
	    	process.exit();
	    }
	  });
	});
};

// loop through the models to created
for (var idx=0; idx < totalModels; idx++) {
	console.log(listOfModels[idx].modelName);
	createTableFromModel(listOfModels[idx].model, listOfModels[idx].modelName, function (err, props) {
		console.log(err);
		console.log(props);
	});
}
