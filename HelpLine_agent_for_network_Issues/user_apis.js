const express=require("express");

const { WebhookClient }= require("dialogflow-fulfillment");

const { Payload }=require("dialogflow-fulfillment");

const router=express.Router();

//randomstring for random Generating String
var  random_string= require("randomstring");
//getting both schemas
const {coll1,coll2}=require("./user_schema.js");

var taken_number=0;
var additional_options=0;

let tokens_present=[];
let total_count={1:0,2:0,3:0,4:0,5:0};

//get details of the user by phone number
router.post("/troble_shoot",express.json(),(req,res)=>{
  const agent_tim=new WebhookClient({
    request:req,
    response:res
  });

  async function user_told_yes(agent_tim) {
    var number=agent_tim.parameters.phone_number;

    taken_number=number;
    await coll1.findOne({phone:number}).then((data)=>{
      agent_tim.add("Hi! "+data['name']+" How can I help you?");
    }).catch((err)=>{
      agent_tim.add("Number "+number.toString()+" is not found");
    });
  }

  function user_report(agent_tim){
    var issues_category={
      1:"Connection Errors and Network Connectivity ",
      2:"Weak Wi-Fi Signal",
      3:"IP Conflicts",
      4:"Faulty Cables",
      5:"Buffering Problems"
    };

    const choosen_value=agent_tim.parameters.number;

    var value=issues_category[choosen_value];

    //Generating random String
    var troble_ticket=random_string.generate(10);

    const data={
      phone:taken_number,
      issue_of_the_user: value,
    }

    while(tokens_present.includes(troble_ticket))
      troble_ticket=random_string.generate(10);
    data.token=troble_ticket;
    data.status= "pending";
    //Issue time
    var current_details=new Date();
    var date=current_details.getDate().toString()+"/"+current_details.getMonth().toString()+"/"+current_details.getYear().toString();
    var time=current_details.getHours().toString()+":"+current_details.getMinutes().toString()+":"+current_details.getSeconds().toString();
    data.time_of_the_issue= "On "+date+" an issue is registered at time "+time ;
    var record=new coll2(data);
    console.log(record);
    record.save().then(()=>{
      console.log("Added successfully!");
    }).catch(err=>{
        console.log(err);
    });
    agent_tim.add("The issue reported is: "+value+"\n Your ticket number is: "+troble_ticket);
    total_count[choosen_value]=total_count[choosen_value]+1;
    agent_tim.add("Are you satisfied with our service!");
  }
  function user_payload(agent_tim){

    var payLoadData=
  		{
    "richContent": [
      [
        {
          "type": "list",
          "title": "Connection Errors and Network Connectivity",
          "subtitle": "Press '1'",
          "event": {
            "name": "",
            "languageCode": "",
            "parameters": {}
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "list",
          "title": "Weak Wi-Fi Signal",
          "subtitle": "Press '2'",
          "event": {
            "name": "",
            "languageCode": "",
            "parameters": {}
          }
        },
  	  {
          "type": "divider"
        },
  	  {
          "type": "list",
          "title": "IP Conflicts",
          "subtitle": "Press '3'",
          "event": {
            "name": "",
            "languageCode": "",
            "parameters": {}
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "list",
          "title": "Faulty Cables",
          "subtitle": "Press '4'",
          "event": {
            "name": "",
            "languageCode": "",
            "parameters": {}
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "list",
          "title": "Buffering Problems",
          "subtitle": "Press '5'",
          "event": {
            "name": "",
            "languageCode": "",
            "parameters": {}
          }
        }
      ]
    ]
  }
  agent_tim.add("What type of Issue did you face is it");
agent_tim.add(new Payload(agent_tim.UNSPECIFIED,payLoadData,{sendAsMessage:true,rawPayload:true}));

}
// function send_data(agent_tim){
//   var payload={
//   "richContent": [
//     [
//       {
//         "type": "chips",
//         "options":[
//           {
//             "text": "Chip 1",
//             "image": {
//               "src": {
//                 "rawUrl": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.iconfinder.com%2Ficons%2F1911957%2Fbar_chart_bar_graph_charts_comparison_graphs_icon&psig=AOvVaw150n7i3icdTkT-qYp8HpcL&ust=1612577953703000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKDuiZPX0e4CFQAAAAAdAAAAABAD"
//               }
//             },
//             "link": "https://www.onlinecharttool.com/graph?selected_graph=bar"
//           }
//         ]
//       }
//     ]
//   ]
// }
//   agent_tim.add(new Payload(agent_tim.UNSPECIFIED,payload,{sendAsMessage:true,rawPayload:true}));
// }
var intent_map=new Map();
// intent_map.set("UserTrobleShoot-no-number",user_told_no);
intent_map.set("UserTrobleShoot",user_told_yes);
intent_map.set("UserTrobleShoot-custom",user_payload);
intent_map.set("UserTrobleShoot-custom-custom",user_report);
//intent_map.set("UserTrobleShoot-custom-custom-yes",send_data);

agent_tim.handleRequest(intent_map);
});

//Exporting it to user_schema
module.exports=router;
