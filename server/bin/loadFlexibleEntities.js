var app = require('../server');
var lodash = require('lodash');
var async = require('async');
var colors = require('colors/safe');

var mysql      = require('mysql');

var inputFileName = "FlexibleEntities.xlsx";

if(typeof require !== 'undefined') XLSX = require('xlsx');

/* Call XLSX */
var workbook = XLSX.readFile(inputFileName);

var sheet_name_list = workbook.SheetNames;
var flexEntitiesList = [];
var flexEntityColumnsList = [];

var dataSource = app.dataSources.plmdev;

async.waterfall(
[
    function(callback) {
	  	// Load Attribute Groups
		sheet_name_list.forEach(function(y) {
			
			if (y == "FlexibleEntities") {
				console.log("Loading "+y);
			  	var worksheet = workbook.Sheets[y];
			    var flexEntities =   XLSX.utils.sheet_to_json(worksheet, {raw: true});

			    var PlmNavFlexibleEntities = app.models.PlmNavFlexibleEntities;
		        var count = flexEntities.length;

			    for (var idx=0; idx < count; idx++) {
			    	
					var flexEntity = {
					  "entityName": flexEntities[idx]["entityName"],
					  "entityDesc": flexEntities[idx]["entityDesc"],
					  createdAt: new Date(),
					  lastModifiedAt: new Date()
					}

					PlmNavFlexibleEntities.create(flexEntity, function(err, flexEntityRecord) {
			            if (err) return console.log(err);

			            flexEntitiesList.push({"entityName": flexEntityRecord.entityName,
			            	"id": flexEntityRecord.id
			        	});

			            count--;

			            if (count === 0) {
			              //dataSource.disconnect();
			              
			              var caption = "	√√ "+y+" Loading : Done ";
			              console.log(colors.green(caption));
			              callback(null, flexEntitiesList);
			              //process.exit();
			            }
			        });
			    }	           	
			}
		});
    },
    function(flexEntitiesList, callback) {

    	sheet_name_list.forEach(function(y) {
			if (y == "FlexibleEntitiesColumns") {
				console.log("Loading "+y);
			  	var worksheet = workbook.Sheets[y];
			    var flexEntColumns =   XLSX.utils.sheet_to_json(worksheet, {raw: true});
			    var groupedFlexEntColumns = lodash.groupBy(flexEntColumns, "entityName");
			    
			    // Load FlexibleEntitiesColumns
			    var PlmNavFlexibleEntitiesColumns = app.models.PlmNavFlexibleEntitiesColumns;
			    var count = flexEntColumns.length;

			    Object.keys(groupedFlexEntColumns).forEach(function(key) {
				    flexEntColumns = groupedFlexEntColumns[key];
				    
				    var idx = 0;
				    flexEntColumns.forEach(function(flexEntColumnIn) {
				    	idx += 1;

				    	var pickedFlexEntity= lodash.filter(flexEntitiesList, 
					        	{ 'entityName':  flexEntColumnIn["entityName"]} );

				      	var flexEntColumn = {
						  "entityId": pickedFlexEntity[0].id,
						  "entityFieldName": flexEntColumnIn["entityFieldName"],
						  "dbColumnName": "attr"+idx,
						  "createdAt": new Date(),
						  "lastModifiedAt": new Date()
						}

				       PlmNavFlexibleEntitiesColumns.create(flexEntColumn, function(err, flexEntColumnRecord) {
				        if (err) return console.log(err);

				        count--;

				        flexEntityColumnsList.push({
				        	"entityName": flexEntColumnIn.entityName,
				        	"entityId": flexEntColumnRecord.entityId, 
				        	"entityFieldName": flexEntColumnRecord.entityFieldName , 
				        	"dbColumnName": flexEntColumnRecord.dbColumnName 
				        });

				        if (count === 0) {
				          console.log(flexEntityColumnsList)
				          var caption = "	√√ "+ y + " Loading : Done ";
				          callback(null, flexEntityColumnsList, callback);
				        }
				      });
				    });

				});	    
			}
		});
    },
    function(flexEntityColumnsList, callback) {

    	sheet_name_list.forEach(function(y) {
			if (y !== "FlexibleEntitiesColumns" && y !== "FlexibleEntities") {
				console.log("Loading "+y);

				var pickedFlexEntity = lodash.filter(flexEntityColumnsList, 
					        	{ 'entityName':  y} );

				//console.log(pickedFlexEntity);
				if (pickedFlexEntity.length > 0) {

					var worksheet = workbook.Sheets[y];
				    var flexEntColumnValues =   XLSX.utils.sheet_to_json(worksheet, {raw: true});

				    var PlmNavFlexibleEntityValues = app.models.PlmNavFlexibleEntityValues;
				    var count = flexEntColumnValues.length;
				    
				    var flexEntColumnValue = {
		    			"entityId": pickedFlexEntity[0].entityId,
		    			"createdAt": new Date(),
				  		"lastModifiedAt": new Date()
		    		};

				    flexEntColumnValues.forEach(function(flexEntColumnValueIn) {

				    	Object.keys(flexEntColumnValueIn).forEach(function(key) {
				    		//console.log('key : '+key);
				    		//console.log('value : '+flexEntColumnValueIn[key]);
				    		var pickedFlexEntityColumn= lodash.filter(pickedFlexEntity, 
					        	{ 'entityFieldName':  key} );

				    		flexEntColumnValue[pickedFlexEntityColumn[0].dbColumnName] = flexEntColumnValueIn[key];
				    	});
				    
				    	PlmNavFlexibleEntityValues.create(flexEntColumnValue, 
				    		function(err, flexEntColumnValueRecord) 
				    	{
					        if (err) return console.log(err);

					        count--;
					        console.log("Pending records "+count)
					        if (count === 0) {
					          var caption = "	√√ "+ y + " Loading : Done ";
					          callback(null, caption);
					        }
					    });
				    });

				}

			  	    
			}
		});
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



