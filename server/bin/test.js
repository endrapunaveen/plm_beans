const queryable = require('query-objects');
var _ = require('lodash');

var users = [
  { 'user': 'barney',  'age': 36, 'active': true },
  { 'user': 'fred',    'age': 40, 'active': false },
  { 'user': 'pebbles', 'age': 1,  'active': true }
];

var res = _.find(users, { 'user': 'fred'});
res['cool'] = "Naveen";

console.log(res);

  const list = [
  {
    "entityId": 4,
    "entityName": "CommercialGPCMapping",
    "dbColumnName": "attr3",
    "entityValueId": 17,
    "entityFieldName": "sourceValue",
    "value": "Chips/Crisps/Snack Mixes – Natural/Extruded (Shelf Stable)"
  },
  {
    "entityId": 4,
    "entityName": "CommercialGPCMapping",
    "dbColumnName": "attr2",
    "entityValueId": 17,
    "entityFieldName": "source",
    "value": "GPC"
  },
  {
    "entityId": 4,
    "entityName": "CommercialGPCMapping",
    "dbColumnName": "attr1",
    "entityValueId": 17,
    "entityFieldName": "mdmValue",
    "value": "G7"
  },
  {
    "entityId": 2,
    "entityName": "Brands",
    "dbColumnName": "attr1",
    "entityValueId": 83,
    "entityFieldName": "brandName",
    "value": "FINEST ORGANIC"
  },
  {
    "entityId": 2,
    "entityName": "Brands",
    "dbColumnName": "attr2",
    "entityValueId": 83,
    "entityFieldName": "isOwnLabel",
    "value": "Yes"
  },
  {
    "entityId": 3,
    "entityName": "promotionType",
    "dbColumnName": "attr1",
    "entityValueId": 15191,
    "entityFieldName": "mdmValue",
    "value": "Standard"
  },
  {
    "entityId": 3,
    "entityName": "promotionType",
    "dbColumnName": "attr2",
    "entityValueId": 15191,
    "entityFieldName": "source",
    "value": "RMS"
  },
  {
    "entityId": 3,
    "entityName": "promotionType",
    "dbColumnName": "attr3",
    "entityValueId": 15191,
    "entityFieldName": "sourceValue",
    "value": "N"
  },
  {
    "entityId": 1,
    "entityName": "sellByType",
    "dbColumnName": "attr2",
    "entityValueId": 15194,
    "entityFieldName": "source",
    "value": "RMS"
  },
  {
    "entityId": 1,
    "entityName": "sellByType",
    "dbColumnName": "attr1",
    "entityValueId": 15194,
    "entityFieldName": "mdmValue",
    "value": "Item"
  },
  {
    "entityId": 1,
    "entityName": "sellByType",
    "dbColumnName": "attr3",
    "entityValueId": 15194,
    "entityFieldName": "sourceValue",
    "value": "I"
  }
]

  var filters = [
    {
      field: 'entityName',
      value: 'sellByType',
      operator: 'equals'
    },
    {
      field: 'entityFieldName',
      value: 'mdmValue',
      operator: 'equals'
    },
    {
      field: 'value',
      value: 'Item',
      operator: 'equals'
    }    
  ];

  // Filter all users that are less than 30 years old AND their first name is Erica
  var res = queryable(list).and(filters)[0].entityId;

  filters = [
    {
      field: 'entityName',
      value: 'CommercialGPCMapping',
      operator: 'equals'
    },
    {
      field: 'entityFieldName',
      value: 'sourceValue',
      operator: 'equals'
    }  
  ];

  res = queryable(list).and(filters)[0].value;

  console.log(res);

  // Filter all users that are less than 30 years old OR their first name is Erica
  //const res = queryable(users).or(filters);