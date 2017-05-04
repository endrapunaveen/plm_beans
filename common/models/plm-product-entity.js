'use strict';

const queryable = require('query-objects');
var async = require('async');
var _ = require('lodash');

module.exports = function(Plmproductentity) {

	Plmproductentity.createproduct = function(msg, callback) {
		console.log("in side remote method create...");

		var app = require('../../server/server');
		var dataSource = app.dataSources.plmdev;

		async.waterfall(
  		[
  			function(callback) {
  				var sql = 
					" SELECT \n" +
					" ent.id entityId, ent.entityName, \n" +
					" entCol.dbColumnName, entValues.id entityValueId, entCol.entityFieldName, \n" +
					" case entCol.dbColumnName \n" +
					" when 'attr1' then entValues.attr1 \n" +
					" when 'attr2' then entValues.attr2 \n" +
					" when 'attr3' then entValues.attr3 \n" +
					" when 'attr4' then entValues.attr4 \n" +
					" when 'attr5' then entValues.attr5 \n" +
					" when 'attr6' then entValues.attr6 \n" +
					" when 'attr7' then entValues.attr7 \n" +
					" when 'attr8' then entValues.attr8 \n" +
					" when 'attr9' then entValues.attr9 \n" +
					" when 'attr10' then entValues.attr10 \n" +
					" else '' end as value \n" +
					" FROM PlmFlexibleEntities ent, \n" +
					" 	PlmFlexibleEntitiesColumns entCol, \n" +
					"   PlmFlexibleEntityValues entValues \n" +
					" where ent.id = entCol.entityId \n" +
					" and entValues.entityId = ent.id \n" +
					" and ((ent.entityName = 'Brands' \n" +
					" 		and entValues.attr1 = '" + msg.brand + "' )  \n" +
					" 	or (ent.entityName = 'CommercialGPCMapping'  \n" +
					" 		and entValues.attr1 = '"+ msg.commercialHierarchy.substr(0,2) + "')  \n" +
					" 	or (ent.entityName = 'sellByType'  \n" + 
					" 		and entValues.attr1 = '"+ msg.sellByType + "' )  \n" +    
					" 	or (ent.entityName = 'promotionType'  \n" +
					" 		and entValues.attr1 = '"+ msg.promotionType + "' )   \n" +    
					" );";
				
				//console.log(sql);

				dataSource.connector.execute(sql, [], function(err, results){
					if(err) return callback(err);
					
					msg.sellByType = _.find(results, { 'entityName': 'sellByType', 
						'entityFieldName' : 'mdmValue',
						'value' : msg.sellByType
					}).entityId;

					msg.promotionType = _.find(results, { 'entityName': 'promotionType', 
						'entityFieldName' : 'mdmValue',
						'value' : msg.promotionType
					}).entityId;

					msg.brand = _.find(results, { 'entityName': 'Brands', 
						'entityFieldName' : 'brandName',
						'value' : msg.brand
					}).entityId;
									  	
					var hierarchyName = _.find(results, { 'entityName': 'CommercialGPCMapping', 
						'entityFieldName' : 'sourceValue'
					}).value;

					callback(null, msg, hierarchyName);
				});
  			},
  			function(productJson, hierarchyName, callback) {
  				var getMetdataMethod = Plmproductentity.app.models.PlmHierarchyAgAssoc.getMetadata;

				getMetdataMethod(hierarchyName
					,function(err, metadata){
						if(err) return callback(err);
						
						productJson.categoryId = metadata.hierarchyId;
						callback(null, productJson, metadata);
				});
  			},
  			function(inputProduct, metadata, callback) {
  				var plmProductAttributes = app.models.plmProductAttributes;

  				var prodEntity =
				{
				  "productId": inputProduct.transactionId,
				  "categoryId": inputProduct.categoryId,
				  "status": "Active",
				  "version": 1,
				  "isOwnLabel": inputProduct.isOwnLabel,
				  "brand": inputProduct.brand,
				  "sellByType": 1,
				  "promotionType": 1,
				  "isSellable": inputProduct.tradeItemType.isSellable,
				  "isOrderable": inputProduct.tradeItemType.isOrderable,
				  "createdAt": new Date(),
				  "lastModifiedAt": new Date(),
				  "createdBy": 0,
				  "lastModifiedBy": 0
				};
		
				Plmproductentity.create(prodEntity, function(err, createdProduct) {
					if (err) return console.log(err);

					var ag = '';
					var agId = '';
					var attrs = '';
					var attrGroup = '';

					var prodAttrJson = '';
					var metadataAg = '';
					var metadataAgId = '';

					var prodAttributesArray = [];

					metadataAg = _.find(metadata.attributeGroups, 
									{ attrGroupIntName: 'descriptionList' });

					if (metadataAg !== undefined) {
						for (var desc in inputProduct.descriptionList) {
							prodAttrJson = prepareProductAttrsJson('descriptionList', 
								metadataAg.attributes, inputProduct.descriptionList[desc], 'main');
							if (prodAttrJson !== null) {
								prodAttrJson.productId = createdProduct.id;
								prodAttrJson.attrGroupId = metadataAg.id;
								prodAttributesArray.push(prodAttrJson);
							}
						}

					} else {
						console.log(' Error :::: Atribute Group '+attrGroup.groupName + ' is not valid');
					}
					
					for (var p in inputProduct.productAttributes) {
						attrGroup = inputProduct.productAttributes[p];

						metadataAg = _.find(metadata.attributeGroups, 
								{	attrGroupIntName: attrGroup.groupName }
							);
						if (metadataAg !== undefined) {
							metadataAgId = metadataAg.id;
							
							prodAttrJson = prepareProductAttrsJson(attrGroup.groupName, 
								metadataAg.attributes, attrGroup.internalNames, '');
							if (prodAttrJson !== null) {
								prodAttrJson.productId = createdProduct.id;
								prodAttrJson.attrGroupId = metadataAgId;
								prodAttributesArray.push(prodAttrJson);
							}
						} else {
							console.log(' Error :::: Atribute Group '+attrGroup.groupName + ' is not valid');
						}						
					}					

					plmProductAttributes.create(prodAttributesArray, function(err, createdAgs){
						if (err) return console.log(err);
						//createdProduct.productAttributes = createdAgs;
						callback(null, createdProduct);
					});
				})
	  		}
		],
			function (err, caption) {
		    	//console.log(caption);
		    	callback(null, caption);
		  	}
		);
		

		
		/* Query to get flexivle entities as json */
		/*
		var sql = 			
			" select etntity_value_id, entityId, entityName, \n" +
			" concat('{ ', group_concat('\"id\" :', etntity_value_id, ', \"',entityFieldName, '\" : \"', value, '\"'), '}'  ) v1\n" +
			" from ( \n" +
			" SELECT \n" +
			" ent.id entityId, ent.entityName, \n" +
			" entCol.dbColumnName, entValues.id etntity_value_id, entCol.entityFieldName, \n" +
			" case entCol.dbColumnName \n" +
			" when 'attr1' then entValues.attr1 \n" +
			" when 'attr2' then entValues.attr2 \n" +
			" when 'attr3' then entValues.attr3 \n" +
			" when 'attr4' then entValues.attr4 \n" +
			" when 'attr5' then entValues.attr5 \n" +
			" when 'attr6' then entValues.attr6 \n" +
			" when 'attr7' then entValues.attr7 \n" +
			" when 'attr8' then entValues.attr8 \n" +
			" when 'attr9' then entValues.attr9 \n" +
			" when 'attr10' then entValues.attr10 \n" +
			" else '' end as value \n" +
			" FROM naveen.PlmFlexibleEntities ent, \n" +
			" 	naveen.PlmFlexibleEntitiesColumns entCol, \n" +
			"     naveen.PlmFlexibleEntityValues entValues \n" +
			" where ent.id = entCol.entityId \n" +
			" and entValues.entityId = ent.id \n" +
			" and ent.entityName = 'Brands'  \n" +
			" ) list \n" +
			" group by entityName, entityId, etntity_value_id; \n"
			
		dataSource.connector.execute(sql, [], function(err, results){
			if(err) return callback(err);

			var entityResults = {};
			entityResults.entityName = results[0].entityName;
			entityResults.entityId = results[0].entityId;
			entityResults.entityValues = [];

			for (var r in results) {
				console.log(results[r].v1);
				entityResults.entityValues.push(JSON.parse(results[r].v1))
			}

			callback(null, entityResults)
		});
		*/

		/*
		var prodEntity =
			{
			  "productId": msg.transactionId,
			  "categoryId": 1,
			  "status": "Active",
			  "version": 1,
			  "isOwnLabel": msg.isOwnLabel,
			  "brand": 1,
			  "sellByType": 1,
			  "promotionType": 1,
			  "isSellable": msg.tradeItemType.isSellable,
			  "isOrderable": msg.tradeItemType.isOrderable,
			  "createdAt": new Date(),
			  "lastModifiedAt": new Date(),
			  "createdBy": 0,
			  "lastModifiedBy": 0
			};
		
		console.log(prodEntity);

		Plmproductentity.create(prodEntity, function(err, createdProduct) {
			if (err) return console.log(err);

			callback(null, createdProduct);
		})
		*/
	}
	

	function prepareProductAttrsJson (inputAttrGroupName, metadataAttrs, inputAttributes, agType) {

		var attrsJson = {														
			"createdAt": new Date(),
			"lastModifiedAt": new Date(),
			"createdBy": 0,
			"lastModifiedBy": 0											 
		};

		var metadataAttr = '';
		var metadataAg = '';
		var attrIntName = '';
		var attrValue = '';

		var totalAttrs = Object.keys(inputAttributes).length;
		var attrsWithNoValue = 0;

		for (var attr in inputAttributes ) {
			if (agType == 'main') {
				attrIntName = attr;
				attrValue = inputAttributes[attr];
			} else {
				attrIntName = inputAttributes[attr]['internalName'] ;
				attrValue = inputAttributes[attr]['value'] ;
			}

			if (attrValue === undefined || attrValue == null) {
				attrsWithNoValue = attrsWithNoValue + 1;
			} else {
				metadataAttr = _.find(metadataAttrs,
					{ 
						attrIntName :  attrIntName
					}
				);

				if(metadataAttr !== undefined) {
					var metadataAttrId = metadataAttr.id;
					var metadataAttrDbColumnName = metadataAttr.dbColumnName;
					
					attrsJson[metadataAttrDbColumnName] = attrValue;
					
				} else {
					console.log(' Error :::: Atribute  '+ inputAttrGroupName + ':' +  
						attrIntName + ' is not valid');
				}
			}			
		}

		if (attrsWithNoValue == totalAttrs) {
			attrsJson = null;
		}

		return attrsJson;
	}

	function prepareProductMainAttrsJson (inputAttrGroupName, metadataAttrs, inputAttributes, attrIntFieldName, attrValueFieldName) {

		var attrsJson = {														
			"createdAt": new Date(),
			"lastModifiedAt": new Date(),
			"createdBy": 0,
			"lastModifiedBy": 0											 
		};

		var metadataAttr = '';
		var metadataAg = '';
		console.log(metadataAttrs)
		

		for (var attr in inputAttributes ) { //attrGroup.internalNames
			
			metadataAttr = _.find(metadataAttrs, //metadataAg.attributes, 
				{ 
					attrIntName :  attr
					// attrGroup.internalNames[attr][internalName] 
				}
			);

			console.log(metadataAttr);

			if(metadataAttr !== undefined) {
				var metadataAttrId = metadataAttr.id;
				var metadataAttrDbColumnName = metadataAttr.dbColumnName;
				
				attrsJson[metadataAttrDbColumnName] = inputAttributes[attr]; //attrGroup.internalNames[attr].value;
				
			} else {
				console.log(' Error :::: Atribute  '+ inputAttrGroupName + ':' +  
					attr + ' is not valid');
			}
		}

		return attrsJson;
	}

	Plmproductentity.remoteMethod('createproduct', {
		accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
		returns: { arg: 'data', type: 'object', root: true },
		http: { path: '/createproduct', verb: 'post' }
	});

};
