'use strict';

/**
 * @ngdoc function
 * @name devfestApp.controller:ScheduleCtrl
 * @description
 * # ScheduleCtrl
 * Controller of the devfestApp
 */
angular.module('devfestApp')
  .controller('ScheduleCtrl', function($scope, Ref, $firebaseArray, $timeout, $uibModal, $window, $location, Config) {
    $scope.sessions = $firebaseArray(Ref.child('sessions'));
    
    $scope.sessionTimes = [];
    Ref.child('sessions').orderByChild('time').on('value', function(snap) {
      var sessions = snap.val(), x;
      for (x in sessions) {
        var time = sessions[x].time;
        if ($scope.sessionTimes.indexOf(time) == -1) {
          $scope.sessionTimes.push(time);
        }
      }
    });
    
    $scope.openFormModal = function(session) {
      $scope.session = session;
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modalSessionForm.html',
        controller: 'SessionFormModalCtrl',
        resolve: {
          session: function() {
            return $scope.session;
          }
        }
      });
      modalInstance.result.then(function(results) {
        if (results.action === 'add') {
          $scope.add(results.session);
        } else if (results.action === 'edit') {
          $scope.edit(results.session);
        }
      });
    };

    $scope.openInfoModal = function(session) {
      $scope.session = session;
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modalSessionContent.html',
        controller: 'SessionModalCtrl',
        resolve: {
          session: function() {
            return $scope.session;
          }
        }
      });
      modalInstance.result.then(function(results) {
        if (results.action === 'delete') {
          $scope.delete(results.session);
        } else if (results.action === 'edit') {
          $scope.openFormModal(results.session);
        }
      });
    };
    
    $scope.getTime = function(time) {
      var sHour = time.substring(0, time.indexOf(':'));
      var sMinutes = time.substring(time.indexOf(':')+1, time.indexOf(':')+3);
      var event = parseDate(Config.eventDate);
      return new Date(event.getFullYear(), event.getMonth(), event.getDate(), sHour, sMinutes, 0);
    };
    
    $scope.getEndTime = function(time) {
      var sessionTime = $scope.getTime(time);
      var newTime = sessionTime.getTime();
      newTime += parseInt(Config.sessionLength);
      return new Date(newTime);
    };
    
    function parseDate(str) {
      var d = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      return (d) ? new Date(d[1], d[2]-1, d[3]) : new Date();
    }

    $scope.add = function(session) {
      $scope.sessions.$add(session);
    };

    $scope.edit = function(session) {
      $scope.sessions.$save(session);
    };
  
    $scope.delete = function(session) {
      $scope.sessions.$remove(session);
    };
    
    $scope.$on('$viewContentLoaded', function() {
      $window.ga('send', 'pageview', { page: $location.path() });
    });
  });

/**
 * @ngdoc function
 * @name devfestApp.controller:SessionFormModalCtrl
 * @description
 * # SessionFormModalCtrl
 * Controller of the devfestApp
 */
angular.module('devfestApp')
  .controller('SessionFormModalCtrl', function($scope, Ref, $firebaseArray, $uibModalInstance, session) {
    $scope.speakers = $firebaseArray(Ref.child('speakers'));
    $scope.session = session;
    $scope.err = null;
    
    $scope.saveSession = function(session) {
      if (session && session.$id) {
        $uibModalInstance.close({
          'action': 'edit',
          'session': session
        });
      } else if (session) {
        $uibModalInstance.close({
          'action': 'add',
          'session': session
        });
      } else {
        $scope.err = 'Please fill out the form or click Cancel to close.';
      }
    };
    
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });

/**
 * @ngdoc function
 * @name devfestApp.controller:SessionModalCtrl
 * @description
 * # SessionModalCtrl
 * Controller of the devfestApp
 */
angular.module('devfestApp')
  .controller('SessionModalCtrl', function($scope, Ref, $firebaseArray, $uibModalInstance, $confirm, $window, Config, session) {
    $scope.speakers = $firebaseArray(Ref.child('speakers'));
    $scope.session = session;
    var postText = 'Check out this talk "' + session.title + '" only at #' + Config.eventName.replace(/ /g, '');
    var today = new Date();
    
    function parseDate(str) {
      var d = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      return (d) ? new Date(d[1], d[2]-1, d[3]) : new Date();
    }

    var event = parseDate(Config.eventDate);
    var eventDate = new Date(event.getFullYear(), event.getMonth(), event.getDate(), 0, 0, 0);
    var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    $scope.event = eventDate.getTime();
    $scope.today = todayDate.getTime();
  
    $scope.showSurvey = $scope.today == $scope.event;
    
    $scope.shareTwitter = function(session) {
      $window.open('//twitter.com/share?text=' + encodeURIComponent(postText) + '&url=' + Config.eventURL, '_blank');
    };
    
    $scope.openSurvey = function(session) {
      $window.open(session.surveyLink, '_blank');
    };
    
    $scope.openVideo = function(session) {
      $window.open(session.videoLink, '_blank');
    };
    
    $scope.openSlides = function(session) {
      $window.open(session.slidesLink, '_blank');
    };

    $scope.editSession = function(session) {
      $uibModalInstance.close({
        'action': 'edit',
        'session': session
      });
    };

    $scope.deleteSession = function(session) {
      $confirm({text: 'Are you sure you want to delete "' + session.title + '"? (this cannot be undone)'})
        .then(function() {
          $uibModalInstance.close({
            'action': 'delete',
            'session': session
          });
        });
    };
    
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  });

