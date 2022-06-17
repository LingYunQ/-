<template>
<div class="dada">
  <div class="container">
  <div class="welcome">
    <div class="pinkbox">
      <!-- 注册 -->
      <div class="signup nodisplay">
        <h1 v-if="isshow">Sweep the login code<span><img  class="siaze" @click="isShows" src="@/assets/img/qiehuan.png" alt=""></span> </h1>
        <form v-if="isshow" autocomplete="off">
          <img v-show="fontShow" class="fontsize" src="@/assets/img/jiazai.png" >
           <p v-show="fontShow" style="margin-top:10px;" class="chenggongla">Loding...</p>
          <img v-show="QrcodeShow" class="Qrcodesize" :src="base64QRCode">
          <img v-show="SumQude"  class="musegaSUem" src="@/assets/img/chenggong.png">
          <p v-show="SumQude" class="chenggongla">扫码成功</p>
          <p v-show="SumQude" class="chenggongla">请确认登录</p>
        </form>
        <h1 v-if="!isshow">Register<span><img  class="siaze" @click="isShows" src="@/assets/img/qiehuan.png" alt=""></span></h1>
        <form v-if="!isshow" autocomplete="off">
          <input type="text" placeholder="Username">
          <input type="email" placeholder="Email">
          <input type="password" placeholder="Password">
          <input type="password" placeholder="Confirm Password">
          <button type="button" class="button submit">Create Account</button>
        </form>
      </div>

      <!-- 登录 -->
      <div class="signin">
        <h1>Sign In</h1>
        <form class="more-padding" autocomplete="off">
          <input v-model="loginForm.phoneNum" type="text" placeholder="Username">
          <input v-model="loginForm.password" type="password" placeholder="Password">
          <button @click="login" type="button" class="buttom sumbit">Login</button>
        </form>
      </div>
    </div>

    <div class="leftbox">
      <h2 class="title"><span>BLOOM</span>&<br>BOUQUET</h2>
      <p class="desc">Pick your perfect <span>bouquet</span></p>
      <img class="flower smaller" src="@/assets/img/xiaoxin2.webp" />
      <p class="account">Have an account?</p>
      <button class="button" type="button" id="signin">Login</button>
    </div>

    <div class="rightbox">
      <h2 class="title"><span>BLOOM</span>&<br>BOUQUET</h2>
      <p class="desc">Pick your perfect <span>bouquet</span></p>
      <img class="flower" src="@/assets/img/xiaoxin1.webp" />
      <p class="account">Want to log in using qr code</p>
      <button class="button" type="button" id="signup">Scan QR Codes</button>
    </div>
  </div>

</div>   
  
