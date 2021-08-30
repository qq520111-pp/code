const {
  validation
} = require("./tui-validation");

//表单规则
let rules = [{
  name: "mobile",
  rule: ["required", "isMobile"],
  msg: ["请输入手机号", "请输入正确的手机号"]
}, {
  name: "password",
  rule: ["required", "isEnAndNo"],
  msg: ["请输入密码", "密码为8~20位数字和字母组合"]
}, {
  name: "custom",
  rule: ["required"],
  msg: ["请输入自定义内容"],
  validator: [{
    msg: "内容不可包含非法字符***",
    method: (e)=>{
      console.log(e);
      return "123456"
    }
  }]
}, {
  name: "card",
  rule: ["required", "isIdCard"],
  msg: ["请输入密码", "输入正确的身份证"]
},];

//formData为表单submit事件返回数据，也可以手动拼装数据
let formData = {
  mobile: 13421008644,
  password: 'zz123456',
  custom: "test",
  card: '441423199802254716'
};
//进行表单检查
let checkRes = validation(formData, rules);
console.log(checkRes);
if (!checkRes) {
  //验证通过！
} else {
  //验证不通过，checkRes为返回提示信息
}