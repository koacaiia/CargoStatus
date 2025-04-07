const firebaseConfig = {
    apiKey: "AIzaSyDLzmZyt5nZwCk98iZ6wi01y7Jxio1ppZQ",
    authDomain: "fine-bondedwarehouse.firebaseapp.com",
    databaseURL: "https://fine-bondedwarehouse-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fine-bondedwarehouse",
    storageBucket: "fine-bondedwarehouse.appspot.com",
    messagingSenderId: "415417723331",
    appId: "1:415417723331:web:15212f190062886281b576",
    measurementId: "G-SWBR4359JQ"
};
if(firebase.apps.length==0){
  firebase.initializeApp(firebaseConfig);
}
else{firebase.app();}
const doc =document.documentElement;
function fullScreen(){
  doc.requestFullscreen();
}
const dateT = (d)=>{
  let result_date;
  try{
  let result_month = d.getMonth()+1;
  let result_day =d.getDate();
  if(result_month<10){
      result_month ="0"+result_month;
  };
  if(result_day <10){
      result_day ="0"+result_day;
  };
  result_date = d.getFullYear()+"-"+result_month+"-"+result_day;
  return result_date;
  }catch(e){
      console.log(e);
  return result_date ="미정";
  }
};
fullScreen();
const database_f = firebase.database();
const messaging = firebase.messaging();
const storage_f = firebase.storage();
const deptName = "WareHouseDept2";
let elapseDate;
const cL = document.querySelector("#clientList");
const dateEle = document.querySelector("#entryDate");
const desEle = document.querySelector("#desList");
const tBody = document.querySelector("#stockList");
const tdList = ["date","bl","description","incargo","Pqty","remark"];
dateEle.valueAsDate = new Date();
dateEle.addEventListener("change",()=>{
  elapseDate =[];
  elapseDate.push(dateEle.value);
  getList(elapseDate);
  document.querySelector("#elapsedDate").innerHTML = elapseDate[0];
});
function getList(date,client){
    let cont20=0;
    let cont40=0;
    cL.replaceChildren();
    tBody.replaceChildren();
    if(client==undefined){
      const op = document.createElement("option");
      op.value="All Client";
      op.text="거래처 선택";
      cL.appendChild(op);
    }
    let cList=[];      
    for(let i=0;i<date.length;i++){
      const month=date[i].substring(5,7);
      const ref ="DeptName/"+deptName+"/InCargo/"+month+"월/"+date[i];
      database_f.ref(ref).on("value",(snapshot)=>{
        const val = snapshot.val();
          for(const key in val){
            if(client==undefined||client ==val[key]["consignee"]){
              const cont20Value = parseInt(val[key]["container20"]);
              const cont40Value = parseInt(val[key]["container40"]);
              cont20=cont20+cont20Value;
              cont40=cont40+cont40Value;
              console.log(cont20Value,cont40Value,cont20,cont40);
              const tr = document.createElement("tr");
              for(let i=0;i<tdList.length;i++){
                const td = document.createElement("td");
                td.innerHTML=val[key][tdList[i]];
                tr.appendChild(td);
              }
              tr.setAttribute("id",val[key]["refValue"]);
              tBody.appendChild(tr);
              if(!cList.includes(val[key]["consignee"])){
                cList.push(val[key]["consignee"]);
                const op1 = document.createElement("option");
                op1.value=val[key]["consignee"];
                op1.text=val[key]["consignee"];
                cL.appendChild(op1);
              }
            }
            
          }
          if(i==date.length-1){
              document.querySelector("#cont20").innerHTML = cont20;
              document.querySelector("#cont40").innerHTML = cont40;
          }
      });
     
    }
    
  }
  cL.addEventListener("change",()=>{
    const client = cL.value;
    getList(elapseDate,client);
  });
  function peroid(value){
    console.log(value.id);
    const today = new Date(); // 현재 날짜
    const dayOfWeek = today.getDay(); // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
    let mondayOffset; 
    let sundayOffset;
    let startDay;
    let endDay;
    const year = today.getFullYear();
    const month = today.getMonth(); // 
    if(value.id=="thisWeek"){
      mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 이번주 월요일로 이동하는 오프셋
      sundayOffset = dayOfWeek === 0 ? 0 : 6 - dayOfWeek; // 이번주 토요일로 이동하는 오프셋
      startDay = new Date(today);
      startDay.setDate(today.getDate() + mondayOffset); // 이번 주 월요일
      endDay = new Date(today);
      endDay.setDate(today.getDate() + sundayOffset); // 이번 주 일요일
    }
    if(value.id=="lastWeek"){
      mondayOffset = dayOfWeek === 0 ? -13 : -6 - dayOfWeek; // 지난주 월요일로 이동하는 오프셋
      sundayOffset = dayOfWeek === 0 ? -7 : -1 - dayOfWeek; // 지난주 일요일로 이동하는 오프셋
      startDay = new Date(today);
      startDay.setDate(today.getDate() + mondayOffset); // 이번 주 월요일
      endDay = new Date(today);
      endDay.setDate(today.getDate() + sundayOffset); // 이번 주 일요일
    }
    if(value.id=="thisMonth"){
      startDay = new Date(year, month, 1); // 이번 달의 첫 번째 날
      endDay = new Date(year, month + 1, 0); // 이번주 토요일로 이동하는 오프셋
    }
    if(value.id=="lastMonth"){
      startDay = new Date(year, month - 1, 1); // 지난 달의 첫 번째 날
      endDay = new Date(year, month, 0); // 이번주 토요일로 이동하는 오프셋
    }
    if(value.id=="thisYear"){
      startDay = new Date(year, 0, 1); // 이번 달의 첫 번째 날
      endDay = new Date(year, 11, 31); // 이번주 토요일로 이동하는 오프셋
    }
    elapseDate = []; // 날짜를 저장할 배열 초기화
    for (let d = new Date(startDay); d <= endDay; d.setDate(d.getDate() + 1)) {
        elapseDate.push(dateT(d)); // 날짜를 배열에 추가
    }
    document.querySelector("#elapsedDate").innerHTML = elapseDate[0]+" ~ "+elapseDate[elapseDate.length-1];
    getList(elapseDate);
    
  }