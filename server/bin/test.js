const queryable = require('query-objects');
 var _ = require('lodash');
var Lazy = require('lazy.js');

var inputProduct = {
  "commercialHierarchy": "G76DM",
  "transactionId": "e14bfc88-ac12-4def-bfff-c09a914d0c12",
  "isOwnLabel": "true",
  "brand": "FINEST ORGANIC",
  "crossItemReference": {
    "vendorPartNumber": "Oil008",
    "supplierNumber": "12345"
  },
  "gtinInfo": {
    "gtin": null,
    "gtinType": "EAN-13",
    "gtinStart": null,
    "gtinEnd": null
  },
  "descriptionList": [
    {
      "descType": "product",
      "descValue": "Tesco Finest Roasted Chilli Peanuts 450g"
    },
    {
      "descType": "sel1",
      "descValue": "Tesco"
    },
    {
      "descType": "sel2",
      "descValue": "Chocolate Cereal"
    },
    {
      "descType": "sel3",
      "descValue": "750g"
    },
    {
      "descType": "till",
      "descValue": "Roast Chilli"
    },
    {
      "descType": "scales1",
      "descValue": null
    },
    {
      "descType": "scales2",
      "descValue": null
    },
    {
      "descType": "scales3",
      "descValue": null
    },
    {
      "descType": "scales4",
      "descValue": null
    },
    {
      "descType": "suffix",
      "descValue": null
    }
  ],
  "soldInCountriesList": [
    {
      "countryCode": "GB"
    }
  ],
  "dateList": [
    {
      "name": "targetLaunch",
      "date": "2017-04-16"
    }
  ],
  "sellByType": "Item",
  "promotionType": "Standard",
  "tradeItemType": {
    "isSellable": true,
    "isOrderable": true
  },
  "productAttributes": [
    {
      "groupName": "productContents",
      "internalNames": [
        {
          "internalName": "hasDrainedWeight",
          "value": "N"
        }
      ]
    },
    {
      "groupName": "productPackaging",
      "internalNames": [
        {
          "internalName": "packagingType",
          "value": "Box"
        }
      ]
    },
    {
      "groupName": "productOrigin",
      "internalNames": [
        {
          "internalName": "countryOfOriginCode",
          "value": "GB"
        },
        {
          "internalName": "countryOfOriginName",
          "value": "United Kingdom"
        }
      ]
    },
    {
      "groupName": "productCare",
      "internalNames": [
        {
          "internalName": "hasShelfLife",
          "value": "Y"
        },
        {
          "internalName": "shelfLifeDays",
          "value": "70"
        },
        {
          "internalName": "minLifeDepotDays",
          "value": "90"
        },
        {
          "internalName": "maxCustStorageDays",
          "value": null
        }
      ]
    },
    {
      "groupName": "productContents",
      "internalNames": [
        {
          "internalName": "drainedWeight",
          "value": null
        },
        {
          "internalName": "netContents",
          "value": "50.0"
        },
        {
          "internalName": "contentsUom",
          "value": "kg"
        }
      ]
    },
    {
      "groupName": "generalAlcohol",
      "internalNames": [
        {
          "internalName": "exciseProductType",
          "value": null
        },
        {
          "internalName": "exciseProductCode",
          "value": null
        },
        {
          "internalName": "fiscalCode",
          "value": null
        },
        {
          "internalName": "alcoholVolumePercent",
          "value": null
        },
        {
          "internalName": "tariffCode",
          "value": null
        }
      ]
    },
    {
      "groupName": "episel",
      "internalNames": [
        {
          "internalName": "episelDesc1",
          "value": null
        },
        {
          "internalName": "episelDesc2",
          "value": null
        },
        {
          "internalName": "episelDesc3",
          "value": null
        },
        {
          "internalName": "episelDesc4",
          "value": null
        },
        {
          "internalName": "episelDesc5",
          "value": null
        }
      ]
    }
  ]
};

