var game={
  RN:4,CN:4,//总行/列数
  data:null,//保存所有格子数据的二维数组
  score:0,//保存游戏得分
  state:1,//保存游戏状态
  RUNNING:1,//表示游戏运行中
  GAMEOVER:0,//表示游戏结束
  start(){//启动游戏
    this.state=this.RUNNING;
    this.score=0;//分数清零
    //this->game
    this.data=[];//创建空数组保存在data属性中
    ////r从0开始，到<RN结束
    for(var r=0;r<this.RN;r++){
      //新建一个CN个空元素的数组保存在data中r行
      this.data[r]=new Array(this.CN);
      //c从0开始，到<CN结束
      for(var c=0;c<this.CN;c++){
        this.data[r][c]=0;//将data中r行c列赋值为0
      }
    }//(遍历结束)
    //在空白位置随机生成2个数
    this.randomNum(); this.randomNum();
    this.updateView();//更新页面
    //为当前页面绑定键盘按下事件
    document.onkeydown=function(e){//this->document
      switch(e.keyCode){
        case 37: this.moveRow(1); break;
        case 38: this.moveCol(1); break;
        case 39: this.moveRow(-1); break;
        case 40: this.moveCol(-1); break;
      }
    }.bind(this);//用onkeydown外的this替换内部的this
  },
  randomNum(){//在随机空白位置生成一个随机2或4
    while(true){//反复:
      //在0~RN之间生成随机整数r
      var r=Math.floor(Math.random()*this.RN);
      //在0~CN之间生成随机整数c
      var c=Math.floor(Math.random()*this.CN);
      //如果data中r行c列的值等于0
      if(this.data[r][c]===0){
        //设置data中r行c列的值为:
        this.data[r][c]=Math.random()<0.5?2:4
        break;//退出循环
      }
    }
  },
  updateView(){//将data中数据更新到页面的对应div中
    for(var r=0;r<this.RN;r++){//遍历二维数组:
      for(var c=0;c<this.CN;c++){
        //找到当前位置(r,c)对应的div(id为"c"+r+c)
        var div=document.getElementById("c"+r+c);
        //如果data中r行c列不是0
        if(this.data[r][c]!=0){
          //设置div的内容为data中r行c列的值
          div.innerHTML=this.data[r][c];
          //设置div的class为"cell n"+data中r行c列值
          div.className="cell n"+this.data[r][c];
        }else{//否则
          div.innerHTML="";//清空div的内容
          //设置div的class为"cell"
          div.className="cell";
        }
      }
    }
    //找到id为score的span，设置其内容为score属性
    document.getElementById("score")
            .innerHTML=this.score;
    //找到id为gameOver的div
    var div=document.getElementById("gameOver");
    //如果游戏状态为GAMEOVER
    if(this.state==this.GAMEOVER){
      div.style.display="block";//设置div显示
      //设置id为final的span的内容为score属性
      document.getElementById("final")
              .innerHTML=this.score;
    }else{//否则
      div.style.display="none";//设置div隐藏
    }
  },
  moveRow(dir){//循环移动所有行
    //将data转为字符串保存在before中
    var before=String(this.data);
    for(var r=0;r<this.RN;r++){//r从0到<RN
      if(dir==1)//调用moveLeftInRow(r)移动第r行
        this.moveLeftInRow(r);
      else
        this.moveRightInRow(r);
    }//(所有行移动后)
    //将data转为字符串保存在after中
    var after=String(this.data);
    if(before!=after){//如果before不等于after
      this.randomNum();//随机生成一个数
      if(this.isGameOver())//如果游戏结束
        //就修改游戏状态为GAMEOVER
        this.state=this.GAMEOVER;
      this.updateView();//更新页面
    }
  },
  moveLeftInRow(r){//专门移动第r行
    for(var c=0;c<this.CN-1;c++){//c从0到<CN-1结束
      //查找r行c位置右侧下一个不为0的位置nextc
      var nextc=this.getNextInRow(r,c);
      //如果没找到(nextc==-1),就退出循环
      if(nextc==-1) break;
      else//否则
        c=this.marginRow(r,c,nextc,1);
    }
  },
  marginRow(r,c,nextc,dir){//判断是合并还是替换两格
    if(this.data[r][c]==0){//如果r行c列为0
      //将r行nextc列的值保存到r行c列
      this.data[r][c]=this.data[r][nextc];
      //将r行nextc列的值置为0
      this.data[r][nextc]=0;
      c-=dir;//c留在原地
    }else if(this.data[r][c]
              ==this.data[r][nextc]){
    //否则 如果r行c列等于r行nextc列
      this.data[r][c]*=2;//将r行c列*2
      this.score+=this.data[r][c];
        //将r行nextc列的值置为0
      this.data[r][nextc]=0;
    }
    return c;
  },
  getNextInRow(r,c){//查找r行c列右侧下一个不为0位置
    //i从c+1开始,到<CN结束
    for(var i=c+1;i<this.CN;i++){
      //如果r行i列不是0，就返回i
      if(this.data[r][i]!=0) return i;
    }//(循环结束)
    return -1;//返回-1
  },
  moveRightInRow(r){//右移第r行
    //c从CN-1开始，到>0结束，反向遍历r行中每个格
    for(var c=this.CN-1;c>0;c--){
      //找r行c列左侧前一个不为0的位置prevc
      var prevc=this.getPrevInRow(r,c);
      //如果prevc为-1,就退出循环
      if(prevc==-1) break;
      else//否则
        c=this.marginRow(r,c,prevc,-1);
    }
  },
  getPrevInRow(r,c){
    for(var i=c-1;i>=0;i--){
      if(this.data[r][i]!=0) return i;
    }
    return -1;
  },
  moveCol(dir){//移动所有列
    //为data拍照保存在before中
    var before=String(this.data);
    for(var c=0;c<this.CN;c++){//c从0开始到<CN结束
      if(dir==1)//如果dir等于1
        //调用moveUpInCol上移第c列
        this.moveUpInCol(c);
      else//否则,就调用moveDownInCol下移第c列
        this.moveDownInCol(c);
    }
    //为data拍照保存在after中
    var after=String(this.data);
    if(before!=after){//如果before不等于after
      this.randomNum();//随机生成数
      if(this.isGameOver())//如果游戏结束
        //就修改游戏状态为GAMEOVER
        this.state=this.GAMEOVER;
      this.updateView();//更新页面
    }
  },
  marginCol(r,c,nextr,dir){
    if(this.data[r][c]==0){//如果r位置c列的值为0
      //将nextr位置c列的值赋值给r位置
      this.data[r][c]=this.data[nextr][c];
      this.data[nextr][c]=0;//将nextr位置c列置为0
      r-=dir;//r留在原地
    }else if(this.data[r][c]
              ==this.data[nextr][c]){
    //否则，如果r位置c列的值等于nextr位置的值
      this.data[r][c]*=2;//将r位置c列的值*2
      this.score+=this.data[r][c];
      //将nextr位置c列的值置为0
      this.data[nextr][c]=0;
    }
    return r;
  },
  moveUpInCol:function(c){
    //r从0开始,到r<RN-1结束，r每次递增1
    for(var r=0;r<this.RN-1;r++){
      //查找r行c列下方下一个不为0的位置nextr
      var nextr=this.getNextInCol(r,c);
      if(nextr==-1) break;//如果没找到,就退出循环
      else//否则
        //调用marginCol,判断是合并还是替换两格
        r=this.marginCol(r,c,nextr,1);
    }
  },
  getNextInCol(r,c){
      //i从r+1开始到<RN结束，r每次递增1
      for(var i=r+1;i<this.RN;i++){
        //如果i行c列不等于0, 就返回i
        if(this.data[i][c]!=0) return i;
      }//(遍历结束)
      return -1;//返回-1
  },
  moveDownInCol:function(c){
    //r从RN-1开始，到r>0结束，r每次递减1
    for(var r=this.RN-1;r>0;r--){
      //查找r位置c列上方前一个不为0的位置prevr
      var prevr=this.getPrevInCol(r,c);
      //如果没找到,就退出循环
      if(prevr==-1) break;
      else//否则 
        //调用marginCol,判断是合并还是替换两格
        r=this.marginCol(r,c,prevr,-1);
    }
  },
  getPrevInCol:function(r,c){
    //i从r-1开始到>=0结束，每次递减1
    for(var i=r-1;i>=0;i--){
      //如果i行c列不等于0, 就返回i
      if(this.data[i][c]!=0) return i;
    }//(遍历结束)
    return -1;//返回-1
  },
  isGameOver(){//判断游戏是否结束
    for(var r=0;r<this.RN;r++){//遍历data中每个元素
      for(var c=0;c<this.CN;c++){
        //如果data中r行c列的值为0
        if(this.data[r][c]===0){
          return false;//返回false
        }else if(c<this.CN-1
            &&this.data[r][c]==this.data[r][c+1]){
         //否则如果c<3且data中r行c列的值等于右侧值
          return false;//返回false
        }else if(r<this.RN-1
            &&this.data[r][c]==this.data[r+1][c]){
         //否则如果r<3且data中r行c列的值等于下方值
          return false;//返回false
        }
      }
    }//(遍历结束)
    return true;//返回true
  }
}
game.start();