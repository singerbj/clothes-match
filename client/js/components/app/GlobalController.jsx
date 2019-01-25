var globalController = new function() {};
globalController.addMethods = function(newMethods){
    Object.keys(newMethods).forEach(function(key){
        globalController[key] = newMethods[key];
    });
};
export default globalController;