var metadata = {"hierarchyName":"Chips/Crisps/Snack Mixes – Natural/Extruded (Shelf Stable)","hierarchyId":11149,"attributeGroups":[{"attrGroupDispName":"Net Product Contents","attrGroupIntName":"productContents","attrGroupBehaviour":"Single Row","attrGroupType":"Dynamic","id":1,"attributes":[{"attrDispName":"Has Drained Weight","attrIntName":"hasDrainedWeight","valueSetId":1,"dbColumnName":"string1","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":1,"id":6,"valueSets":{"valueSetName":"YesNo","id":1,"values":[{"key":"N","value":"No","valueSetId":1,"id":15},{"key":"Y","value":"Yes","valueSetId":1,"id":16}]}},{"attrDispName":"Net Contents UOM","attrIntName":"contentsUom","valueSetId":4,"dbColumnName":"string4","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":1,"id":8,"valueSets":{"valueSetName":"NetContentsUomLOV","id":4,"values":[{"key":"mg","value":"Milligrams","valueSetId":4,"id":1},{"key":"g","value":"Grams","valueSetId":4,"id":2},{"key":"l","value":"Litres","valueSetId":4,"id":3},{"key":"cl","value":"Centilitres","valueSetId":4,"id":4},{"key":"SHEET","value":"SHEET","valueSetId":4,"id":5},{"key":"ml","value":"Millilitres","valueSetId":4,"id":6},{"key":"kg","value":"Kilograms","valueSetId":4,"id":7},{"key":"Single","value":"Single","valueSetId":4,"id":8}]}},{"attrDispName":"Drained Weight","attrIntName":"drainedWeight","valueSetId":null,"dbColumnName":"string2","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":1,"id":9},{"attrDispName":"Net Contents","attrIntName":"netContents","valueSetId":null,"dbColumnName":"string3","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":1,"id":10}]},{"attrGroupDispName":"Product Origin","attrGroupIntName":"productOrigin","attrGroupBehaviour":"Single Row","attrGroupType":"Dynamic","id":2,"attributes":[{"attrDispName":"Country of Origin ISO Alpha-2 Code","attrIntName":"countryOfOriginCode","valueSetId":null,"dbColumnName":"string1","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":2,"id":17},{"attrDispName":"Country of Origin Name","attrIntName":"countryOfOriginName","valueSetId":null,"dbColumnName":"string2","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":2,"id":21}]},{"attrGroupDispName":"Product Packaging","attrGroupIntName":"productPackaging","attrGroupBehaviour":"Single Row","attrGroupType":"Dynamic","id":3,"attributes":[{"attrDispName":"Packaging Type","attrIntName":"packagingType","valueSetId":2,"dbColumnName":"string1","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":3,"id":2,"valueSets":{"valueSetName":"PackagingTypeLOV","id":2,"values":[{"key":"Bag","value":"Bag","valueSetId":2,"id":9},{"key":"Basket","value":"Basket","valueSetId":2,"id":10},{"key":"Bowl","value":"Bowl","valueSetId":2,"id":11},{"key":"Bottle","value":"Bottle","valueSetId":2,"id":12},{"key":"Box","value":"Box","valueSetId":2,"id":13},{"key":"Can","value":"Can","valueSetId":2,"id":14},{"key":"Carafe","value":"Carafe","valueSetId":2,"id":17},{"key":"Card","value":"Card","valueSetId":2,"id":18},{"key":"Carton","value":"Carton","valueSetId":2,"id":19},{"key":"Casket","value":"Casket","valueSetId":2,"id":20},{"key":"Clispstrips","value":"Clispstrips","valueSetId":2,"id":21},{"key":"Cryovac","value":"Cryovac","valueSetId":2,"id":22},{"key":"Dispenser","value":"Dispenser","valueSetId":2,"id":23},{"key":"Flask","value":"Flask","valueSetId":2,"id":24},{"key":"Drum","value":"Drum","valueSetId":2,"id":25},{"key":"Flower Pot","value":"Flower Pot","valueSetId":2,"id":26},{"key":"Loose","value":"Loose","valueSetId":2,"id":27},{"key":"Jar","value":"Jar","valueSetId":2,"id":28},{"key":"Net","value":"Net","valueSetId":2,"id":29},{"key":"Pack","value":"Pack","valueSetId":2,"id":30},{"key":"Packet","value":"Packet","valueSetId":2,"id":31},{"key":"Overwrap","value":"Overwrap","valueSetId":2,"id":32},{"key":"Plastic Bottle","value":"Plastic Bottle","valueSetId":2,"id":33},{"key":"Polyryder","value":"Polyryder","valueSetId":2,"id":34},{"key":"Punnet","value":"Punnet","valueSetId":2,"id":35},{"key":"Pump","value":"Pump","valueSetId":2,"id":36},{"key":"Sachet","value":"Sachet","valueSetId":2,"id":37},{"key":"Set","value":"Set","valueSetId":2,"id":38},{"key":"Shrink Wrap","value":"Shrink Wrap","valueSetId":2,"id":39},{"key":"Tin","value":"Tin","valueSetId":2,"id":40},{"key":"Tub","value":"Tub","valueSetId":2,"id":41},{"key":"Tray","value":"Tray","valueSetId":2,"id":42},{"key":"Tube","value":"Tube","valueSetId":2,"id":43},{"key":"Vacuum Pack","value":"Vacuum Pack","valueSetId":2,"id":44}]}}]},{"attrGroupDispName":"Descriptions","attrGroupIntName":"descriptionList","attrGroupBehaviour":"Multi Row","attrGroupType":"Dynamic","id":4,"attributes":[{"attrDispName":"Description Value","attrIntName":"descValue","valueSetId":null,"dbColumnName":"string2","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":4,"id":22},{"attrDispName":"Description Type","attrIntName":"descType","valueSetId":3,"dbColumnName":"string1","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":4,"id":23,"valueSets":{"valueSetName":"DescTypes","id":3,"values":[{"key":"Base","value":"Base","valueSetId":3,"id":45},{"key":"Product","value":"Product","valueSetId":3,"id":46},{"key":"Sel1","value":"Sel2","valueSetId":3,"id":47},{"key":"Sel2","value":"Sel3","valueSetId":3,"id":48},{"key":"Sel3","value":"Sel4","valueSetId":3,"id":49},{"key":"Suffix","value":"Suffix","valueSetId":3,"id":50},{"key":"Till","value":"Till","valueSetId":3,"id":51},{"key":"Scales1","value":"Scales2","valueSetId":3,"id":52},{"key":"Scales2","value":"Scales3","valueSetId":3,"id":53},{"key":"Scales3","value":"Scales4","valueSetId":3,"id":54},{"key":"Scales4","value":"Scales5","valueSetId":3,"id":55}]}}]},{"attrGroupDispName":"EPISEL Description","attrGroupIntName":"episel","attrGroupBehaviour":"Single Row","attrGroupType":"Dynamic","id":5,"attributes":[{"attrDispName":"EPISEL Desc Line3","attrIntName":"episelDesc3","valueSetId":null,"dbColumnName":"string3","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":5,"id":13},{"attrDispName":"EPISEL Desc Line1","attrIntName":"episelDesc1","valueSetId":null,"dbColumnName":"string1","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":5,"id":14},{"attrDispName":"EPISEL Desc Line2","attrIntName":"episelDesc2","valueSetId":null,"dbColumnName":"string2","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":5,"id":18},{"attrDispName":"EPISEL Desc Line4","attrIntName":"episelDesc4","valueSetId":null,"dbColumnName":"string4","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":5,"id":19},{"attrDispName":"EPISEL Desc Line5","attrIntName":"episelDesc5","valueSetId":null,"dbColumnName":"string5","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":5,"id":20}]},{"attrGroupDispName":"Product Care","attrGroupIntName":"productCare","attrGroupBehaviour":"Single Row","attrGroupType":"Dynamic","id":6,"attributes":[{"attrDispName":"Shelf Life (Days)","attrIntName":"shelfLifeDays","valueSetId":null,"dbColumnName":"string2","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":6,"id":1},{"attrDispName":"Max Customer Storage Days","attrIntName":"maxCustStorageDays","valueSetId":null,"dbColumnName":"string4","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":6,"id":3},{"attrDispName":"Has Shelf Life","attrIntName":"hasShelfLife","valueSetId":1,"dbColumnName":"string1","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":6,"id":4,"valueSets":{"valueSetName":"YesNo","id":1,"values":[{"key":"N","value":"No","valueSetId":1,"id":15},{"key":"Y","value":"Yes","valueSetId":1,"id":16}]}},{"attrDispName":"Minimum Life Depot (Days)","attrIntName":"minLifeDepotDays","valueSetId":null,"dbColumnName":"string3","uniqueKeyFlag":false,"requiredFlag":false,"attrGroupId":6,"id":7}]}]};

