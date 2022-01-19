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

  constructor(private http: HttpClient) {
    this.initChartData(52);
  }

  public coins: any;
  public coinNames = [{ name: "XRP", value: "XRP" }, { name: "XRP", value: "XRP" }];
  public coinType: any
  public annotations: any;
  public trends: PointAnnotations[] = [];
  public trendText: any;
  public activeOptionButton = "all";
  public increamentList: any = [];
  public increamentFiboList: any = [];
  public increamentFiboMaxes: any = [];
  public coinData: any;
  public decreamentList: any = [];
  public decreamentFiboList: any = [];
  public decreamentFiboMines: any = [];

  public increamentTrendPoints: any[];
  public updateOptionsData = {
    "5min": {
      xaxis: {
        type: "datetime",
        min: new Date(Date.now() - 10000000).getTime(),
        max: new Date(Date.now() + 10800000).getTime(),
        tickAmount: 10
      }
    },
    "15min": {
      xaxis: {
        type: "datetime",
        tickAmount: 10,
        min: new Date(Date.now() - 20000000).getTime(),
        max: new Date(Date.now() + 10800000).getTime()
      }
    },
    "30min": {
      xaxis: {
        type: "datetime",
        tickAmount: 10,
        min: new Date(Date.now() - 30000000).getTime(),
        max: new Date(Date.now() + 10800000).getTime()
      }
    },
    "60min": {
      xaxis: {
        type: "datetime",
        tickAmount: 10,
        min: new Date(Date.now() - 40000000).getTime(),
        max: new Date(Date.now() + 10800000).getTime()
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
    this.trendText = '';
    let labelName = "";
    this.annotations = null;
    labelName = num == 52 ? "XRP" : num == 74 ? "DOGE" : num == 1027 ? "ETH" : "";
    let dates = [];
    let prices = [];
    let trendPrices = [];
    let trendDates = [];
    this.http.get("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=" + num + "&range=1D").subscribe(result => {

      this.coins = result;
      var keyNames = Object.keys(this.coins.data.points);
      var i = 1;
      keyNames.forEach(element => {
        dates.push(Number(element) * 1000 + 10800000);
        prices.push(this.coins.data.points[element].v[0]);
      });
      this.coinData = { dateList: dates, priceList: prices };

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
          max: new Date(Date.now() + 10800000).getTime()
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
    this.chartOptions.xaxis = this.updateOptionsData[option].xaxis;
  }

  getTrendPoints(coinDates, coinValues) {
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

    return pointAnotations;
  }

  calculate() {
    var increamentValues = this.calculateIncreament();
    var decreamentValues = this.calculateDecreament();

    var priceValues = [];
    var dateValues = [];
    increamentValues.forEach(element => {
      var dateItems = this.coinData.dateList[element.startIndex];
      var priceItems = this.coinData.priceList[element.startIndex];
      priceValues.push(priceItems);
      dateValues.push(dateItems);

      dateItems = this.coinData.dateList[element.endIndex];
      priceItems = this.coinData.priceList[element.endIndex];
      priceValues.push(priceItems);
      dateValues.push(dateItems);
    });

    decreamentValues.forEach(element => {
      var dateItems = this.coinData.dateList[element.startIndex];
      var priceItems = this.coinData.priceList[element.startIndex];
      priceValues.push(priceItems);
      dateValues.push(dateItems);

      dateItems = this.coinData.dateList[element.endIndex];
      priceItems = this.coinData.priceList[element.endIndex];
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

    this.increamentFiboList = this.checkFib(this.increamentList, this.increamentList.length);
    this.increamentFiboMaxes.push(this.findMax(this.increamentFiboList));
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

    this.decreamentFiboList = this.checkFib(this.decreamentList, this.decreamentList.length);
    this.decreamentFiboMines.push(this.findMax(this.decreamentFiboList));
    return this.decreamentFiboMines;
  }

  isPerfectSquare(num) {
    let n = angularMath.squareOfNumber(Number(num));
    return (n * n == num);
  }

  checkFib(array, length) {
    var list = [];
    var count = 0;
    for (let i = 0; i < length; i++) {
      if (this.isPerfectSquare(5 * array[i].value * array[i].value + 4) || this.isPerfectSquare(5 * array[i].value * array[i].value - 4)) {
        list.push(array[i]);
        count++;
      }
    }
    return list;
  }

  findMax(list) {
    var buyuk = list[0];
    for (let i = 0; i < list.length; i++) {
      if (buyuk.value < list[i].value) {
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

