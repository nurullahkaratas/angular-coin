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
  PointAnnotations
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

  public initChartData(num): void {

    let labelName="";
    labelName= num == 52 ? "XRP" : num == 74 ? "DOGE" : num == 1027 ? "ETH" : "";
    let dates =[];
    let prices=[];
    let trendPrices=[];
    let trendDates=[];
    this.http.get("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id="+num+"&range=7D").subscribe(result=>{
      console.log(result);
      this.coins=result;
      var keyNames = Object.keys(this.coins.data.points);
      var i = 1;
      keyNames.forEach(element => {
        // console.log(this.coins.data.points[element].v[0]);
        if(i %5 == 0){
          dates.push(Number(element)+607800);
          prices.push(this.coins.data.points[element].v[0]);
        };
        i++;
      });
      this.trends=this.getTrendPoints(prices,dates);

      this.chartOptions = {
        series: [
          {
            name: "series",
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
        }
      };
    })
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