function prepareProductAttrsJson (inputAttrGroupName, metadataAttrs, inputAttributes, agType) {

    var attrsJson = {                           
      "createdAt": new Date(),
      "lastModifiedAt": new Date(),
      "createdBy": 0,
      "lastModifiedBy": 0                      
    };

    //console.log(metadataAttrs);

    var metadataAttr = '';
    var metadataAg = '';
    var attrIntName = '';
    var attrValue = '';

    var totalAttrs = Object.keys(inputAttributes).length;
    var attrsWithNoValue = 0;

    ////////
    var res = Lazy(inputAttributes)
      .mapObject(function(key, value) { return key; })
      .map(function(x) { 
        console.log('??????? ::::: '+x);
        var t = Lazy(metadataAttrs)
          .filter({ attrIntName :  x })
          //.map(function(res) { attrsJson[x.dbColumnName] : })
        console.log(t.each(function(x) { console.log('======'); console.log(x); }));
      })

    console.log(res.each(function(x) { console.log('======'); console.log(x); }));
    ////////

    for (var attr in inputAttributes ) {
      //console.log("++++++ attr : " + attr);
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

  var metadataAg = Lazy(metadata.attributeGroups)
    .filter({ attrGroupIntName: 'descriptionList' })
    .first()  
    //.each(function(x) { return x.attributes; });

  console.log(metadataAg);

  var inputresult = Lazy(inputProduct.descriptionList)
          .map( function(x) {
              return prepareProductAttrsJson('descriptionList', 
                metadataAg.attributes, x, 'main');
            }
          ).map( function(y) {
            y.attrGroupId = metadataAg.id;
            return y;
          });

console.log(inputresult.each(function(x) { console.log('++++'); console.log(x); }));

var numbers = [1, 2, 3, 4, 5, 6];
function isEven(x) { return x % 2 === 0; }
var numbersRes =  Lazy(numbers).filter(isEven)

//console.log(numbersRes.each(function(x) { console.log('++++'); console.log(x); }));


