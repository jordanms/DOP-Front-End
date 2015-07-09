define(['app'], function(app)
{
    app.controller('aboutController', ['$scope', "serverCallService", "$filter", '$rootScope', 'translationService', '$sce', 
    		function($scope, serverCallService, $filter, $rootScope, translationService, $sce) {
    	
    	$rootScope.isStaticPage = true;
    	
    	$rootScope.getPage = function (pageLanguage) {
	        var pageName = "about";
	
	        var params = {};
	        var url = "rest/page?pageName=" + pageName + "&pageLanguage=" + pageLanguage;
	    	serverCallService.makeGet(url, params, getPageSuccess, getPageFail);
    	}
    	
    	$scope.getPage(translationService.getLanguage());
    	
    	function getPageSuccess(data) {

            if (isEmpty(data)) {
                console.log('No data returned.');
                } else {
                        $scope.pageContent = $sce.trustAsHtml(data.content);
                }
    	}
    	
    	function getPageFail(data, status) {
            console.log('Getting page failed.')
    	}
    	
    	$scope.$on("$destroy", function() {
    		$rootScope.isStaticPage = false;
        });
    }]);
});