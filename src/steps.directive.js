(function(){
  'use strict';
  // Factory API Directive
  function StepsAPI() {
    
    /**
     * New Steps Instance Element
     * @param {string} element ID
     * @param {StepColors} step colors object (use injected StepColors) 
     */
    var constructor = function(elementID, stepColors) {

      if(api.registerObjectId(elementID)) {
        console.warn('Duplicated id used on instance. ID name: "' + elementID + '"');
      }

      var root = this;
      var elementID = elementID;
      var stepColors = stepColors;
      var isReady = false;
      var stepsNavigation;

      function setElement() {
        stepsNavigation = angular.element(document.querySelector('#' + elementID + ' .ws-steps'));

        if(stepColors) {
          stepsNavigation.scope().vm.setEnabledColor(stepColors.enabledColor);
          stepsNavigation.scope().vm.setDisabledColor(stepColors.disabledColor);
          stepsNavigation.scope().vm.setEnabledIconColor(stepColors.enabledIconColor);
        }
      };

      function printNoReady(){
        console.warn('Component is not ready. Use onReady() event.');
      };

      //API
      this.getElement = function() {
        if(stepsNavigation && isReady) {
          return stepsNavigation;
        } else {
          printNoReady();
        }
      };

      this.getElementId = function() {
        if(stepsNavigation && isReady) {
          return stepsNavigation.scope().vm.getElementId();
        } else {
          printNoReady();
        }
      }

      this.setStep = function(step) {
        if(stepsNavigation && isReady) {
          stepsNavigation.scope().vm.setStep(step);
        } else {
          printNoReady();
        }
      };

      this.getStep = function(){
        if(stepsNavigation && isReady) {
          return parseInt(stepsNavigation.scope().vm.step);
        } else {
          printNoReady();
        }
      };

      this.getTotalSteps = function() {
        if(stepsNavigation && isReady) {
          return stepsNavigation.scope().vm.getTotalSteps();
        } else {
          printNoReady();
        }
      };

      this.setEnabledStep = function(value) {
        if(stepsNavigation && isReady) {
          stepsNavigation.scope().vm.setEnabledStep(value);
        } else {
          printNoReady();
        }
      };

      this.getEnabledStep = function() {
        if(stepsNavigation && isReady) {
          return parseInt(stepsNavigation.scope().vm.enabledStep);
        } else {
          printNoReady();
        }
      };

      this.setEnabledColor = function(color) {
        if(stepsNavigation && isReady) {
          stepsNavigation.scope().vm.setEnabledColor(color);
        } else {
          printNoReady();
        }
      };

      this.setDisabledColor = function(color) {
        if(stepsNavigation && isReady) {
          stepsNavigation.scope().vm.setDisabledColor(color);
        } else {
          printNoReady();
        }
      };

      this.setEnabledIconColor = function(color) {
        if(stepsNavigation && isReady) {
          stepsNavigation.scope().vm.setEnabledIconColor(color);
        } else {
          printNoReady();
        }
      };

      this.onReady = function(callback) {
        //Dispatch event on component ready (only once)
        var onReadyStepEvent = new StepEvent(elementID, api.events.typeEvent.READY, function() {
          isReady = true;
          setElement();
          if(callback) callback();
        });
        api.addEvent(onReadyStepEvent);
      };

      this.update = function(){
        if(stepsNavigation && isReady) {
          root.setStep(root.getStep());
          root.setEnabledStep(root.getEnabledStep());
        } else {
          printNoReady();
        }
      }

      this.onStepChange = function(callback) {
        var onStepChangeStepEvent = new StepEvent(elementID, api.events.typeEvent.STEP_CHANGE, function(){
          if(callback) callback();
        }, false);
        api.addEvent(onStepChangeStepEvent)
      };

      this.onEnabledStepChange = function(callback) {
        var onEnabledStepChangeStepEvent = new StepEvent(elementID, api.events.typeEvent.ENABLED_STEP_CHANGE, function(){
          if(callback) callback();
        }, false);
        api.addEvent(onEnabledStepChangeStepEvent)
      };

      this.onStepChangeNotAllowed = function(callback) {
        var onStepChangeNotAllowed = new StepEvent(elementID, api.events.typeEvent.STEP_CHANGE_NOT_ALLOWED, function(event){
          if(callback) callback('Step ' + event.requestedStepPosition + ' is not enabled for the element "' + elementID + '".');
        }, false);
        api.addEvent(onStepChangeNotAllowed);
      };
    };

    /**
     * Register event
     * @param {*} elementID   Element responsible for receiving the event
     * @param {*} type      Type of event (use new api.events.event(...))
     * @param {*} callback  Callback
     * @param {*} autoKill  Auto kill event on execute? (optional)
     */
    var StepEvent = function(elementID, type, callback, autoKill) {
      if(autoKill == undefined) autoKill = true;
      this.elementID = elementID;
      this.type = type;
      this.autoKill = autoKill;
      this.callback = callback;
    };

    var eventsList = [];
    var createdObjectsId = {};
    var createdElementId = {};

    var api = {
      //Constructor
      init: constructor,
      //Event
      events: {
        event: StepEvent,
        typeEvent: {
          READY: 'onReadyEvent',
          STEP_CHANGE: 'onStepChange',
          ENABLED_STEP_CHANGE: 'onEnabledStepChange',
          STEP_CHANGE_NOT_ALLOWED: 'onStepChangeNotAllowed'
        }
      },
      addEvent: function(stepEvent) {
        eventsList.push(stepEvent);
      },
      removeEvent: function(stepEvent){
        var indexEventOnList = eventsList.indexOf(stepEvent);
        if(indexEventOnList !== -1){
          eventsList.splice(indexEventOnList, 1);
        }
      },
      dispatchEvent: function(elementID, typeEvent, params){
        var cloneEventsList
        cloneEventsList = eventsList;
        cloneEventsList.forEach(function(stepEvent) {
          if(stepEvent.elementID === elementID && stepEvent.type === typeEvent && stepEvent.callback) {

            stepEvent.callback(params);

            //Removes event when it ha already been called (if autoKill be true)
            if(stepEvent.autoKill) {
              api.removeEvent(stepEvent);
            }
          };
        });
      },
      registerObjectId: function(elementID) {
        var alreadyRegistered = createdObjectsId[elementID];
        createdObjectsId[elementID] = true;
        return alreadyRegistered;
      },
      registerElementId: function(elementID) {
        var alreadyRegistered = createdElementId[elementID];
        createdElementId[elementID] = true;
        return alreadyRegistered;
      }
    };

    return api;
  };

  //Factory StepColors Object/Class
  function StepColors() {
    /**
     * StepColors
     * Set default colors to directive
     * @param {string} CSS Color 
     * @param {string} CSS Color
     * @param {string} CSS Color
     */
    function constructor (enabledColor, disabledColor, enabledIconColor){
      this.enabledColor = enabledColor;
      this.disabledColor = disabledColor;
      this.enabledIconColor = enabledIconColor;
    }
    return constructor;
  }

  //Directive Steps
  function Steps(){
    return {
      restrict: 'E',
      controllerAs: 'vm',
      scope: {
        step: '@',
        enabledStep: '@',
        colors: '@'
      },
      controller: StepsController,
      transclude: true,
      link: function(scope, element, attrs){
        if(!attrs.id){
          throw new Error('Attribute "id" is required on element.', element);
        }

        var stepsNavigationElement = angular.element(document.querySelector('#' + attrs.id + ' .ws-steps'));
        stepsNavigationElement.scope().vm.setElement(stepsNavigationElement);
      },
      bindToController: true,
      template: '<div class="ws-steps">'+
                '<nav class="ws-steps-transclude" ng-transclude>'+
                '</nav>'+
                '<div class="steps-line-disabled"></div>'+
                '</div>'
    }
  }

  // Controller for Steps
  function StepsController($scope, $attrs, StepsAPI) {

    var vm = this;
    var stepsNavigation;
    var lastValidStep = 0;

    if(StepsAPI.registerElementId($attrs.id)){
      throw new Error('Duplicate usage of an element id named: "' + $attrs.id + '"');
    }

    function updateStepsStyle() {
      var currentTotalSteps = getTotalSteps();
      stepsNavigation.querySelectorAll('.step').forEach(function(step, index) {
        step.style.width = 'calc(100% / ' + currentTotalSteps + ')';

        //Setup color status (complete / incomplete / enabled)
        var stepIndex = (index + 1);
        updateStepStyle(angular.element(step), stepIndex);

      }, this);
    }

    function updateStepStyle(currentStep, stepIndex) {
      var step = parseInt(vm.step);
      var enabledStep = parseInt(vm.enabledStep);
      
      if (stepIndex <= step) {
        currentStep.scope().vm.isComplete = true;  
      } else {
        currentStep.scope().vm.isComplete = false;  
      }

      if (stepIndex <= enabledStep) {
        currentStep.attr('enabled', 'true');
        currentStep.scope().vm.buttonMode = true;
      } else {
        currentStep.attr('enabled', 'false');
        currentStep.scope().vm.buttonMode = false;
      }

      if (stepIndex === step) {
        currentStep.attr('focused', 'true');
      } else {
        currentStep.attr('focused', 'false');
      }

      if(step > enabledStep){
        vm.setStep(enabledStep);
      }
    }

    function getTotalSteps() {
      var totalSteps = document.querySelector('#' + $attrs.id + ' .ws-steps nav').children.length;
      if(totalSteps === 0) {
        totalSteps = 1
      };
      return totalSteps;
    }

    function getCompleteSteps() {
      return stepsNavigation.querySelectorAll('div.step > .step-line-enabled');
    }

    function updateCompleteStepsClass() {
      var completeSteps = getCompleteSteps();
      var totalSteps = getTotalSteps();
      
      completeSteps.forEach(function(completeStep) {
        var stepWidth = parseInt(100 / totalSteps);
        completeStep.style.width = stepWidth + '%';
        var marginLeft = parseInt(stepWidth) / 2;
        completeStep.style['margin-left'] = '-' + marginLeft + '%';
      });
    };

    function hideAllContents(exception){
      vm.stepsChildList.forEach(function(content){
        if(content !== exception){
          document.getElementById(content).classList.add('ws-steps-content-hidden');
        } else {
          document.getElementById(content).classList.remove('ws-steps-content-hidden');
        }
      });
    }

    //API Access
    vm.getTotalSteps = getTotalSteps;

    vm.getElementId = function(){
      return $attrs.id;
    }

    vm.setElement = function(element) {
      vm.element = element;
      stepsNavigation = vm.element[0].querySelector('nav.ws-steps-transclude');

      if(vm.colors) {
        var newColors = vm.colors.split(',');
        vm.setEnabledColor(newColors[0]);
        vm.setDisabledColor(newColors[1]);
        vm.setEnabledIconColor(newColors[2]);
      }
    };

    vm.setEnabledColor = function(color) {
      document.getElementById($attrs.id).style.setProperty('--ws-steps-enabled-color', color);
    };

    vm.setDisabledColor = function(color) {
      document.getElementById($attrs.id).style.setProperty('--ws-steps-disabled-color', color);
    };

    vm.setEnabledIconColor = function(color) {
      document.getElementById($attrs.id).style.setProperty('--ws-steps-enabled-icon-color', color);
    };

    vm.setStep = function(step) {
      vm.step = step;
    };
    
    vm.setEnabledStep = function(value) {
      vm.enabledStep = value;
    };

    //Directive Step Access
    vm.stepsChildList = [];

    function onStepChanged(activeStepPosition) {
      if(activeStepPosition <= vm.enabledStep) {
        updateStepsStyle();
        updateCompleteStepsClass();
        lastValidStep = activeStepPosition;

        var contentIndex = activeStepPosition - 1;
        if(contentIndex < 0){
          hideAllContents();
        } else {
          hideAllContents(vm.stepsChildList[contentIndex]);
        }

        StepsAPI.dispatchEvent($attrs.id, StepsAPI.events.typeEvent.STEP_CHANGE);

      } else {
        updateStepsStyle();
        console.warn('Step ' + activeStepPosition + ' is not enabled for the element "' + $attrs.id + '".');
        StepsAPI.dispatchEvent(
          $attrs.id,
          StepsAPI.events.typeEvent.STEP_CHANGE_NOT_ALLOWED,
          {requestedStepPosition: activeStepPosition}
        );
      }
    };

    function onEnabledStepChanged(enabledStepPosition) {
      updateStepsStyle();
      StepsAPI.dispatchEvent($attrs.id, StepsAPI.events.typeEvent.ENABLED_STEP_CHANGE);
    };

    //Event to update steps style
    var onReadyEvent = new StepsAPI.events.event($attrs.id, StepsAPI.events.typeEvent.READY, function(){
      $scope.$watch('vm.step', onStepChanged);
      $scope.$watch('vm.enabledStep', onEnabledStepChanged);
    });
    StepsAPI.addEvent(onReadyEvent);
  };

  //Directive Step
  function Step() {
    return {
      restrict: 'E',
      scope: {
        icon: '@',
        title: '@'
      },
      controller: StepController,
      controllerAs: 'vm',
      template: '<div ng-class="{\'button-mode\': vm.buttonMode, \'complete\': vm.isComplete, \'incomplete\': !vm.isComplete}" class="step" ng-click="vm.showContent()">'+
                '<div class="step-line-enabled"></div>'+
                '<i class="step-icon material-icons md-18">{{icon}}</i>'+
                '<span class="step-title">{{title}}</span>'+
                '</div>'
    }
  };

  // Controller for Step
  StepController.childrenFilter = {}; //Verify if child (step) is ready
  function StepController($scope, $attrs, StepsAPI) {
    var vm = this;
    vm.buttonMode = false;
    vm.isComplete = false;

    if($attrs.ref){
      document.getElementById($attrs.ref).classList.add('ws-steps-content-hidden');
      $scope.$parent.$parent.vm.stepsChildList.push($attrs.ref);
    }

    var stepsNavigationScope = $scope.$parent.$parent.vm;

    if(!StepController.childrenFilter[stepsNavigationScope.getElementId()]){
      StepController.childrenFilter[stepsNavigationScope.getElementId()] = 1;
    } else {
      StepController.childrenFilter[stepsNavigationScope.getElementId()]++;
    }

    var expectedSteps = stepsNavigationScope.getTotalSteps();
    var currentTotalSteps = StepController.childrenFilter[stepsNavigationScope.getElementId()];
    
    $attrs.$set('position', currentTotalSteps);

    if(expectedSteps === currentTotalSteps) {
      delete StepController.childrenFilter[stepsNavigationScope.getElementId()];
      StepsAPI.dispatchEvent(
        stepsNavigationScope.getElementId(),
        StepsAPI.events.typeEvent.READY
      );
    }

    vm.showContent = function(){
      if($attrs.position <= stepsNavigationScope.enabledStep){
        stepsNavigationScope.setStep($attrs.position);
      } else {
        StepsAPI.dispatchEvent(
          stepsNavigationScope.getElementId(),
          StepsAPI.events.typeEvent.STEP_CHANGE_NOT_ALLOWED,
          {requestedStepPosition: $attrs.position}
        );
      }
    };
  };

  //Directive StepContent
  function StepContent(){
    return {
      restrict: 'E',
      link: function(scope, element, attrs){
        element.addClass('ws-steps-content-hidden');
      }
    }
  };

  angular.module('wsSteps', ['ngMaterial'])
  .factory('StepsAPI', StepsAPI)
  .factory('StepColors', StepColors)
  .directive('steps', Steps)
  .directive('step', Step)
  .directive('stepContent', StepContent);
}());