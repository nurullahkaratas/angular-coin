import { HttpClient } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { angularMath } from 'angular-ts-math';
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

  constructor(private http: HttpClient) {
    this.initChartData(52);
  }

  public coins: any;
  public coinNames = [{ name: "XRP", value: "XRP" }, { name: "XRP", value: "XRP" }];
  public coinType: any
  public annotations: any;
  public trends: PointAnnotations[] = [];
  public trendText: any;
  public coinData: any;
  public increamentList: any = [];
  public increamentFiboList: any = [];
  public increamentFiboMaxes: any = [];

  public decreamentList: any = [];
  public decreamentFiboList: any = [];
  public decreamentFiboMines: any = [];

  public increamentTrendPoints: any[];

  public initChartData(num): void {

    let labelName = "";
    labelName = num == 52 ? "XRP" : num == 74 ? "DOGE" : num == 1027 ? "ETH" : "";
    let dates = [];
    let prices = [];
    let trendPrices = [];
    let trendDates = [];
    this.http.get("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=" + num + "&range=7D").subscribe(result => {
      console.log(result);
      this.coins = result;
      var keyNames = Object.keys(this.coins.data.points);
      var i = 1;
      keyNames.forEach(element => {
        // console.log(this.coins.data.points[element].v[0]);
        if (i % 5 == 0) {
          dates.push(Number(element) + 607800);
          prices.push(this.coins.data.points[element].v[0]);
        };
        i++;
      });
      this.coinData = { dateList: dates, priceList: prices };
      //this.trends = this.getTrendPoints(dates, prices);

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

  getTrendPoints(coinDates, coinValues) {
    console.log('hakan', coinValues);
    let pointAnotations: PointAnnotations[] = [];
    let i = 0;
    for (let index = 0; index < coinValues.length; index++) {
      pointAnotations.push({
        x: coinDates[index],
        y: coinValues[index],
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
      this.annotations = { points: pointAnotations };
    }

    console.log('nurullah', pointAnotations)

    return pointAnotations;
  }

  hesapla() {
    console.log(this.coinData);

    var increamentValues = this.calculateIncreament();
    var decreamentValues = this.calculateDecreament();

    var priceValues = [];
    var dateValues = [];
    console.log(increamentValues);
    increamentValues.forEach(element => {
      var dateItems = this.coinData.dateList[element.endIndex];
      var priceItems = this.coinData.priceList[element.endIndex];
      priceValues.push(priceItems);
      dateValues.push(dateItems);
    });

    console.log(decreamentValues);
    decreamentValues.forEach(element => {
      var dateItems = this.coinData.dateList[element.endIndex];
      var priceItems = this.coinData.priceList[element.endIndex];
      priceValues.push(priceItems);
      dateValues.push(dateItems);
    });
    this.getTrendPoints(dateValues, priceValues);

    var maxValue = this.findMaxValue(priceValues);
    var minValue = this.findMinValue(priceValues);
    this.trendText = "Trendler grafikte gösterilmiştir. Mevcut hesaplanan trende göre, öngörülen maksimum değer " + maxValue + ", minumum değer ise " + minValue + " olarak hesaplanmıştır."
  }

  calculateIncreament() {
    this.increamentList = [];
    this.increamentFiboList = [];
    this.increamentFiboMaxes = [];
    for (let i = 0; i < this.coinData.priceList.length; i++) {
      for (let j = i; j < this.coinData.priceList.length; j++) {
        if (this.coinData.priceList[j] > this.coinData.priceList[i]) {
          var value = this.coinData.priceList[j] - this.coinData.priceList[i];
          this.increamentList.push({ startIndex: i, endIndex: j, value: value });
        }
      }
    }

    this.increamentFiboList = this.checkFib(this.increamentList, this.increamentList.length, 1);

    var ignoredList = [];
    for (let i = 0; i < 6; i++) {
      this.increamentFiboMaxes.push(this.findMax(this.increamentFiboList, ignoredList));
      this.increamentFiboMaxes.forEach(element => {
        ignoredList.push(element.value)
      });
    }
    return this.increamentFiboMaxes;
  }

  calculateDecreament() {
    this.decreamentList = [];
    this.decreamentFiboList = [];
    this.decreamentFiboMines = [];
    for (let i = 0; i < this.coinData.priceList.length; i++) {
      for (let j = i; j < this.coinData.priceList.length; j++) {
        if (this.coinData.priceList[i] > this.coinData.priceList[j]) {
          var value = this.coinData.priceList[i] - this.coinData.priceList[j];
          this.decreamentList.push({ startIndex: i, endIndex: j, value: value });
        }
      }
    }

    this.decreamentFiboList = this.checkFib(this.decreamentList, this.decreamentList.length, 1);

    var ignoredList = [];
    for (let i = 0; i < 6; i++) {
      this.decreamentFiboMines.push(this.findMax(this.decreamentFiboList, ignoredList));
      this.decreamentFiboMines.forEach(element => {
        ignoredList.push(element.value)
      });
    }
    return this.decreamentFiboMines;
  }

  isPerfectSquare(num) {
    let n = angularMath.squareOfNumber(Number(num));
    return (n * n == num);
  }

  checkFib(array, length, flag) {
    var list = [];
    var count = 0;
    for (let i = 0; i < length; i++) {
      if (this.isPerfectSquare(5 * array[i].value * array[i].value + 4) || this.isPerfectSquare(5 * array[i].value * array[i].value - 4)) {
        list.push(array[i]);
        count++;
      }
    }

    if (flag == 1) {

    }
    else if (flag == 2) {

    }
    return list;
  }

  findMax(list, ignoredList) {
    var buyuk = list[0];
    for (let i = 0; i < list.length; i++) {
      if (buyuk.value < list[i].value && ignoredList.indexOf(list[i].value) == -1) {
        buyuk = list[i];
      }
    }
    return buyuk;
  }

  findMaxValue(list) {
    var buyuk = list[0];
    for (let i = 0; i < list.length; i++) {
      if (buyuk < list[i]) {
        buyuk = list[i];
      }
    }
    return buyuk;
  }

  findMinValue(list) {
    var kucuk = list[0];
    for (let i = 0; i < list.length; i++) {
      if (kucuk > list[i]) {
        kucuk = list[i];
      }
    }
    return kucuk;
  }
}

