/**
 * WeUI
 * 
 * @author fbchen
 * @version 1.0 2016-08-04
 */
(function() {
    'use strict';

    angular.module('fb.weui', ['ngAnimate'])
        .constant('weuiConfig', {
            autoHideDelay: 2500,
            toastMsg: '操作成功',
            loadingToastMsg: '数据加载中',
            savingToastMsg: '数据提交中',
            btnOKText: '确定',
            btnCancelText: '取消'
        })
        
        // http://stackoverflow.com/questions/17417607/angular-ng-bind-html-and-directive-within-it
        .directive('compile', ['$compile', function ($compile) {
            return function(scope, element, attrs) {
                scope.$watch(
                    function(scope) {
                        // watch the 'compile' expression for changes
                        return scope.$eval(attrs.compile);
                    },
                    function(value) {
                        // when the 'compile' expression changes
                        // assign it into the current DOM
                        element.html(value);
        
                        // compile the new DOM and link it to the current
                        // scope.
                        // NOTE: we only compile .childNodes so that
                        // we don't get into infinite loop compiling ourselves
                        $compile(element.contents())(scope);
                    }
                );
            };
        }])
        
        .service('$weui', ['$rootScope', '$q', 'weuiConfig', function ($rootScope, $q, weuiConfig) {
            
            // 显示toast
            this.showToast = function(msg) {
                $rootScope.$emit('weui.toast.show', {msg: msg});
            }
            
            // 显示loading toast
            this.showLoadingToast = function(msg, autoHide) {
                $rootScope.$emit('weui.loading.toast.show', {msg: msg, autoHide: autoHide});
            }
            
            // 显示loading toast ()
            this.showSavingToast = function(msg, autoHide) {
                $rootScope.$emit('weui.loading.toast.show', {
                    msg: msg || weuiConfig.savingToastMsg, autoHide: autoHide
                });
            }
            
            // 隐藏loading toast
            this.hideLoadingToast = function() {
                $rootScope.$emit('weui.loading.toast.hide');
            }
            
            // 显示“确认”窗口
            this.confirm = function(title, content, btnOKText, btnCancelText) {
                var opt = angular.isObject(title) ? title : {
                    title: title, content: content,
                    btnOKText: btnOKText, btnCancelText: btnCancelText
                };
                var deferred = $q.defer();
                $rootScope.$emit('weui.confirm.dialog.show', {deferred: deferred, options: opt});
                return deferred.promise;
            }
            
            // 显示“警告”窗口
            this.alert = function(title, content, btnOKText) {
                var opt = angular.isObject(title) ? title : {
                    title: title, content: content,
                    btnOKText: btnOKText
                };
                var deferred = $q.defer();
                $rootScope.$emit('weui.alert.dialog.show', {deferred: deferred, options: opt});
                return deferred.promise;
            }
            
            // 显示Actionsheet
            this.actionsheet = function(menus, btnCancelText) {
                var opt = {menus: menus, btnCancelText: btnCancelText};
                var deferred = $q.defer();
                $rootScope.$emit('weui.actionsheet.show', {deferred: deferred, options: opt});
                return deferred.promise;
            }
        }])
        
        // Toast: <weui-toast></weui-toast>
        .directive('weuiToast', ['$rootScope', '$timeout', '$sce', 'weuiConfig', function($rootScope, $timeout, $sce, weuiConfig) {
            return {
                replace: true,
                restrict: 'EA',
                scope: true, // creates an internal scope for this directive
                template:
                   '<div class="weui-toast-container" ng-show="toasting">' +
                        '<div class="weui_mask_transparent"></div>' +
                        '<div class="weui_toast">' +
                            '<i class="weui_icon_toast"></i>' +
                            '<p class="weui_toast_content">{{toastMsg}}</p>' +
                        '</div>' +
                    '</div>',
                
                link: function (scope, element, attrs) {
                    // 显示toast
                    function showToast(data) {
                        if (scope.hideTimer) {
                            $timeout.cancel(scope.hideTimer);
                            scope.hideTimer = null;
                        }
                        
                        scope.toasting = true;
                        scope.toastMsg = data.msg || weuiConfig.toastMsg;
                        
                        // 延迟自动消失
                        if (data.autoHide) {
                            scope.hideTimer = $timeout(function() {
                                scope.toasting = false;
                            }, weuiConfig.autoHideDelay);
                        }
                    }
                    
                    $rootScope.$on('weui.toast.show', function (event, data) {
                        data = angular.extend({}, scope.$eval(attrs.toasterOptions), data);
                        data.autoHide = angular.isUndefined(data.autoHide) ? true : data.autoHide;
                        showToast(data);
                    });
                }
            }
        }])
        
        // Loading Toast: <weui-loading-toast></weui-loading-toast>
        .directive('weuiLoadingToast', ['$rootScope', '$timeout', '$sce', 'weuiConfig', function($rootScope, $timeout, $sce, weuiConfig) {
            return {
                replace: true,
                restrict: 'EA',
                scope: true, // creates an internal scope for this directive
                template:
                    '<div class="weui_loading_toast aweui-show" ng-show="toasting">' +
                        '<div class="weui_mask_transparent"></div>' +
                        '<div class="weui_toast">' +
                            '<div class="weui_loading">' +
                                '<div class="weui_loading_leaf weui_loading_leaf_0"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_1"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_2"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_3"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_4"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_5"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_6"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_7"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_8"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_9"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_10"></div>' +
                                '<div class="weui_loading_leaf weui_loading_leaf_11"></div>' +
                            '</div>' +
                            '<p class="weui_toast_content">{{toastMsg}}</p>' +
                        '</div>' +
                    '</div>',
                
                link: function (scope, element, attrs) {
                    // 显示toast
                    function showToast(data) {
                        if (scope.hideTimer) {
                            $timeout.cancel(scope.hideTimer);
                            scope.hideTimer = null;
                        }
                        
                        scope.toasting = true;
                        scope.toastMsg = data.msg || weuiConfig.loadingToastMsg;
                        
                        // 延迟自动消失
                        if (data.autoHide) {
                            scope.hideTimer = $timeout(function() {
                                scope.toasting = false;
                            }, weuiConfig.autoHideDelay);
                        }
                    }
                    
                    // 隐藏toast
                    function hideToast() {
                        scope.toasting = false;
                        if (scope.hideTimer) {
                            $timeout.cancel(scope.hideTimer);
                            scope.hideTimer = null;
                        }
                    }
                    
                    $rootScope.$on('weui.loading.toast.show', function (event, data) {
                        data = angular.extend({}, scope.$eval(attrs.toasterOptions), data);
                        showToast(data);
                    });
                    $rootScope.$on('weui.loading.toast.hide', function (event) {
                        hideToast();
                    });
                }
            }
        }])
        
        // Dialog: <weui-dialog></weui-dialog>
        .directive('weuiDialog', ['$rootScope', '$timeout', '$sce', '$animateCss', 'weuiConfig',
                  function($rootScope, $timeout, $sce, $animateCss, weuiConfig) {
            return {
                replace: true,
                restrict: 'EA',
                scope: true, // creates an internal scope for this directive
                template:
                    '<div ng-class="{weui_dialog_confirm: isConfirm, weui_dialog_alert: isAlert}" ng-show="dialoging">' +
                        '<div class="weui_mask"></div>' +
                        '<div class="weui_dialog">' +
                            '<div class="weui_dialog_hd"><strong class="weui_dialog_title">{{title}}</strong></div>' +
                            '<div class="weui_dialog_bd">{{content}}</div>' +
                            '<div class="weui_dialog_ft">' +
                                '<a href="javascript:;" class="weui_btn_dialog default" ng-click="cancel()" ng-if="isConfirm">{{btnCancelText}}</a>' +
                                '<a href="javascript:;" class="weui_btn_dialog primary" ng-click="confirm()">{{btnOKText}}</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
                
                link: function (scope, element, attrs) {
                    // 点击[取消]按钮
                    scope.cancel = function() {
                        scope.dialoging = false;
                        scope.deferred.reject();
                    }
                    
                    // 点击[确定]按钮
                    scope.confirm = function() {
                        scope.dialoging = false;
                        scope.deferred.resolve();
                    }
                    
                    // 显示dialog
                    function showDialog(data) {
                        scope.dialoging = true;
                        scope.deferred = data.deferred;
                        angular.extend(scope, data.options);
                        scope.btnOKText = scope.btnOKText || weuiConfig.btnOKText;
                        scope.btnCancelText = scope.btnCancelText || weuiConfig.btnCancelText;
                    }
                    
                    $rootScope.$on('weui.confirm.dialog.show', function (event, data) {
                        scope.isConfirm = true;
                        showDialog(data);
                    });
                    $rootScope.$on('weui.alert.dialog.show', function (event, data) {
                        scope.isAlert = true;
                        showDialog(data);
                    });
                }
            }
        }])
        
        /**
         * Actionsheet: <weui-actionsheet></weui-actionsheet>
         * 例子：
         *      $weui.actionsheet([{
         *          text: '示例菜单1', action: '1'
         *      }, {
         *          text: '示例菜单2', action: '2'
         *      }]).then(function(menu) {
         *          // do your job
         *      });
         */
        .directive('weuiActionsheet', ['$rootScope', '$timeout', '$sce', '$parse', '$compile', '$animateCss', 'weuiConfig',
                  function($rootScope, $timeout, $sce, $parse, $compile, $animateCss, weuiConfig) {
            return {
                replace: true,
                restrict: 'EA',
                scope: true, // creates an internal scope for this directive
                template:
                    '<div ng-show="isShowActionsheet">' +
                        '<div class="weui_mask_transition" style="display: block;" ng-show="isShowActionsheet"></div>' +
                        '<div class="" ng-class="[\'weui_actionsheet\', actionsheetToggle]">' +
                            '<div class="weui_actionsheet_menu">' +
                                '<div class="weui_actionsheet_cell" ng-repeat="menu in actionsheet.actionsheet_menu" ng-click="clickActionMenu($event, menu)">' +
                                    '{{menu.text}}' +
                                '</div>' +
                            '</div>' +
                            '<div class="weui_actionsheet_action">' +
                                '<div class="weui_actionsheet_cell" ng-click="closeActionMenu($event)">{{actionsheet.btnCancelText}}</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
                
                link: function (scope, element, attrs) {
                    // 点击[取消]按钮
                    scope.closeActionMenu = function() {
                        hideActionSheet();
                        scope.deferred.reject();
                    }
                    
                    // 点击菜单
                    scope.clickActionMenu = function($event, menu) {
                        hideActionSheet();
                        scope.deferred.resolve(menu);
                    }
                    
                    // 隐藏菜单
                    function hideActionSheet() {
                        scope.isShowActionsheet = false;
                        scope.actionsheetToggle = '';
                    }
                    
                    // 显示菜单
                    function showActionSheet(data) {
                        scope.deferred = data.deferred;
                        scope.actionsheet = data.options;
                        scope.actionsheet.btnCancelText = scope.actionsheet.btnCancelText || weuiConfig.btnCancelText;
                        
                        var actionsheet_menu = [];
                        angular.forEach(data.options.menus, function(menu) {
                            if (angular.isString(menu)) {
                                menu = {text: menu};
                            }
                            actionsheet_menu.push(menu);
                        });
                        scope.actionsheet.actionsheet_menu = actionsheet_menu;
                        
                        scope.isShowActionsheet = true;
                        scope.actionsheetToggle = 'weui_actionsheet_toggle';
                    }
                    
                    $rootScope.$on('weui.actionsheet.show', function (event, data) {
                        showActionSheet(data);
                    });
                }
            }
        }])
    
})(window, document);
