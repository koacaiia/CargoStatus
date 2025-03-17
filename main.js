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
// const doc =document.documentElement;
// function fullScreen(){
//   doc.requestFullscreen();
// }
// fullScreen();
const database_f = firebase.database();
const messaging = firebase.messaging();
const storage_f = firebase.storage();
const deptName = "WareHouseDept2";
const dateDiv = document.querySelector("#titleDate");
const clientDiv = document.querySelector("#titleClient");
const dateT = (d)=>{
    let result_date;
    try{
    let result_month = d.getMonth()+1;
    let result_day =d.getDate();
    if(result_month<10){
        result_month ="0"+result_month;ㅈ
    };
    if(result_day <10){
        result_day ="0"+result_day;
    };
    result_date = d.getFullYear()+"-"+result_month+"-"+result_day;
    return result_date;
    }catch(e){
    return result_date ="미정";
    }
};

dateDiv.value = dateT(new Date());
initData(dateDiv.value);
function initData(date){
    console.log(date);
    // const clientV = clientDiv.innerHTML;
    const clientV = "비앤케이에이";
    const month= date.substring(5,7)+"월";
    console.log(month);
    database_f.ref("DeptName/"+deptName).get().then((snapshot)=>{
        console.log(snapshot.val());
        const inData = snapshot.val()["InCargo"][month][date];
        const outData = snapshot.val()["OutCargo"][month][date];
        console.log(inData,outData);
        for(let i in inData){
            if(inData[i]["consignee"]==clientV){
                console.log(inData[i]);
            }
        }
        for(let i in outData){
            if(outData[i]["consigneeName"]==clientV){
                console.log(outData[i]);
            }
        };
    });
};
