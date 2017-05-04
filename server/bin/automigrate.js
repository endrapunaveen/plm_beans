var app = require('../server');

var PlmHierarchyLevelsModel = require('../../common/models/plm-nav-hierarchy-levels.json');
var PlmHierarchyTypesModel = require('../../common/models/plm-nav-hierarchy-types.json');
var PlmHierarchyNodesModel = require('../../common/models/plm-nav-hierarchy-nodes.json');
var PlmAttrValueSetValuesModel = require('../../common/models/plm-nav-attr-value-sets.json');
var PlmAttrValueSetsModel = require('../../common/models/plm-nav-attr-value-set-values.json');
var PlmAttrGroupsModel = require('../../common/models/plm-nav-attr-groups.json');
var PlmAttributesModel = require('../../common/models/plm-nav-attributes.json');

var PlmFlexibleEntitiesModel = require('../../common/models/plm-nav-flexible-entities.json');
var PlmFlexibleEntitiesColumnsModel = require('../../common/models/plm-nav-flexible-entities-columns.json');
var PlmFlexibleEntityValuesModel = require('../../common/models/plm-nav-flexible-entity-values.json');
var PlmHierarchyAgAssocModel = require('../../common/models/plm-nav-hierarchy-ag-assoc.json');

var plmProductEntityModel = require('../../common/models/plm-product-entity.json');
var plmProductAttributesModel = require('../../common/models/plm-product-attributes.json');

var listOfModels = [
	{"modelName": 'PlmHierarchyLevels', "model": PlmHierarchyLevelsModel},
	{"modelName": 'PlmHierarchyTypes', "model": PlmHierarchyTypesModel},
	{"modelName": 'PlmHierarchyNodes', "model": PlmHierarchyNodesModel},
	{"modelName": 'PlmAttrValueSetValues', "model": PlmAttrValueSetValuesModel},
	{"modelName": 'PlmAttrValueSets', "model": PlmAttrValueSetsModel},
	{"modelName": 'PlmAttrGroups', "model": PlmAttrGroupsModel},
	{"modelName": "PlmHierarchyAgAssoc", "model": PlmHierarchyAgAssocModel},
	{"modelName": 'PlmAttributes', "model": PlmAttributesModel},
	{"modelName": 'PlmFlexibleEntities', "model": PlmFlexibleEntitiesModel},
	{"modelName": 'PlmFlexibleEntitiesColumns', "model": PlmFlexibleEntitiesColumnsModel},
	{"modelName": 'PlmFlexibleEntityValues', "model": PlmFlexibleEntityValuesModel},
	{"modelName": 'plmProductEntity', "model": plmProductEntityModel},
	{"modelName": 'plmProductAttributes', "model": plmProductAttributesModel},
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
