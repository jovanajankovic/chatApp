import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {

  constructor(private service:DataService, private http:HttpClient) { }

  users: string[]
  selectedChats: number[]
  noChatSelected: number
  textInput: string;
  
  ngOnInit(): void {
    this.textInput = ''
    this.selectedChats = []
    this.noChatSelected = -1
    if (localStorage.getItem("users") == null) { //no messages in localStorage
      this.http.get('../../assets/json/conversation.json').subscribe(
        data => {
          this.users = data as string [];
          let messages = []
          for (let i = 0; i < this.users.length; i++){
            messages = this.users[i]["messages"]
            messages.sort((a:number, b:number) => {
              return a["time"] - b["time"]
            })
  
            for (let j = 0; j < messages.length; j++){
              messages[j]["time"] = new Date(messages[j]["time"] * 1000); 
              messages[j]["displayTime"] = this.formatAMPM(messages[j]["time"])
            }          
            this.users[i]["messages"] = messages;
            this.selectedChats[i] = -1
          }
        },
        (err: HttpErrorResponse) => {
          console.log (err.message);
        }
      );
    } else { //get messages from localStorage
      this.users = JSON.parse(localStorage.getItem("users"));
      let messages = []
      for (let i = 0; i < this.users.length; i++){
        messages = this.users[i]["messages"]
        messages.sort((a:number, b:number) => {
          return a["time"] - b["time"]
        })
        //everything works fine
        for (let j = 0; j < messages.length; j++){
          messages[j]["time"] = new Date(messages[j]["time"]);
        }          
        this.users[i]["messages"] = messages;
      }
    }
  }
  
  //function converts date into AM/PM time format, used to display time properly
  formatAMPM(date):string {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let AM_PM
    if (hours >= 12) AM_PM = 'PM'
    else AM_PM = 'AM'
    hours = hours % 12
    if (hours < 10 && hours > 0) hours = '0' + hours
    if(hours == 0) hours = 12 
    if(minutes < 10) minutes = '0' + minutes
    return hours + ':' + minutes + ' ' + AM_PM;
  }
  
  //selects chat 
  seeChat(i) {
    this.noChatSelected = i
    for (let j = 0; j < this.selectedChats.length; j++) this.selectedChats[j] = -1
    this.selectedChats[i] = 1
  }

  //gets message from input field and stores it to localStorage in order to save it
  sendMessage() {
    if (this.textInput == '') return
    let date = new Date()
    let newMessage = {
      "time": date,
      "content": this.textInput,
      "type": "sent",
      "displayTime": this.formatAMPM(date), 
    }

    this.users[this.noChatSelected]["messages"].push(newMessage);
    localStorage.setItem("users", JSON.stringify(this.users))
    this.textInput = ''; //reset input field
  }

  //if user clicks outside chat div, resets selected chat
  resetSelectedChat() {
    this.noChatSelected = -1
    for (let j = 0; j < this.selectedChats.length; j++) this.selectedChats[j] = -1
  }

}
