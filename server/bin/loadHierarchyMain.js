
var shell = require('./shellHelper');

// execute multiple commands in series
shell.series([
    'node server/bin/automigrate.js',
    'node server/bin/loadHierarchyTypes.js',
    'node server/bin/loadHierarchyLevels.js',
    'node server/bin/loadHierarchyNodes.js root',
	'node server/bin/loadHierarchyNodes.js division',
	'node server/bin/loadHierarchyNodes.js group',
	'node server/bin/loadHierarchyNodes.js department',
	'node server/bin/loadHierarchyNodes.js class',
	'node server/bin/loadHierarchyNodes.js subclass',
], function(err){
   console.log('executed many commands in a row'); 
});

