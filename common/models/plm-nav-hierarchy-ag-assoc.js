'use strict';

var _ = require('lodash');

module.exports = function(Plmhierarchyagassoc) {
	Plmhierarchyagassoc.getMetadata = function(name, cb) {
  		
		var app = require('../../server/server');
		var dataSource = app.dataSources.plmdev;

		var sql = "SELECT T2.id, T2.hierarchyName, T2.parentHierarchyId \n "+
				"	FROM (\n "+
				"	    SELECT \n "+
				"	        @r AS _id, \n "+
				"	        (SELECT @r := parentHierarchyId FROM naveen.PlmHierarchyNodes WHERE id = _id) AS parent_id, \n "+
				"	        @l := @l + 1 AS lvl \n "+
				"	    FROM \n "+
				"	        (SELECT @r := id, @l := 0 from naveen.PlmHierarchyNodes \n" +
				"			 where hierarchyName = '"+ name + "') vars, \n "+
				"	        naveen.PlmHierarchyNodes m \n "+
				"	    WHERE @r is not null) T1 \n "+
				"	JOIN naveen.PlmHierarchyNodes T2 \n "+
				"	ON T1._id = T2.id \n "+
				"	ORDER BY T1.lvl ASC; \n ";
		
		console.log(name + " ++++++ " + sql);
		
		dataSource.connector.execute(sql, [], function(err, results){
			if(err) return callback(err);
		   	
		   	var hierarchyIds = _.map(results,"id");
		   	console.log(hierarchyIds);
		   	
			Plmhierarchyagassoc.find( {where : {hierarchyNodeId : {inq: hierarchyIds}}, 
				//{where: {hierarchyNodeId: id},
				"fields" : ["attrGroupId"],
				"order": "attrGroupId ASC",
				"include": {
					"relation": "attributeGroup",
					"scope": {
						"fields" : ["id", "attrGroupIntName", "attrGroupDispName", "attrGroupBehaviour", "attrGroupType" ],
						"order": "id ASC",
						"include": {
							"relation": "attributes",
							"scope": {
								"fields" : ["id", "attrIntName", "attrDispName", "valueSetId", "dbColumnName", "uniqueKeyFlag", "requiredFlag"],
								"order": "id ASC",
								"include" : {
									"relation" : "valueSets",
									"scope" :	 {
										"fields" : ["id", "valueSetName"],
										"order": "id ASC",
										"include" : {
											"relation" : "values",
											"scope" : {
												"fields" : ["id", "key", "value"],
												"order": "id ASC",
											}
										}
									}
								}
							}
						}
					}
				}
				//include: [{"attributeGroup": 
				//	{"attributes": {"valueSets": "values" }}}]
			}, function(err, metadata) {
				var outMeatadata = {"hierarchyName" : name,
									"hierarchyId": hierarchyIds[0],
									"attributeGroups" : metadata
								};
			
				console.log(outMeatadata);
				 //return only the location property of the 
		    	cb(null, outMeatadata);
			});
		})
	}

	Plmhierarchyagassoc.remoteMethod('getMetadata', {
		description:"List Metadata. Include the related Attribute Groups and Attributes information",
		returns: {arg: 'metadta', type: 'object'},
		accepts: {arg: 'name', type: 'string', required: true},
		          http: {path:'/:name/metadata', verb: 'get'}
	});
};
