import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { Observable } from 'rxjs';
import { DadosDTO } from '../model/dados.dto';
import { TokenDTO } from '../model/token.dto';
import { HitsDTO } from '../model/hits.dto';
import { CityDTO } from '../model/city.dto';
import { CityDataMonthDTO } from '../model/city-data-month.dto';

@Injectable()
export class DadosService {

  constructor(
    public http: HttpClient
  ) {}
 
  sendData(data: DadosDTO) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/users`, 
      data,
      { 
          observe: 'response', 
          responseType: 'text'
      }
    );
  }

  getHitsByBrowser(token: TokenDTO) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/hits-by-browser`, 
      token,
      { 
          observe: 'response', 
          responseType: 'text'
      }
    );
  }

  getCityTemperatures(token: TokenDTO) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/city-temperatures`, 
      token,
      { 
          observe: 'response', 
          responseType: 'text'
      }
    );
  }
  
  generatePercentageAcess(hits: HitsDTO[]) {
    let totalAcess = hits.map(hit => hit.countAcess).reduce((sum, now) => sum + now);
    for (let hit of hits) {
      hit.percentAcess = this.roundNumber((hit.countAcess * 100) / totalAcess, 2);
    }
  }

  generateDataMonths(citys: CityDTO[]) {
    for (let city of citys) {
      let cityDataMonths = [];
      for (let monthNow = 1; monthNow <= 12; monthNow++) {
        let monthNowString = monthNow == 1 || monthNow == 2 ? '0' + monthNow : monthNow;
        let dataMonth = city.data.filter(dataNow => dataNow.dayMonth.endsWith(monthNowString.toString()));
        let totalQuantity = dataMonth.length;
        let totalTemperature = dataMonth.map(data => data.temperature).reduce((sum, now) => sum + now);
        let cityDataMonth: CityDataMonthDTO = {
          month: monthNow.toString(),
          quantity: totalQuantity,
          temperature: totalTemperature,
          temperatureAverage: this.roundNumber(totalTemperature / totalQuantity, 1)
        }
        cityDataMonths.push(cityDataMonth);
      }
      city.dataMonth = cityDataMonths;
    } 
  }

  private roundNumber(num, dp) {
    num = String(num);
    if (num.indexOf('.') == -1) {
        return num;
    }

    let parts = num.split('.'),
        beforePoint = parts[0],
        afterPoint = parts[1],
        shouldRoundUp = afterPoint[dp] >= 5,
        finalNumber;

    afterPoint = afterPoint.slice(0, dp);
    if (!shouldRoundUp) {
        finalNumber = beforePoint + '.' + afterPoint;
    } else if (/^9+$/.test(afterPoint)) {
        finalNumber = Number(beforePoint) + 1;
    } else {
        let i = dp-1;
        while (true) {
            if (afterPoint[i] == '9') {
                afterPoint = afterPoint.substr(0, i) +
                             '0' +
                             afterPoint.substr(i+1);
                i--;
            } else {
                afterPoint = afterPoint.substr(0, i) +
                             (Number(afterPoint[i]) + 1) +
                             afterPoint.substr(i+1);
                break;
            }
        }

        finalNumber = beforePoint + '.' + afterPoint;
    }

    return Number(finalNumber.toString().replace(/0+$/, ''));
  }

}
