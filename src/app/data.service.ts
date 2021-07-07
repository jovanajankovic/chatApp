import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  projectList = '../assets/json/conversation.json';
  converations: string [];

  constructor(private http:HttpClient) { }

  getData(): string[] {
    alert("usao u get data");
    this.http.get('../assets/json/conversation.json').subscribe(
      data => {
        this.converations = data as string [];	 // FILL THE ARRAY WITH DATA.
        //  console.log(this.arrBirds[1]);
        alert("dohvatio data")
        alert(this.converations[0]["name"]);
        return this.converations;
      },
      (err: HttpErrorResponse) => {
        console.log (err.message);
      }
    );
    return this.converations;
  }

}
