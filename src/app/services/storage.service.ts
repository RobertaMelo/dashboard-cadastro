import { Injectable } from '@angular/core';
import { TokenDTO } from '../model/token.dto';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

    private localToken = 'localToken';

    getLocalToken() : TokenDTO {
        let localToken = localStorage.getItem(this.localToken);
        if (localToken == null) {
            return null;
        }
        return JSON.parse(localToken);
    }

    setLocalToken(localToken : TokenDTO) {
        if (localToken == null) {
            localStorage.removeItem(this.localToken);
            return;
        }
        localStorage.setItem(this.localToken, JSON.stringify(localToken));
    }

}