
'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminDomainsService', function() {

  var $rootScope;
  var domainAPI, ADMIN_DOMAINS_EVENTS;
  var adminDomainsService, adminJamesClientProvider, adminDomainConfigService;
  var $windowMock, jamesClientInstanceMock;

  beforeEach(function() {
    module('linagora.esn.admin');

    jamesClientInstanceMock = {};

    $windowMock = {
      james: {
        Client: function() {
          return jamesClientInstanceMock;
        }
      }
    };

    angular.mock.module(function($provide) {
      $provide.value('$window', $windowMock);
    });

    inject(function(
      _$rootScope_,
      _adminDomainsService_,
      _domainAPI_,
      _adminJamesClientProvider_,
      _adminDomainConfigService_,
      _ADMIN_DOMAINS_EVENTS_
    ) {
      $rootScope = _$rootScope_;
      adminDomainsService = _adminDomainsService_;
      domainAPI = _domainAPI_;
      adminJamesClientProvider = _adminJamesClientProvider_;
      adminDomainConfigService = _adminDomainConfigService_;
      ADMIN_DOMAINS_EVENTS = _ADMIN_DOMAINS_EVENTS_;

      jamesClientInstanceMock.createDomain = sinon.stub().returns($q.when());
      adminJamesClientProvider.get = sinon.stub().returns($q.when(jamesClientInstanceMock));
      adminDomainConfigService.get = function() {
        return $q.when({});
      };
    });
  });

  describe('The create method', function() {
    it('should reject if domain is undefined', function(done) {
      adminDomainsService.create()
        .catch(function(err) {
          expect(err.message).to.equal('Domain is required');
          done();
        });

      $rootScope.$digest();
    });

    it('should broadcast an event when sucessfully to create domain', function(done) {
      domainAPI.create = sinon.stub().returns($q.when({ data: {} }));
      $rootScope.$broadcast = sinon.spy();
      var domain = {};

      adminDomainsService.create(domain).then(function() {
        expect(domainAPI.create).to.have.been.calledWith(domain);
        expect(jamesClientInstanceMock.createDomain).to.have.been.calledWith(domain.name);
        expect($rootScope.$broadcast).to.have.been.calledWith(ADMIN_DOMAINS_EVENTS.DOMAIN_CREATED, domain);

        done();
      });

      $rootScope.$digest();
    });
  });
});
