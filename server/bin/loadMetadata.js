var app = require('../server');
var lodash = require('lodash');
var async = require('async');
var colors = require('colors/safe');

var mysql      = require('mysql');

var inputFileName = "MVP_Beans_Metadata.xlsx";

if(typeof require !== 'undefined') XLSX = require('xlsx');

/* Call XLSX */
var workbook = XLSX.readFile(inputFileName);

var sheet_name_list = workbook.SheetNames;
var attributeGroups = [];
var valueSets = [];
var count=0;

var dataSource = app.dataSources.plmdev;

createAGAndHierarchyAssoc = function(attributeGroup, callback) {
	var PlmAttrGroups = app.models.PlmAttrGroups;
	var PlmHierarchyNodes = app.models.PlmHierarchyNodes;	
	var PlmHierarchyAgAssoc = app.models.PlmHierarchyAgAssoc;
	
PlmAttrGroups.create(attributeGroup, function(err, attributeGroupRecord) {
    if (err) return console.log(err);

    attributeGroups.push({"attrGroupIntName": attributeGroupRecord.attrGroupIntName,
    	"id": attributeGroupRecord.id
	});

    PlmHierarchyNodes.find(
      { where: { hierarchyName: attributeGroup.categoryName }, 
      	fields: {id: true, hierarchyName: true} 
      }, 
    function(err, hierarchyNode) {
      if (err) {
        callback(err, null);
      } else {
      	var agHierarchyAssoc = {
		  attrGroupId: attributeGroupRecord.id,
		  hierarchyNodeId: hierarchyNode[0].id,
		  createdAt: new Date(),
		  lastModifiedAt: new Date()
		}
        PlmHierarchyAgAssoc.create(agHierarchyAssoc, function(err, agHierarchyAssocRecord){
        	if (err) return console.log(err);

        	count--;

            if (count === 0) {
              //dataSource.disconnect();
              
              var caption = "	√√ attributeGroups Loading : Done ";
              console.log(colors.green(caption));

              callback(null, attributeGroups);
              //process.exit();
            }
        });
      }
    });

    /*
    count--;

    if (count === 0) {
      //dataSource.disconnect();
      
      var caption = "	√√ attributeGroups Loading : Done ";
      console.log(colors.green(caption));

      callback(null, attributeGroups);
      //process.exit();
    }
    */
});
}

