function $(str){
    return document.querySelector(str)
}

window.onload = function(){
    initChart()
    initNav()
    initSlideshow()
}

//初始化轮播图
function initSlideshow(){
    let index = 0
    let slideshow = $("#main-row1-slideshow")
    let ul = $("#main-row1-slideshow-pictures")
    let dots = $("#main-row1-slideshow-dot ul")
    let leftbtn = $("#main-row1-slideshow-left")
    let rightbtn = $("#main-row1-slideshow-right")
    let flag = true


    for(let i=0;i<ul.children.length;i++){
        let el = document.createElement("li")
        el.onclick = function(){
            index = i
            to()
        }
        dots.appendChild(el)
    }

    rightbtn.onclick=function(){
        index++
        to()
    }

    to()

    //定时器
    setInterval(function(){
        if(flag){
            index++
            to()
        }
    },1000*2)
    
    //鼠标悬停
    slideshow.onmouseover = function(){
        flag = false
    }
    slideshow.onmouseout = function(){
        flag = true
    }

    //按钮切换
    leftbtn.onclick=function(){
        index--
        to()
    }

    

    function to(){
        let length = ul.children.length
        index = index<0 ? length-1 : index%length
        ul.style.marginLeft = 539*index*-1 +"px"
        for(let el of dots.children){
            el.className = ""
        }
        dots.children[index].className = "activity"
    }
}

//初始化导航（滑块效果）
function initNav(){
    let nav = $("#main-top-right ul").children
    let bar = $("#main-top-right-bar")
    let flag = true

    bar.style.left= nav[0].children[0].offsetLeft+"px"
    bar.style.width = nav[0].children[0].offsetWidth + "px"
    
    for(let el of nav){
        el.children[0].onmouseover = function(){
            if(!flag) return;
            bar.style.left=this.offsetLeft+"px"
            bar.style.width = this.offsetWidth + "px"
        }
        el.children[0].onclick = function(){
            flag = false
        }
    }
    
}

// 初始化图表
function initChart(){
    // 曲线图
    var curveChart =echarts.init($('#main-row2-curve'))
    curveChart.setOption({
        title:{
            text:"曲线图数据展示",
            left:"center"
        },
        xAxis: {
          data: [],
          axisLine:{
            show:false
          },
          axisTick:{
            show:false
          }
        },
        yAxis: {
            axisLine:{
                show:false
            },
            axisTick: {
                show: false
            },
            axisLabel:{
                formatter: '{value} 人',
            },
            splitLine:{
                lineStyle:{
                    type:"dashed"
                }
            }
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
            areaStyle:{
                color:"#d2deff"
            },
            color:['#4688f0'],
            label:{
                show:true,
                color:'#4688f0'
            }
          }
        ]
    })
    curveChart.showLoading()

    //饼图
    var pieChart = echarts.init($('#main-row3-pie'))
    pieChart.setOption({
        title:{
            text:'饼状图数据展示',
            left:'center'
        },
        dataset:{
            source:[]
        },
        series: {
            type: 'pie',
            // dimensions: []
            }
    })
    pieChart.showLoading()


    // 柱状图
    var barChart = echarts.init($('#main-row3-bar'))
    barChart.setOption({
        title:{
            text:"柱状图数据展示",
            left:"center"
        },
        xAxis: {
          data: [],
          axisLine:{
            show:false
          },
          axisTick:{
            show:false
          }
        },
        yAxis: {
            name:"商品数",
            splitLine:{
                lineStyle:{
                    type:"dotted"
                }
            }
        },
        series: [
          {
            type: 'bar',
            data: [],
            barWidth: '20%'
          }
        ]
      })
      barChart.showLoading()



    // 获取月数据
      get("https://edu.telking.com/api/?type=month").then((res)=>{

        curveChart.setOption({
            series:{
                data : res.data.series
            },
            xAxis:{
                data:res.data.xAxis
            }
        })
        curveChart.hideLoading()
      })

    
      //获取周数据
      get("https://edu.telking.com/api/?type=week").then((res)=>{
        pieChart.setOption({
            dataset:{
                source:{
                    'product':res.data.xAxis,
                    'count':res.data.series,
                   
                }
            }
        })
        pieChart.hideLoading()
        barChart.setOption({
            series:{
                data : res.data.series
            },
            xAxis:{
                data:res.data.xAxis
            }
        })
        barChart.hideLoading()
      })
}




//get请求
function get(url){
    return new Promise((resolve)=>{
        fetch(url).then((res)=>{
            res.text().then((text)=>{
                resolve(JSON.parse( text))
            })
        })
    })
    
}