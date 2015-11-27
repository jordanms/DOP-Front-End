define(['app'], function(app)
{
    app.controller('addPortfolioDialog', ['$scope', '$mdDialog', '$location', 'serverCallService', '$rootScope',
        function($scope, $mdDialog, $location, serverCallService, $rootScope) {

            $scope.cancel = function() {
                $mdDialog.hide();
            };

            $scope.create = function() {
            	var url = "rest/portfolio/create";
            	var taxon = $scope.portfolio.taxon;
            	$scope.portfolio.taxon = null;
            	
				var params = {
					'taxon': taxon,
					'portfolio': $scope.portfolio
				};
				serverCallService.makePost(url, params, createPortfolioSuccess, createPortfolioFailed);
            }
            
            function createPortfolioSuccess(portfolio) {
            	if (isEmpty(portfolio)) {
            		createPortfolioFailed();
	            } else {
	            	$rootScope.portfolio = portfolio;
	            	$mdDialog.hide();
	                $location.url('/portfolio/edit?id=' + portfolio.id);
	            }
			}
			
			function createPortfolioFailed(){
				log('Creating portfolio failed.');
			}

            $scope.portfolio = {
            	type: ".Portfolio",
            	tags:[]
            };
        }
    ]);
});
