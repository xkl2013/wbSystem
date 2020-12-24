import {  thousandSeparator } from '@/utils/utils';

function style(color){
    return `display:inline-block;margin-right:5px;width:6px;height:6px;border-radius:50%;background:#${color};`
}
const _html = function (param,dataAll) {
    const i = param.dataIndex,marBtoCls="margin-bottom: 5px",floatRightCls='float:right'
    return `<div>
        <div>${dataAll.data1[i]}</div>
          <div style=${marBtoCls}><span style=${style('5C99FF')}></span>涨粉量:<span style=${floatRightCls}>${thousandSeparator(dataAll.data2[i])}</span></div>
          <div style=${marBtoCls}><span style=${style('FAA72C')}></span>粉丝单价:<span style=${floatRightCls}>¥ ${thousandSeparator(dataAll.data3[i])}</span></div>
          <div style=${marBtoCls}><span style=${style('6D75F9')}></span>粉丝量:<span style=${floatRightCls}>${thousandSeparator(dataAll.data4[i])}</span></div>
          <div style=${marBtoCls}><span style=${style('44D7B6')}></span>投放涨粉量:<span style=${floatRightCls}>${thousandSeparator(dataAll.data5[i])}</span></div>
          <div style=${marBtoCls}><span style=${style('F05969')}></span>投放金额:<span style=${floatRightCls}>¥ ${thousandSeparator(dataAll.data6[i])}</span></div>
      </div>`
  } ;
export function option(dataAll) {
    return {
    tooltip: {
        // trigger: 'item',
        backgroundColor:'rgba(13,13,13,0.6)' ,
        textStyle: {
            align: 'left',
            fontSize: 12,
        },
        formatter: function (params) {
            return `<div style="min-width:140px; border-radius: 3px;padding:10px 8px">${_html(params,dataAll)}</div>`;
        },
        padding:0,
        axisPointer: {
            type: 'line',
        //     crossStyle: {
        //         color: 'rgba(159,159,159,0.06)'
        //     }
        }

    },
    grid: {
        top:60,
      bottom: 60,
      left: 80,
      right: 40,
      height: 300,
    },
    color: ['#5C99FF', '#FAA72C'],
    legend: {
        textStyle: {
          fontSize: '14px',
          color:'#5A6876'
        },
        itemWidth: 20,
        itemHeight: 14,
        itemGap:20,
        data:['涨粉量','粉丝单价']
    },
    xAxis: [
        {
            type: 'category',
            data: dataAll.data1,
            axisPointer: {
                type: 'shadow'
            },
            axisTick: {
                lineStyle: {
                    color: '#A0A0A0',
                },
            },
            axisLabel: {
                interval:0,
                rotate:45,
                textStyle: {
                    color: '#5A6876'  
                  }
            },
            axisLine: {
                lineStyle: {
                  color: '#BDCAD7'
                }
            },
        }
    ],
    yAxis: [
        {
            axisLine: {
                show: false,
                lineStyle: {
                  color: '#5A6876',
                  fontSize:14
                }
            },
            type: 'value',
            name: '涨粉量（人）',
            // interval: 50,
            axisLabel: {
                textStyle: {
                    color: '#5A6876'  
                },
                interval:0
            },
            axisTick: {
                lineStyle: {
                    color: '#A0A0A0',
                },
            },
            splitLine:{
                lineStyle: {
                    color: '#F4F4F4',
                }
            }
        },
        {
            axisLine: {
                show: false,
                lineStyle: {
                  color: '#5A6876',
                  fontSize:14
                }
            },
            axisTick: {
                show: false
            },
            type: 'value',
            position: 'right',
            name: '粉丝单价（元）',
            axisLabel: {
                textStyle: {
                    color: '#5A6876'  
                },
                interval:0
            },
            splitLine:{
                show:false
            }
        },
       
    ],
    series: [
        {
            name:'涨粉量',
            type:'bar',
            barWidth: 25,
            data:dataAll.data2
        },
        {
            name:'粉丝单价',
            type:'line',
            yAxisIndex: 1,
            data:dataAll.data3
        }
    ]
}
};
