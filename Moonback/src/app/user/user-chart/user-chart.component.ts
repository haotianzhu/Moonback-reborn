import { EChartOption } from 'echarts';
import { environment } from 'src/environments/environment';
import { Component, OnInit, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/authentication/shared/auth.service';

@Component({
  selector: 'app-user-chart',
  templateUrl: './user-chart.component.html',
  styleUrls: ['./user-chart.component.css']
})
export class UserChartComponent implements OnInit, AfterContentInit {
  echartsInstance: any;
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
            value: [1, 1, 1, 1, 1],
            symbol: 'circle',
          }
        ]
      }
    ],
  };

  constructor(private http: HttpClient, private auth: AuthService, private cdref: ChangeDetectorRef) { }

  onChartInit(instance) {
    this.echartsInstance = instance;
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    if (this.auth.isAuth()) {
      this.http.get<any>(
        `${environment.baseUrl + 'user/' + this.auth.getAuth().id}`
      ).subscribe(
        body => {
          const chartDate = body.user.echart;
          const data = [chartDate.level, chartDate.game, chartDate.anime, chartDate.novel, chartDate.manga];
          this.chartOption.series[0].data[0].value = data;
          this.echartsInstance.setOption(this.chartOption, true);
          this.cdref.detectChanges();
        },
        error => {
          console.log(error);
        }
      );

    } else {
    }
  }
}
