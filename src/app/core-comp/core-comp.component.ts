import { HttpClient } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexAnnotations,
  PointAnnotations,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexMarkers
} from "ng-apexcharts";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  annotations: ApexAnnotations;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  labels: string[];
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
};

@Component({
  selector: 'app-core-comp',
  templateUrl: './core-comp.component.html',
  styleUrls: ['./core-comp.component.scss']
})
export class CoreCompComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private http:HttpClient) {
    this.initChartData(52);
  }
public coins:any;
public coinNames=[{name:"XRP",value:"XRP"},{name:"XRP",value:"XRP"}];
public coinType:any
public annotations:any;
public trends:PointAnnotations[]=[];
public trendText:any;
public activeOptionButton = "all";
  public updateOptionsData = {
    "5min": {
      xaxis: {
        type: "datetime",
        min: new Date(Date.now()-10000000).getTime(),
        max: new Date(Date.now()+10800000).getTime(),
        tickAmount: 10
      }
    },
    "15min": {
      xaxis: {
        type: "datetime",
        tickAmount: 10,
        min: new Date(Date.now()-20000000).getTime(),
        max: new Date(Date.now()+10800000).getTime()
      }
    },
    "30min": {
      xaxis: {
        type: "datetime",
        tickAmount: 10,
        min: new Date(Date.now()-30000000).getTime(),
        max: new Date(Date.now()+10800000).getTime()
      }
    },
    "60min": {
      xaxis: {
        type: "datetime",
        tickAmount: 10,
        min: new Date(Date.now()-40000000).getTime(),
        max: new Date(Date.now()+10800000).getTime()
      }
    },
    all: {
      xaxis: {
        type: "datetime",
        tickAmount: 10,
        min: undefined,
        max: undefined
      }
    }
  };

  public initChartData(num): void {

    console.log(Date.now())
    let labelName="";
    labelName= num == 52 ? "XRP" : num == 74 ? "DOGE" : num == 1027 ? "ETH" : "";
    let dates =[];
    let prices=[];
    let trendPrices=[];
    let trendDates=[];
    this.http.get("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id="+num+"&range=1D").subscribe(result=>{
      console.log(result);
      this.coins=result;
      var keyNames = Object.keys(this.coins.data.points);
      var i = 1;
      keyNames.forEach(element => {
        // console.log(this.coins.data.points[element].v[0]);
          dates.push(Number(element)*1000+10800000);
          prices.push(this.coins.data.points[element].v[0]);
      });
      this.trends=this.getTrendPoints(prices,dates);

      this.chartOptions = {
        series: [
          {
            name: "$USD",
            data: prices
          }
        ],
        chart: {
          height: 350,
          type: "line"
        },
        annotations: {
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        grid: {
          padding: {
            right: 30,
            left: 20
          }
        },
        title: {
          text: labelName,
          align: "left"
        },
        labels: dates,
        xaxis: {
          type: "datetime",
          tickAmount: 6,
          min: new Date(dates[0]).getTime(),
          max:new Date(Date.now()+10800000).getTime()
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy HH:mm"
          }
        },
      };
    })
  }
  updateOptions(option: any): void {
    this.activeOptionButton = option;
    console.log(this.updateOptionsData[option].xaxis);
    this.chartOptions.xaxis=this.updateOptionsData[option].xaxis;
  }
  getTrendPoints(coinValues,coinDates){
    let pointAnotations:PointAnnotations[]=[];
    let i=0;
    for (let index = 0; index < 5; index++) {
      pointAnotations.push({
        x:coinDates[index],
        y:coinValues[index],
        marker: {
          size: 5,
          fillColor: "#fff",
          strokeColor: "red",
          radius: 2,
          cssClass: "apexcharts-custom-class"
        },
        label: {
          borderColor: "#FF4560",
          offsetY: 0,
          style: {
            color: "#fff",
            background: "#FF4560"
          },

          text: "Trend Noktası"
        }
      });
      
    }
    console.log(pointAnotations)

    return pointAnotations;
  }
  hesapla(){
    this.annotations={
      points:this.trends
    };
    this.trendText="Trendler grafikte gösterilmiştir. Mevcut hesaplanan trende göre, öngörülen maksimum değer "+0.56666+", minumum değer ise "+0.45000+" olarak hesaplanmıştır."
  }
}

