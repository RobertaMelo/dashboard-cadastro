import { CityDataDTO } from "./city-data.dto";
import { CityDataMonthDTO } from "./city-data-month.dto";

export interface CityDTO {
    name : string;
    data: CityDataDTO[];
    dataMonth?: CityDataMonthDTO[];
}