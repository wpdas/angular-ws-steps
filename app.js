angular.module('app', [
  'wsSteps'
])
.controller('AppCtrl', function($scope, $interval, StepsAPI, StepColors){

  var vm = this;
  vm.currentStep = 2;

  //var stepColors = new StepColors('#ff0000', 'rgba(180, 76, 93, 0.70)', '#0000ff');
  var stepColors = null;

  var myNavigation1 = new StepsAPI.init('myNavigation2', stepColors);
  myNavigation1.onReady(function() {
    console.log('Element:', myNavigation1.getElement());
    console.log('Element ID:', myNavigation1.getElementId());
    console.log('Total Steps:', myNavigation1.getTotalSteps());
    myNavigation1.setStep(0);
    console.log('Current Step:', myNavigation1.getStep());
    myNavigation1.setEnabledStep(5);
    console.log('Enabled Steps:', myNavigation1.getEnabledStep());
    //myNavigation1.update();
    //myNavigation1.setEnabledColor('#ff0000');

    
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

  //(!) Avisa quando mais de um objeto é criado usando o mesmo ID
  /*var myNav2 = new MTNavigationAPI.init('myNavigation');
  myNav2.onStepChangeNotAllowed(function(err){
    console.log(err);
  });*/

  //(!) Quando o componente recebe um nome ID já usado,gera erro.

  //Usado no objeto ID myNavigation3
  $interval(function(){
    vm.currentStep ++;
    if(vm.currentStep > 4) vm.currentStep = 1;
  }, 1000);
});