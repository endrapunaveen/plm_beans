'use strict';
var _ = require('lodash');

module.exports = function(Plmhierarchynodes) {

	Plmhierarchynodes.getMetadata = function(name, cb) {
		
		Plmhierarchynodes.findOne({where: {hierarchyName: name},
			include: [{"associations": {"attributeGroup": 
				{"attributes": {"valueSets": "values" }}}}],
			fields: {
				hierarchyTypeFkId: false,
				hierarchyLevelFkId: false,
				createdAt: false,
				lastModifiedAt: false,
				createdBy: false,
				lastModifiedBy: false,
				parentHierarchyId: false
			}
		}, function(err, hierarchyNode) {
			console.log(hierarchyNode);
			cb(null, hierarchyNode);
			 
		});
	}

	Plmhierarchynodes.remoteMethod('getMetadata', {
		description:"List Metadata. Include the related Attribute Groups and Attributes information",
		returns: {arg: 'Plmhierarchynodes', type: 'array'},
		accepts: {arg: 'name', type: 'string', required: true},
		          http: {path:'/:name/metadata', verb: 'get'}
	});

	Plmhierarchynodes.nest = function(id, callback) {
		
		var app = require('../../server/server');
		var dataSource = app.dataSources.plmdev;
		/*
		var sql = "SELECT T2.id, T2.hierarchyName, T2.parentHierarchyId \n "+
				"	FROM (\n "+
				"	    SELECT \n "+
				"	        @r AS _id, \n "+
				"	        (SELECT @r := parentHierarchyId FROM naveen.PlmHierarchyNodes WHERE id = _id) AS parent_id, \n "+
				"	        @l := @l + 1 AS lvl \n "+
				"	    FROM \n "+
				"	        (SELECT @r := " +  id + ", @l := 0 from naveen.PlmHierarchyNodes \n "+
				"				where parentHierarchyId is not null) vars, \n "+
				"	        naveen.PlmHierarchyNodes m \n "+
				"	    WHERE @r is not null) T1 \n "+
				"	JOIN naveen.PlmHierarchyNodes T2 \n "+
				"	ON T1._id = T2.id \n "+
				"	ORDER BY T1.lvl DESC; \n ";
		
		console.log(id + " ++++++ " + sql);
		
		dataSource.connector.execute(sql, [], function(err, results){
			if(err) return callback(err);
		   	
		   	console.log(results[0].id);
		   	callback(null, results);
		});
		*/
		
		var findObjectByLabel = function(hierObject, label) {
			console.log(hierObject);

		    var parent = hierObject.parentHierarchy;
		    console.log(parent);
		    if (parent === undefined) {
		        console.log('done...')
		        return null;
		    } 

		    if (hierObject.id !== undefined) {
		        hierachyIdsList.push(hierObject.id);
		    }

		    findObjectByLabel(parent, label);
		};
		var hierachyIdsList = [];

		//{where: {hierarchyName: name}
		Plmhierarchynodes.find( {where: {id: id} 
			,
			"fields" : ["id", "hierarchyName", "parentHierarchyId"],
			"include":{
				"relation": "parentHierarchy",
				"scope":{
					"fields" : ["id", "hierarchyName", "parentHierarchyId"],
					"include":{
						"relation":"parentHierarchy",
						"scope":{
							"fields" : ["id", "hierarchyName", "parentHierarchyId"],
							"include":{
								"relation":"parentHierarchy",
								"scope":{
									"fields" : ["id", "hierarchyName", "parentHierarchyId"],
									"include":{
										"relation":"parentHierarchy",
										"scope": {
											"fields" : ["id", "hierarchyName", "parentHierarchyId"]
										}
									}
								}
							}
						}
					}
				}
			}
		}, function(err, results) {
		   if(err) return callback(err);
		   
		   	callback(null, results);
           
		});
		
	}

	Plmhierarchynodes.remoteMethod(
		'nest', {
			accepts: {arg: 'id', type: 'number', required: true},
			returns: [{
				arg: "resArray",
				type: "object",
				required: true,
				http: {
					source: 'query'
				},
				"description:": "get nested results"
			}],
			http: {
				path: '/:id/nest',
				verb: 'get'
			}
		}
	);

};




//http://localhost:3000/api/PlmHierarchyAgAssocs?filter[include]=hierarchies&filter[include][attributeGroups]=attributes