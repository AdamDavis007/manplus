# chrome plugin

# Please use js
 `<script src="***/dqSeriesWallet.js.js"></script>` 

# main function
 * walletInitFunc.walletPlugin(接口名，接口参数，成功回调，失败回调)
 * walletInitFunc.walletPlugin(name,query,function(res){},function(err){})
 
# error:
* no plugin
`errorMsg: {
	message: "WalletPlugins is not defined",
	stack: "ReferenceError: WalletPlugins is not defined
}`

* Please create wallet frist
`{errorMsg: "Please create wallet first"}`


# Interface
 
## getAddressInfo（Get user information）

`{} `
### Example
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

### Success
`{
	errorCode: 0,
	result: {
		address: "***gB2nfPjCZ6ArT6yEoE9UQwJ7s7y58***",
		balance: "0.01",
		status: "200"
	}
}`

 
## walletPluginTransfer（Transfer）

`{
    "amount",""   //transfer amount
    "collectionAddress", "" //To address
    "remark": "" // data 
}`
### Exanoke
`walletInitFunc.walletPlugin(
    "walletPluginTransfer",
    {
      amount: "1000000000000000000;", 
      collectionAddress: "***gB2nfPjCZ6ArT6yEoE9UQwJ7s7y58***",
      remark: "0x0001"
    },
    function(res) {
      console.log(res)
    },
    function(err) {
      console.log(err)
    }
);`

### Success
`{
	"errorCode": 0,
	"result": "***8b41a0f8ac7051f8a9480003dfb0fc78c1c1c1c9e2******" // The transaction hash
}`

### Reject transcation
`{
	errorMsg: "User denied transaction signature."
}`
