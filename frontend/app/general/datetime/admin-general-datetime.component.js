(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')

  .component('adminGeneralDatetime', {
    templateUrl: '/admin/app/general/datetime/admin-general-datetime.html',
    bindings: {
      datetime: '='
    }
  });
})(angular);
