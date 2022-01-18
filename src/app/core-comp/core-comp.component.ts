import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";
import { dataSeries } from "./data-series";

@Component({
  selector: 'app-core-comp',
  templateUrl: './core-comp.component.html',
  styleUrls: ['./core-comp.component.scss']
})
export class CoreCompComponent {
  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;

  constructor(private http:HttpClient) {
    this.initChartData(52);
  }
public coins:any;
public coinNames=[{name:"XRP",value:"XRP"},{name:"XRP",value:"XRP"}];
public coinType:any

  public initChartData(num): void {

    let labelName="";
    labelName= num == 52 ? "XRP" : num == 74 ? "DOGE" : num == 1027 ? "ETH" : "";
    let dates = [];
    this.http.get("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id="+num+"&range=1D").subscribe(result=>{
      console.log(result);
      this.coins=result;
      var keyNames = Object.keys(this.coins.data.points);
      var i = 1;
      keyNames.forEach(element => {
        // console.log(this.coins.data.points[element].v[0]);
        if(i %5 == 0){
          dates.push([Number(element), this.coins.data.points[element].v[0]]);
        };
        i++;
      });
      console.log(dates);
    })
    let ts2 = 1484418600000;
   

    this.series = [
      {
        name: "$ USD",
        data: dates
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: 500,
      width:1000,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: labelName,
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
   
      },
      title: {
        text: "Price"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
     
      }
    };
  }
  changeCoin(value){
    this.coinType=value;
  }
}
