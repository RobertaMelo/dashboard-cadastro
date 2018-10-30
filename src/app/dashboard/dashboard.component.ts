import { Component, OnInit } from '@angular/core';
import { DadosService } from '../services/dados.service';
import { StorageService } from '../services/storage.service';
import { HitsDTO } from '../model/hits.dto';
import { CityDTO } from '../model/city.dto';
import { CityDataDTO } from '../model/city-data.dto';

import * as CanvasJS from '../canvasjs.min';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  
  hits: HitsDTO[];
  citys: CityDTO[];
  modeTable: boolean;
  nameMode;

  constructor(
    private dadosService: DadosService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.modeTable = false;
    this.nameMode = "Visão tabulada" 
    let token = this.storageService.getLocalToken();
    this.getHitsByBrowser(token);
    this.getCityTemperatures(token);
  }

  getHitsByBrowser(token) {
    this.dadosService.getHitsByBrowser(token)
    .subscribe(response => {
      this.hits = [];
      let hitsArray = JSON.parse(response.body);
      for (let hit of hitsArray) {
        let hitDTO: HitsDTO = {
          browser: hit[0],
          countAcess: hit[1]
        }
        this.hits.push(hitDTO);
      }
      this.dadosService.generatePercentageAcess(this.hits);
      this.startGraphsByBrowser();
    }, error => {
      console.log(error);
    });
  }

  getCityTemperatures(token) {
    this.dadosService.getCityTemperatures(token)
    .subscribe(response => {
      this.citys = [];
      let citysArray = JSON.parse(response.body);
      for (let city of citysArray) {
        let dates = [];
        let cityDates = city.data;
        for (let date of cityDates) {
          let dateDTO: CityDataDTO = {
            dayMonth: date[0],
            temperature: date[1]
          }
          dates.push(dateDTO);
        }
        let cityDTO: CityDTO = {
          name: city.name,
          data: dates
        }
        this.citys.push(cityDTO);
      }
      this.dadosService.generateDataMonths(this.citys);
      this.startGraphsCityTemperatures();
    }, error => {
      console.log(error);
    });
  }

  startGraphsByBrowser() {
    let dataPoints = [];
    for (let hit of this.hits) {
      let dataPoint = {
        y: hit.percentAcess,
        name: hit.browser
      }
      dataPoints.push(dataPoint);
    }

    let chart = new CanvasJS.Chart("chartContainerBrowser", {
      animationEnabled: true,
      exportEnabled: false,
      title: {
        text: "Distribuição de Acessos por browser"
      },
      data: [{
        type: "pie",
		  	showInLegend: true,
		  	toolTipContent: "<b>{name}</b>: (#percent%)",
			  indexLabel: "{name} - #percent%",
        dataPoints: dataPoints
      }]
    });
      
    chart.render();
  }

  startGraphsCityTemperatures() {
    let data = [];
    for (let city of this.citys) {
      
      let dataPoints = [];
      for (let cityTemperatureMonth of city.dataMonth) {
        let temperaturePoint = {
          y: cityTemperatureMonth.temperatureAverage,
          label: this.getMonth(cityTemperatureMonth.month)
        }
        dataPoints.push(temperaturePoint);
      }
      
      let point = {
        type: "column",
        name: city.name,
        showInLegend: true,
        dataPoints: dataPoints
      }
      data.push(point);
    }
    
    let chart = new CanvasJS.Chart("chartContainerTemperature", {
      title: {
        text: "Temperatura média por mês"
      },
      data: data
    });
    chart.render();
  }

  getMonth(monthNumber) {
    let month = new Array();
    month[0] = "Janeiro";
    month[1] = "Fevereiro";
    month[2] = "Março";
    month[3] = "Abril";
    month[4] = "Maio";
    month[5] = "Junho";
    month[6] = "Julho";
    month[7] = "Agosto";
    month[8] = "Setembro";
    month[9] = "Outubro";
    month[10] = "Novembro";
    month[11] = "Dezembro";
    return month[monthNumber - 1];
  }

  alterModeShow() {
    this.modeTable = !this.modeTable;
    this.nameMode = this.modeTable ? "Visão gráfica" : "Visão tabulada";
  }
  
}