</div>
</template>
<script>
import $ from 'jquery'
export default {
  name: "Login",
  props: {
    isRegisteredShow: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      SumQude:false,
      // 加载中
      fontShow:false,
      // 二维码隐藏
      QrcodeShow:false,
      isshow:false,
      Qrcode:'',
      timer2:null,//定时器
      loginForm: {
        password: "",
        phoneNum: "",
      },
      base64QRCode:''
    };
  },
  created(){
    this.StatusofTWODIMENSIONALcode()
    this.Qrcodelogin()
  },
  mounted(){
		var that = this;
    that.timer2 = setInterval(function(){
			that.StatusofTWODIMENSIONALcode();
		},1000)
   $(function(){
    // 注册
    $('#signup').click(function() {
    $('.pinkbox').css('transform', 'translateX(80%)');
    $('.signin').addClass('nodisplay');
    $('.signup').removeClass('nodisplay');
  });
   // 登录
    $('#signin').click(function() {
    $('.pinkbox').css('transform', 'translateX(0%)');
    $('.signup').addClass('nodisplay');
    $('.signin').removeClass('nodisplay');
  });
  });
  
  },
  methods: {
    // 事件
    isShows(){
      this.isshow = !this.isshow
    },
    // 点击登录按钮的回调
    login () {
      // console.log("提交表单");
      this.loginByCellphone();
    },
    // 二维码---获取key
    async Qrcodelogin(){
      let result = await this.$request("/login/qr/key", {
      });
      // console.log(result);
       // 二维码---生成图
      let timestamp = Date.parse(new Date());
      let result2 = await this.$request(`/login/qr/create`, {
        key:result.data.data.unikey,
        qrimg:result.data.data.unikey,
        timestamp
      });
     this.base64QRCode = result2.data.data.qrimg
      // console.log(result2);
    },
    // 二维码状态信息
    async StatusofTWODIMENSIONALcode(){
       let result = await this.$request("/login/qr/key", {
      });
      let timestamp = Date.parse(new Date());
       let result3 = await this.$request(`/login/qr/check`, {
        key:result.data.data.unikey,
        timestamp
      });
      // console.log(result3);
      this.Qrcode = result3.data.code
      if(result3.data.code == 803){
      this.$message.success("登录成功!");
        // 刷新页面
      this.$router.replace('/discover');
      }
    },
    //   手机登录请求
    async loginByCellphone () {
      let timestamp = Date.parse(new Date());
      let result = await this.$request("/login/cellphone", {
        phone: this.loginForm.phoneNum,
        password: this.loginForm.password,
        withCredentials: true,
        timestamp,
      });
      // console.log(result);
      // 登录成功
      if (result.data.code == 200) {
        // 将请求到的用户id存入localstorage
        // 在index.vue 和 bottomControl.vue中用到过
        window.localStorage.setItem("userId", result.data.profile.userId);
        // this.userInfo = result.data.profile;
        // 将userInfo传回父组件
        // this.$emit("getUserInfo", result.data.profile);

        this.$message.success("登录成功!");
        // 刷新页面
        this.$router.replace('/discover');
        // 修改vuex中的登录状态
        this.$store.commit("updataLoginState", true);
      } else if (result.data.code == 400) {
        // 手机号错误
        this.$message.error("手机号错误!");
        return;
      } else if (result.data.code == 502) {
        // 密码错误
        this.$message.error("密码错误!");
        return;
      } else {
        // 登录失败，请稍后重试
        this.$message.error("登录失败，请稍后重试!");
        return;
      }

      // 清空输入框的内容
      this.loginForm.password = "";
      this.loginForm.phoneNum = "";
    },
  },
 watch: {//监视属性
                Qrcode: {//监视一个必须存在的属性，
                    // 包括data中的一般属性、computed中的计算属性
                    // 属性值改变，则触发handler
                    immediate: true, //初始化时，即调用一次，认为值改变
                    handler(newValue){
                      console.log(newValue);
                    if(newValue === 800){
                      this.fontShow = true
                      this.QrcodeShow = false
                      this.SumQude = false
                    }
                       if(newValue === 801){
                      this.fontShow = false
                      this.QrcodeShow = true
                       this.SumQude = false
                      }
                      if(newValue === 802){
                        this.QrcodeShow = false
                        this.SumQude = true
                        this.$message.success("请确认登录!");
                      }
                      if(newValue === 803){
                        clearInterval(that.timer2);
                        }
                    },
                },
            },
}
</script>

<style scoped>
.chenggongla{
  font-family: "Open Sans", sans-serif;
  text-align: center;
  text-transform: uppercase;
  color: #f6f6f6;
  font-size: 20px;
  letter-spacing: 8px;
}
.musegaSUem{
  margin-top: 30px;
  width: 130px;


}
.Qrcodesize{
  margin-top: 50px;
  width: 150px;
}
@-webkit-keyframes rotation {
	from {
		-webkit-transform: rotate(0deg);
	}
	to {
		-webkit-transform: rotate(360deg);
	}
}
.fontsize{
  margin-top: 100px;
  width: 50px;
  -webkit-transform: rotate (360deg);
	animation: rotation 1s linear infinite;
	-moz-animation: rotation 1s linear infinite;
	-webkit-animation: rotation 1s linear infinite;
	-o-animation: rotation 1s linear infinite;
}
.siaze{
  height: 20px;
  width: 20px;
}
.dada{
 background: #cbc0d3;
 height: 605px;
}
/* 容器的样式 */
.container {
  margin: auto;
  width: 650px;
  height: 350px;
  position: relative;
}

