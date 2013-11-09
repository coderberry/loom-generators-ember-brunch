var parent = require('./default');
var glob = require('glob');
var inflector = require('../../lib/inflector');
var fs = require('loom/lib/fs');
var assignable = ['component', 'lib', 'controller', 'model', 'route', 'view', 'mixin'];
var app = parent.appPath;

exports.template = 'build/index.coffee.hbs';

exports.savePath = function() {
  return app+'/index.coffee';
};

exports.present = function() {
  return {
    modules: modules(),
    helpers: helpers()
  };
};

exports.write = function(savePath, src) {
  fs.confirmWriteFileSync(savePath, src, 'force');
};

function modules() {
  return assignable.reduce(function(modules, dir) {
    return modules.concat(glob.sync(app+'/'+dir+'s/**/*.coffee').map(function(module) {
      // app/controllers/application -> ApplicationController
      var name = module.replace(app+'/'+dir+'s', '').replace(/\.coffee$/, '')+'/'+dir;
      var regex = new RegExp('^'+app);
      return {
        path: module.replace(regex, '.').replace(/\.coffee$/, ''),
        name: inflector.objectify(name)
      };
    }));
  }, []);
}

function helpers() {
  return glob.sync(app+'/helpers/**/*.coffee').map(function(helper) {
    var regex = new RegExp('^'+app);
    return { path: helper.replace(regex, '.').replace(/\.coffee$/, '') };
  });
}

