'use strict';

/**
 * @ngdoc function
 * @name devfestApp.controller:PushCtrl
 * @description
 * # PushCtrl
 * Controller of the devfestApp
 */
angular.module('devfestApp')
  .controller('PushCtrl', function($scope, $http, Ref, $firebaseArray, Config) {
    $scope.pushTitle = Config.eventName + ' Update';
    $scope.pushMessage = 'This is only a test right now but we will post session/speaker updates here soon!';
    $scope.accounts = [];
    $scope.notifications = $firebaseArray(Ref.child('notifications'));
    $scope.selectedItems = 0;
    $scope.tokens = [];
    
    var users = Ref.child('users');
    users.orderByChild('token').on('value', function(snap) {
      if (snap.numChildren() > 0) {
        snap.forEach(function(data) {
          if (data.hasChild('token')) {
            $scope.accounts.push({
              uid: data.child('uid').val(),
              name: data.child('name').val(),
              token: data.child('token').val()
            });
          }
        });
      } else {
        console.log('No tokens have been registered');
      }
    });

    $scope.$watch('accounts', function(items) {
      var selectedItems = 0;
      angular.forEach(items, function(item) {
        selectedItems += item.selected ? 1 : 0;
      });
      $scope.selectedItems = selectedItems;
    }, true);
    
    $scope.checkAll = function() {
      if ($scope.selectedAll) {
        $scope.selectedAll = false;
      } else {
        $scope.selectedAll = true;
      }
      angular.forEach($scope.accounts, function(item) {
        item.selected = $scope.selectedAll;
      });
    };
    
    $scope.sendPush = function() {
      angular.forEach($scope.accounts, function(value, key) {
        if (value.selected) {
          this.push(value.token);
        }
      }, $scope.tokens);
      
      $scope.recipients = [];
      angular.forEach($scope.accounts, function(value, key) {
        if (value.selected) {
          this.push(value);
        }
      }, $scope.recipients);
      
      // Build the request object
      var req = {
        method: 'POST',
        url: 'https://push.ionic.io/api/v1/push',
        headers: {
          'Content-Type': 'application/json',
          'X-Ionic-Application-Id': Config.ionicId,
          'Authorization': 'basic ' + Config.ionicAPI
        },
        data: {
          'tokens': $scope.tokens,
          'schedule': '',
          'notification': {
            'alert': $scope.pushMessage,
            'android': {
              'title': $scope.pushTitle,
              'style': 'inbox',
              'summaryText': 'There are %n% notifications',
              'payload': {}
            },
            'ios': {
              'title': $scope.pushTitle,
              'payload': {}
            }
          }
        }
      };
      
      // Make the API call
      $http(req).success(function(resp) {
        // Handle success
        $scope.messageId = resp.message_id;
        // store record of notification
        var notification = {
          messageId: $scope.messageId,
          title: $scope.pushTitle,
          message: $scope.pushMessage,
          sent: $scope.recipients.length,
          recipients: $scope.recipients,
          tokens: $scope.tokens
        };
        $scope.notifications.$add(notification);
        console.log('Ionic Push: Push success!');
      }).error(function(error) {
        // Handle error 
        console.log('Ionic Push: Push error...');
        console.error(error);
      });
    };
    
    $scope.checkStatus = function() {
      // Build the request object
      var req = {
        method: 'GET',
        url: 'https://push.ionic.io/api/v1/status/' + $scope.messageId,
        headers: {
          'Content-Type': 'application/json',
          'X-Ionic-Application-Id': Config.ionicId,
          'Authorization': 'basic ' + Config.ionicAPI
        }
      };
      // Make the API call
      $http(req).success(function(resp) {
        // Handle success
        $scope.messageDetails = resp;
      }).error(function(error) {
        // Handle error 
        console.error(error);
      });
    };
  });
