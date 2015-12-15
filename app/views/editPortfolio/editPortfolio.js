define(['app'], function(app) {
  
    app.run(['$anchorScroll', function($anchorScroll) {
        $anchorScroll.yOffset = 50;
    }]);

    app.controller('editPortfolioController', ['$scope', 'translationService', 'serverCallService', '$route', '$location', 'alertService', '$rootScope', 'authenticatedUserService', 'dialogService', 'toastService', 'searchService', '$mdDialog',
        function($scope, translationService, serverCallService, $route, $location, alertService, $rootScope, authenticatedUserService, dialogService, toastService, searchService, $mdDialog) {

            function init() {
                if ($rootScope.savedPortfolio) {
                    setPortfolio($rootScope.savedPortfolio);
                } else {
                    getPortfolio(getPortfolioSuccess, getPortfolioFail);
                }

                $rootScope.isEditPortfolioMode = true;
                searchService.setType("material");
                searchService.setTargetGroups([]);
            }

            function getPortfolio(success, fail) {
                var portfolioId = $route.current.params.id;
                serverCallService.makeGet("rest/portfolio?id=" + portfolioId, {}, success, fail);
            }

            function getPortfolioSuccess(portfolio) {
                if (isEmpty(portfolio)) {
                    getPortfolioFail();
                } else {
                    setPortfolio(portfolio);
                    searchService.setTargetGroups(portfolio.targetGroups);
                }
            }

            function getPortfolioFail() {
                $rootScope.isEditPortfolioMode = false;
                log('No data returned by getting portfolio.');
                alertService.setErrorAlert('ERROR_PORTFOLIO_NOT_FOUND');
                $location.url("/");
            }

            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };

            $scope.showEditPortfolioDialog = function() {
                $mdDialog.show({
                    controller: 'addPortfolioDialog',
                    templateUrl: 'views/addPortfolioDialog/addPortfolioDialog.html',
                    locals: {
                        portfolio: portfolio
                    }
                });
            };

            $scope.onDeleteChapter = function(chapter) {
                var deleteChapter = function() {
                    $scope.portfolio.chapters.splice($scope.portfolio.chapters.indexOf(chapter), 1);
                };

                dialogService.showDeleteConfirmationDialog(
                    'PORTFOLIO_DELETE_CHAPTER_CONFIRM_TITLE',
                    'PORTFOLIO_DELETE_CHAPTER_CONFIRM_MESSAGE',
                    deleteChapter);
            };

            $scope.savePortfolio = updatePortfolio();
            
            function updatePortfolio() {
                var url = "rest/portfolio/update";
                serverCallService.makePost(url, $scope.portfolio, updatePortfolioSuccess, updatePortfolioFailed);
            }

            function updatePortfolioSuccess(portfolio) {
                if (isEmpty(portfolio)) {
                    createPortfolioFailed();
                } else {
                    setPortfolio(portfolio);
                    toastService.show("PORTFOLIO_SAVED");
                }
            }

            function updatePortfolioFailed() {
                log('Updating portfolio failed.');
            }

            function setPortfolio(portfolio) {
                $scope.portfolio = portfolio;
                $rootScope.savedPortfolio = portfolio;
                
                if (portfolio.visibility !== 'PRIVATE')
                    showWarning();
            }
            
            function showWarning() {
                var setPrivate = function() {
                    $scope.savedPortfolio.visibility = 'PRIVATE';
                    
                    updatePortfolio();
                }
                
                //TODO: Add those texts as translations
                dialogService.showConfirmationDialog(
                    'Kas soovid muuta kogumiku privaatseks?',
                    'Vastasel juhul on kõigile koheselt nähtavad tehtud muudatused.',
                    'Tee kogumik privaatseks',
                    'Jah, ma mõistan',
                    setPrivate);
            }

            init();
        }
    ]);
});