/**
 * H5数字滚动效果
 * @class DigitRoll
 * @desc 没有任何依赖, 只兼容webkit内核, 主要用于H5页面. 组件本身没有css, 如果需要修改默认样式 可以添加css样式修饰.
 * @param {object} opts 实例化参数
 * @param {string} opts.container 容器选择器 selector
 * @param {number} opts.digit=1 数字的总宽度个数, 即要显示几位数
 * @example
 HTML:
 <div id="num-roll"></div>
 * @example
 js:
 var r1=new DigitRoll({
        container:'#happy-new-year',
        digit:9
    });
 */
function DigitRoll(opts) {
    this.container=document.querySelector(opts.container); //容器
    this.digit=opts.digit || 1;
    this.isPicture = opts.isPicture || false;
    if (!this.container) {
        throw Error('no container');
    }
    this.container.style.overflow='hidden';
    this.rollHeight=parseInt(getComputedStyle(this.container).height); //容器高度 也用于滚动间隔距离

    if (this.rollHeight<1) {//只有容器的高度是必选样式  如果没有设置 那就给一个默认的
        this.container.style.height='20px';
        this.rollHeight=20;
    }
    this.setDigit();
}
/**  @lends DigitRoll */
DigitRoll.prototype={
    /**
     * 滚动数字
     * @param {number} n 要滚动的数字 如:2015518518
     * @example
     r1.roll(2015518518);

     //定时更新
     setInterval(function(){
            r1.roll(314159);
        },5000)
     */
    roll:function (n) {
        var self = this;
        this.number=parseInt(n)+'';
        if (this.number.length<this.digit) {
            this.number=new Array(this.digit - this.number.length + 1).join('0') + this.number;
        }else if (this.number.length>this.digit) {
            this.digit=this.number.length;
            this.setDigit();
        }
        Array.prototype.forEach.call(this.container.querySelectorAll('.num'), function (item,i) {
            var currentNum=parseInt(item.querySelector('div:last-child').innerHTML);//当前数字
            var goalNum=parseInt(self.number[i]);//目标数字
            var gapNum=0; //数字滚动的间隔个数
            var gapStr='';
            if (currentNum==goalNum) { //数字没变 不处理
                return ;
            }else if(currentNum<goalNum) { // 比如数字从1到3
                gapNum=goalNum-currentNum;
                for (var j=currentNum; j<goalNum+1; j++) {
                    gapStr += self._getNumDiv(j);
                }
            }else {// 比如 数字从6到5  因为所有情况都是从下往上滚动 所以如果是6到5的话 要滚动9个数字
                gapNum=10-currentNum+goalNum;
                for (var j=currentNum; j<10; j++) {
                    gapStr += self._getNumDiv(j);
                }
                for (var j=0; j<goalNum+1; j++) {
                    gapStr += self._getNumDiv(j);
                }
            }
            item.style.cssText += '-webkit-transition-duration:0s;-webkit-transform:translateY(0)';//重置位置
            item.innerHTML = gapStr;
            setTimeout(function () {
                item.style.cssText+='-webkit-transition-duration:1s;-webkit-transform:translateY(-'+self.rollHeight*gapNum+'px)';
            },50)
        })
    },
    /**
     * 重置宽度
     * @desc 一般用不到这个方法
     * @param {number} n 宽度 即数字位数
     * @example
     r1.setDigit(10);
     */
    setDigit:function (n) {
        n=n||this.digit;
        var str='';
        for (var i=0; i<n; i++) {
            str+='<div class="num" style="float:left;height:100%;line-height:'+this.rollHeight+'px">' + this._getNumDiv(0) + '</div>';
        }
        this.container.innerHTML=str;
    },
    /**
     * 设置数字div展现模式
     * @isPicture {boolean} true=>用图片展现 false=>用数字展现
     * 内部私有方法
     */
    _getNumDiv: function(index) {
        var isPicture = this.isPicture || false;
        numberArr = [ "num0", "num1", "num2", "num3", "num4", "num5", "num6", "num7", "num8", "num9" ];
        if (!!isPicture) {
            return '<div class="isPicture ' + numberArr[index] + '">' + index + '</div>';
        } else {
            return '<div>' + index + '</div>';
        }
    }
}