# 谷歌浏览器插件钱包

## HTML文件必须以IP服务形式打开（不能直接打开本地文件执行）

# 引入如下js
 `<script src="***/dqSeriesWallet.js.js"></script>` 

# 调用格式
 * walletInitFunc.walletPlugin(接口名，接口参数，成功回调，失败回调)
 * walletInitFunc.walletPlugin(name,query,function(res){},function(err){})
 
# 错误说明:
* 没有安装插件
`errorMsg: {
	message: "WalletPlugins is not defined",
	stack: "ReferenceError: WalletPlugins is not defined
}`

* 请先创建钱包
`{errorMsg: "Please create wallet first"}`


# 接口
 
## getAddressInfo（获取用户信息）

`{} //无参数请传空对象`
### 例
`walletInitFunc.walletPlugin(
    "getAddressInfo",
    {},
    function(res) {
        console.log(res)
    },
    function(err) {
        console.log(err)
    }
);`

### 成功返回
`{
	errorCode: 0,
	result: {
		address: "***gB2nfPjCZ6ArT6yEoE9UQwJ7s7y58***",
		balance: "0.01",
		status: "200"
	}
}`

 
## walletPluginTransfer（转账）

`{
    "amount",""   //转账金额
    "collectionAddress", "" //转账目标钱包的地址
    "remark": "" //备注
}`
### 例
`walletInitFunc.walletPlugin(
    "walletPluginTransfer",
    {
      amount: "100000000", 
      collectionAddress: "***gB2nfPjCZ6ArT6yEoE9UQwJ7s7y58***",
      remark: "备注"
    },
    function(res) {
      console.log(res)
    },
    function(err) {
      console.log(err)
    }
);`

### 成功返回
`{
	"errorCode": 0,
	"result": "***8b41a0f8ac7051f8a9480003dfb0fc78c1c1c1c9e2******" // 交易成功返回值
}`

### 用户拒绝
`{
	errorMsg: "User denied transaction signature."
}`