async.waterfall(
[
    function(callback) {
	  	// Load Attribute Groups
		sheet_name_list.forEach(function(y) {
			if (y == "Attribute Groups") {
				
			  	var worksheet = workbook.Sheets[y];
			    var ags =   XLSX.utils.sheet_to_json(worksheet, {raw: true});

			    var attrGroupBehaviour = '';
			    var PlmAttrGroups = app.models.PlmAttrGroups;
		        count = ags.length;

		        var PlmHierarchyNodes = app.models.PlmHierarchyNodes;
		        var PlmHierarchyAgAssoc = app.models.PlmHierarchyAgAssoc;

			    for (var idx=0; idx < count; idx++) {
			    	attrGroupBehaviour = ags[idx]["Multi-Row?"]=="Yes" ? "Multi Row" : "Single Row";

					var attributeGroup = {
					  "categoryName": ags[idx]["Category Name"] ,
					  "attrGroupDispName": ags[idx]["Display Name"],
					  "attrGroupIntName": ags[idx]["Internal Name"],
					  "attrGroupBehaviour": attrGroupBehaviour,
					  createdAt: new Date(),
					  lastModifiedAt: new Date()
					}

					createAGAndHierarchyAssoc(attributeGroup, function(err, result) {
						if (err) {
				            callback(err, null);
				        } else {
				        	callback(null, result);
				        }
					});
			    }	           	
			}
		});
    },
    function(attributeGroupsList, callback) {
    	// Load Value Set Names
	  	sheet_name_list.forEach(function(y) {
			if (y == "LOVs") {
				console.log("Loading "+y);
			  	var worksheet = workbook.Sheets[y];
			    var valueSetValues =   XLSX.utils.sheet_to_json(worksheet, {raw: true});
			    var vaueSetNames = lodash.uniq(lodash.map(valueSetValues, 'LOV Name'));

			    var count = vaueSetNames.length;

				var PlmAttrValueSets = app.models.PlmAttrValueSets;

				for (var vsIdx=0; vsIdx < count; vsIdx++) {
					var valueSet = {
					  "valueSetName": vaueSetNames[vsIdx],
					  "createdAt": new Date(),
					  "lastModifiedAt": new Date(),
					};

					PlmAttrValueSets.create(valueSet, function(err, valueSetRecord) {
			            if (err) return console.log(err);

			            count--;
			           
			            valueSets.push({"valueSetName": valueSetRecord.valueSetName, "id": valueSetRecord.id});

			            if (count === 0) {
			              //dataSource.disconnect();
			              
			              var caption = "	√√ Value Sets Loading : Done ";
			              console.log(colors.green(caption));

			              callback(null, valueSets, valueSetValues, attributeGroupsList);
			            }
			        });
				}
			}
		});
    },
    function(valueSetsList, valueSetValuesList, attributeGroupsList, callback) {
    	console.log('Loading valueSet Values')
    	// Load Value Set Values
	    var PlmAttrValueSetValues = app.models.PlmAttrValueSetValues;
	    var count = valueSetValuesList.length;
	    console.log("Total value set values : "+count);

	    valueSetValuesList.forEach(function(valueSetValueIn) {
	      var pickedValueSet = lodash.filter(valueSetsList, 
	        { 'valueSetName':  valueSetValueIn["LOV Name"]} );

	      valueSetValueIn.valueSetId = pickedValueSet[0].id;

	      var valueSetValue = {
			  "key": valueSetValueIn.Key,
			  "value": valueSetValueIn.Value,
			  "valueSetId": pickedValueSet[0].id,
			  "createdAt": new Date(),
			  "lastModifiedAt": new Date()
			};

	       PlmAttrValueSetValues.create(valueSetValue, function(err, valueSetValue) {
	        if (err) return console.log(err);

	        count--;
	        console.log('remaining valueSet Values : '+count);
	        if (count === 0) {
	          //dataSource.disconnect();
	          
	          var caption = "	√√ Value Set Values Loading : Done ";
	          console.log(colors.green(caption));
	          callback(null, valueSetsList, attributeGroupsList);
	        }
	      });
	    });
    },
    function(valueSetsList, attributeGroupsList, callback) {

    	sheet_name_list.forEach(function(y) {
			if (y == "Attributes") {
				console.log("Loading "+y);
			  	var worksheet = workbook.Sheets[y];
			    var attributes =   XLSX.utils.sheet_to_json(worksheet, {raw: true});
			    var groupedAttrs = lodash.groupBy(attributes, "AG Internal Name");
			    var values;

			    // Load Attributes
			    var PlmAttributes = app.models.PlmAttributes;
			    var count = attributes.length;
			    var valueSetId;

			    Object.keys(groupedAttrs).forEach(function(key) {
				    attributes = groupedAttrs[key];
				    
				    var idx = 0;
				    attributes.forEach(function(attributeIn) {
				    	idx += 1;
				    	valueSetId = null;
				    	if (attributeIn["LOV Name"] != undefined) {
				    		var pickedValueSet = lodash.filter(valueSetsList, 
					        	{ 'valueSetName':  attributeIn["LOV Name"]} );
				    		valueSetId = pickedValueSet[0].id;
				    	} 
				    	
				    	var pickedAG = lodash.filter(attributeGroupsList, 
					        	{ 'attrGroupIntName':  attributeIn["AG Internal Name"]} );

				      	var attribute = {
						  "attrDispName": attributeIn["Display Name"],
						  "attrIntName": attributeIn["Internal Name"],
						  "dataType": "String",
						  "valueSetId": valueSetId,
						  "dbColumnName": "string"+idx,
						  "uniqueKeyFlag": false,
						  "requiredFlag": false,
						  "defaultValue": null,
						  "attrGroupId": pickedAG[0].id,
						  "createdAt": new Date(),
						  "lastModifiedAt": new Date()
						}

				       PlmAttributes.create(attribute, function(err, attributeRecord) {
				        if (err) return console.log(err);

				        count--;

				        if (count === 0) {
				          //dataSource.disconnect();
				          
				          var caption = "	√√ attributes Loading : Done ";
				          callback(null, caption);
				        }
				      });
				    });

				});	    
			}
		});

    	/*
    	// Load Value Set Values
	    var PlmAttrValueSetValues = app.models.PlmAttrValueSetValues;
	    var count = valueSetValuesList.length;

	    valueSetValuesList.forEach(function(valueSetValueIn) {
	      var pickedValueSet = lodash.filter(valueSetsList, 
	        { 'valueSetName':  valueSetValueIn["LOV Name"]} );

	      valueSetValueIn.valueSetId = pickedValueSet[0].id;

	      var valueSetValue = {
			  "key": valueSetValueIn.Key,
			  "value": valueSetValueIn.Value,
			  "valueSetId": pickedValueSet[0].id,
			  "createdAt": new Date(),
			  "lastModifiedAt": new Date()
			};

			console.log(valueSetValue);

	       // insert new records into the Account table
	       PlmAttrValueSetValues.create(valueSetValue, function(err, valueSetValue) {
	        if (err) return console.log(err);

	        count--;

	        if (count === 0) {
	          //dataSource.disconnect();
	          
	          var caption = "	√√ Value Set Values Loading : Done ";
	          callback(null, caption);
	        }
	      });
	    });
	    */
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
    	
    	process.exit();
  	}
);