.welcome {
  background: #f6f6f6;
  width: 650px;
  height: 415px;
  position: absolute;
  top: 25%;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
}

.pinkbox {
  position: absolute;
  top: -10%;
  left: 5%;
  background: #eac7cc;
  width: 320px;
  height: 500px;
  border-radius: 5px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease-in-out;
  z-index: 2;
}

.nodisplay {
  display: none;
  transition: all 0.5s ease;
}

.leftbox, .rightbox {
  position: absolute;
  width: 50%;
  transition: 1s all ease;
}

.leftbox {
  left: -2%;
}

.rightbox {
  right: -2%;
}

/* 字体和按钮的样式 */
h1 {
  font-family: "Open Sans", sans-serif;
  text-align: center;
  margin-top: 95px;
  text-transform: uppercase;
  color: #f6f6f6;
  font-size: 2em;
  letter-spacing: 8px;
}

.title {
  font-family: "Lora", serif;
  color: #8e9aaf;
  font-size: 1.8em;
  line-height: 1.1em;
  letter-spacing: 3px;
  text-align: center;
  font-weight: 300;
  margin-top: 20%;
}

.desc {
  margin-top: -8px;
}

.account {
  margin-top: 200px;
  font-size: 10px;
}

p {
  font-family: "Open Sans", sans-serif;
  font-size: 0.7em;
  letter-spacing: 2px;
  color: #8e9aaf;
  text-align: center;
}

span {
  color: #eac7cc;
}

.flower {
  position: absolute;
  width: 130px;
  height: 130px;
  top: 45%;
  left: 27%;
  opacity: 0.8;
}

.smaller {
  width: 130px;
  height: 130px;
  top: 48%;
  left: 30%;
  opacity: 0.9;
}

button {
  padding: 12px;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 11px;
  border-radius: 10px;
  margin: auto;
  outline: none;
  display: block;
}

button:hover {
  background: #eac7cc;
  color: #f6f6f6;
  transition: background-color 1s ease-out;
}

.button {
  margin-top: 3%;
  background: #f6f6f6;
  color: #ce7d88;
  border: solid 1px #eac7cc;
}

/* 表单样式 */
form {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 7px;
}

.more-padding {
  padding-top: 35px;
}

.more-padding input {
  padding: 12px;
}

.more-padding .sumbit {
  margin-top: 45px;
}

.sumbit {
  margin-top: 25px;
  padding: 12px;
  border-color: #ce7d88;
}

.sumbit:hover {
  background: #cbc0d3;
  border-color: #bfb1c9;
}

input {
  background: #eac7cc;
  width: 65%;
  color: #ce7d88;
  border: none;
  border-bottom: 1px solid rgba(246, 246, 246, 0.5);
  padding: 9px;
  font-weight: 100;
}

input::placeholder {
  color: #f6f6f6;
  letter-spacing: 2px;
  font-size: 1.0em;
  font-weight: 100;
}

input:focus {
  color: #ce7d88;
  outline: none;
  border-bottom: 1.2px solid rgba(206, 125, 136, 0.7);
  font-size: 1.0em;
  transition: 0.8s all ease;
}

input:focus::placeholder {
  opacity: 0;
}

label {
  font-family: "Open Sans", sans-serif;
  color: #ce7d88;
  font-size: 0.8em;
  letter-spacing: 1px;
}

.checkbox {
  display: inline;
  white-space: nowrap;
  position: relative;
  left: -52px;
  top: 25px;
}

input[type=checkbox] {
  width: 15px;
  background: #ce7d88;
}

.checkbox input[type=checkbox]:checked + label {
  color: #ce7d88;
  transition: 0.5s all ease;
}
/*  */
.regEnter {
  width: 100%;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  margin: 15px auto 0;
}

.regEnter:hover {
  text-decoration: underline;
}

.loginInput {
  height: 25px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #999;
  padding-left: 5px;
  width: 175px;
}

.el-form {
  padding-top: 10px;
}

.loginButton {
  width: 100%;
  text-align: center;
}

.loginButton .el-button {
  width: 200px;
}
</style>
