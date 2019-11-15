var walletPluginObj = (function(winodw) {
    // Device environment collection
    var ua = navigator.userAgent,
        envMap = [{
                deviceType: /Android/i.test(ua),
                bridge: connectWebViewJavascriptBridge
            },
            {
                deviceType: /iPhone|iPod|iPad/i.test(ua),
                bridge: setupWebViewJavascriptBridge
            }]
    // Get current device environment
    var currentEnv = envMap.filter(function (item) {
        return item.deviceType
    })[0]
    // Get the bridge method corresponding to the current device environment 
    var currentBridge = currentEnv ? currentEnv.bridge : null

    // Evoke app method
    function callhandler(name, query, callback) {
        currentBridge(function (bridge) {
            bridge.callHandler(name, query, callback)
        })
    }

    // Register app to invoke JS method
    function registerhandler(name, callback) {
        currentBridge(function (bridge) {
            bridge.registerHandler(name, function (data, responseCallback) {
                callback(data, responseCallback)
            })
        })
    }

    // Web plug-in method call 
    function callWebPlugin(name, query, callback, error) {
        switch (name) {
            // Access to account information 
            case 'getAddressInfo':
                var res = {}
                WalletPlugins.getDefaultAccount().then(function (resp) {
                    res.result = resp
                    res.errorCode = 0
                    callback(res)
                }, function (err) {
                    res.errorMsg = err.message
                    error(res)
                })
                break;
            // Transfer
            case 'walletPluginTransfer':
                var res = {}
                WalletPlugins.requestPay(query.collectionAddress, Number(query.amount), query.inputData, query.gas, function (err, data) {
                    if (err === null) {
                        res.result = data
                        res.errorCode = 0
                        return callback(res)
                    }
                    res.errorMsg = err.message
                    error(res)
                }).then(function () {}, function (err) {
                    res.errorMsg = err.message
                    error(res)
                })
                break;
        }
    }

    //WebView interaction object 
    function webviewActive() {}

    webviewActive.prototype.walletPlugin = function (name, query, callback, error) {
        if (currentBridge) {
            // App interface call 
            return callhandler(name, query, function (res) {
                var response = Object.prototype.toString.call(res) === '[object Object]' ? res : JSON.parse(res)
                // callback(response)
                if (response.errorCode === "0") {
                    if (response.result.code) {
                        response.errorCode = response.result.code
                        response.errorMsg = response.result.msg
                    }
                    if (response.result.data) {
                        response.result = response.result.data
                    }
                    callback(response)
                } else {
                    error(response)
                }
            })
        } else {
            // Web plug-in interface call 
            try {
                callWebPlugin(name, query, callback, error)
            } catch (err) {
                var errMsg = err.trim ? (err.trim() === 'ReferenceError: Wallet is not defined' ? 'please install wallet plugin!' : err) : err
                error({
                    errorMsg: errMsg
                })
            }
        }
    }



    // IOS Bridge
    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            return callback(window.WebViewJavascriptBridge)
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback)
        }
        window.WVJBCallbacks = [callback]
        var WVJBIframe = document.createElement('iframe')
        WVJBIframe.style.display = 'none'
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
        document.documentElement.appendChild(WVJBIframe)
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
        }, 0)
    }

    // Android Bridge 
    function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function () {
                    callback(WebViewJavascriptBridge)
                },
                false
            );
        }
    }
    return new webviewActive()
})(window)

// Initialization 
if (typeof walletInitFunc == "undefined") {
    walletInitFunc = walletPluginObj;
};


