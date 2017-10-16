angular.module('app', [
  'wsSteps'
])
.controller('AppCtrl', function($scope, $interval, StepsAPI){

  var vm = this;
  vm.currentStep = 2;

  var myNavigation1 = new StepsAPI.init('myNavigation2');
  myNavigation1.onReady(function() {
    console.log('Element:', myNavigation1.getElement());
    console.log('Element ID:', myNavigation1.getElementId());
    console.log('Total Steps:', myNavigation1.getTotalSteps());
    myNavigation1.setStep(0);
    console.log('Current Step:', myNavigation1.getStep());
    myNavigation1.setEnabledStep(5);
    console.log('Enabled Steps:', myNavigation1.getEnabledStep());

    
    var countStep = 1;
    $interval(function(){
      myNavigation1.setStep(countStep);
      countStep ++;
      if(countStep > 6) countStep = 1;
    }, 1000);
  });

  myNavigation1.onStepChange(function(){
    console.log('Step Changes');
  });

  myNavigation1.onEnabledStepChange(function(){
    console.log('Enabled Step Changes');
  });

  myNavigation1.onStepChangeNotAllowed(function(err){
    console.log(err);
  });

  //Used in myNavigation3 element
  $interval(function(){
    vm.currentStep ++;
    if(vm.currentStep > 4) vm.currentStep = 1;
  }, 1000);
});