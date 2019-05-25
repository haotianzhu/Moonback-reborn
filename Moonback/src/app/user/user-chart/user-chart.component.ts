import { EChartOption } from 'echarts';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-chart',
  templateUrl: './user-chart.component.html',
  styleUrls: ['./user-chart.component.css']
})
export class UserChartComponent implements OnInit {
  data = [10, 10, 10, 10, 50];
  chartOption: EChartOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return 'TOTAL: ' + params.value.reduce((a, b) => a + b, 0);
      }
    },
    radar: {
      indicator: [
        { text: 'level', max: 100, color: '#72ACD1' },
        { text: 'game', max: 100, color: '#72ACD1' },
        { text: 'anime', max: 100, color: '#72ACD1' },
        { text: 'novel', max: 100, color: '#72ACD1' },
        { text: 'manga', max: 100, color: '#72ACD1' },
      ],
      center: ['50%', '50%'],
      radius: '80%',
      startAngle: 90,
      splitNumber: 5,
      shape: 'polygon',
      splitArea: {
        show: true
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(125, 128, 130, 0.4)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(13, 49, 183, 0.4)'
        }
      }
    },
    series: [
      {
        type: 'radar',
        itemStyle: {
          normal: {
            areaStyle: {
              type: 'default'
            }
          }
        },
        data: [
          {
            value: this.data,
            symbol: 'circle',
          }
        ]
      }
    ],
  };

  ngOnInit() {
  }
}
