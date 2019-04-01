
var colorBall = "#CBFE5B"
var colorGreenHand="#1DA06E";
var colorWhiteHand="#FFFFFF";
var steptime = 2000;
var password = "712519";
//中英文切换
var AppName = "Alipay"; //支付宝
var Name = "Ant Forest"; //蚂蚁森林
var FindFriend = "View more friends"; //查看更多好友
var TheEnd = "The end"; //没有更多了
var Rank = "Green heroes"; //好友排行榜
var Home = "Home";//首页

unlock();
sleep(steptime);
mainEntrence();

function unlock(){
    if(!device.isScreenOn()){
    	//点亮屏幕
        device.wakeUp();
        sleep(steptime);

        swipe(650,2000,650,650,500);

        sleep(steptime);
        for(var i = 0;i<6;i++){
            desc(password[i]).findOne().click();
            sleep(100);
        }
        sleep(steptime);
    } 
}
function tLog(msg) {
    toast(msg);
    console.log(msg);
}
function defaultException() {
    tLog("程序当前所处状态不合预期,脚本退出");
    exit();
}
function registEvent() {
    //启用按键监听
    events.observeKey();
    tLog("启用按键控制");
    sleep(steptime);
    //监听音量上键按下
    events.onKeyDown("volume_down", function(event){
        tLog("脚本手动退出");
        exit();
    });
    
}
function prepareThings(){
    setScreenMetrics(1080, 2340);
    //请求截图
   if(!requestScreenCapture()){
        tLog("请求截图失败");
        exit();
    }  
    else{
        tLog("请求截图成功");
        sleep(steptime);
    }
}
function enterMyMainPage(){
    launchApp(AppName);
    sleep(steptime);
    tLog('进入支付宝');
    sleep(steptime);
	click(Home);
	sleep(steptime);
    click(Name);
    sleep(steptime);
    tLog("进入主页");
    sleep(steptime);
    //等待进入自己的主页
}
function enterRank(){
    sleep(steptime);
    swipe(520,2100,520,500,500);
    sleep(steptime);
    swipe(520,2000,520,500,500);
    sleep(steptime);
    desc(FindFriend).findOne().click();
    sleep(steptime);
    tLog("进入排行榜");
    //等待排行榜主页出现
    sleep(steptime);
}
function getCaptureImg(){
    var img0 = captureScreen();
    if(img0==null || typeof(img0)=="undifined"){
        tLog("截图失败,退出脚本");
        exit();
    }else{
        return img0;
    }
}
function isRankEnd() {
    if(descEndsWith(TheEnd).exists()){
        var b=descEndsWith(TheEnd).findOne();
        var bs=b.bounds();
        if(bs.centerY()<2340){
            return true;
        }
    }
    return false;
}
function enterOthers(){
    var BeforePointx = 0;
    var BeforePointy = 0;
    var i = 0;
    while(true){
        var img = getCaptureImg();
        var point = findColor(img, colorGreenHand);
        if(point == null && textEndsWith(Rank).exists()){
            swipe(520,1800,520,500,1000);
            i++;
        }
        else{
            antX=point.x;
            antY=point.y;
            if(BeforePointx != antX || BeforePointy != antY){
                BeforePointx = antX;
                BeforePointy = antY;
                click(antX-100,antY+70);
                sleep(steptime);
                collectionEnergy();
                sleep(steptime);
                //帮好友浇一次水
                click(975,1510);
                sleep(steptime);

                back();
            }
            else{
                swipe(520,2000,520,1800,1000);
            }
        }
        sleep(steptime);
        if(isRankEnd()){
            break;
        }
        //如果连续5次都未检测到可收集好友,无论如何停止查找(由于程序控制了在排行榜界面,且判断了结束标记,基本已经不存在这种情况了)
        else if(i>5){
            tLog("程序可能出错,连续"+i+"次未检测到可收集好友");
            exit();
        }
    }
}
function collectionEnergy(){
    var img = captureScreen();
    var point = findColor(img, colorBall);
    var num = 0;
    while(point && num<6){
            var antX=point.x;
            var antY=point.y;
            sleep(steptime);
            if(antX >= 150 && antX <=950 && antY >= 380 && antY <=1100){
                click(antX,antY);
                tLog("收取一个能量球");
                sleep(steptime);
            }
            else{
                tLog("正在搜寻可收取的能量...");
            }
            num++;
        var point = findColor(img, colorBall);
    }

    tLog("能量收集完成");
    sleep(steptime);
    
}
function whenComplete() {
    tLog("结束");
    back();
    sleep(steptime);
    back();
    sleep(steptime);
    back();
    exit();
}
function mainEntrence(){
    //前置操作
    prepareThings();
    //注册音量下按下退出脚本监听
    registEvent();
    //从主页进入蚂蚁森林主页
    enterMyMainPage();
    //收集自己的能量
    collectionEnergy();
    //进入排行榜
    enterRank();
    //在排行榜检测是否有好有的能量可以收集
    enterOthers();
    //结束后返回主页面
    whenComplete();
}
