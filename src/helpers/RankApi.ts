import { IRank } from "@/models/Ranks";
import axios from "axios";

export abstract class RankApi {

    private static ranksAxios = axios.create();

    static async getTopRank(): Promise<IRank[]>{

        const url = 'http://localhost:8040/ranking';
        const response = await this.ranksAxios.get<IRank[]>(url);

        return response.data;
    }

    static async createTopRank(name: string, points: number){

        axios.post('http://localhost:8040/ranking', {
        Name: name,
        Points: points
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })

    }
    
}