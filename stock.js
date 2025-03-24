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
fullScreen();
const database_f = firebase.database();
const messaging = firebase.messaging();
const storage_f = firebase.storage();
const deptName = "WareHouseDept2";
const cL = document.querySelector("#clientList");
getList("2025-03-17");
function getList(date){
    const month=date.substring(5,7);
    const ref ="DeptName/"+deptName+"/InCargo/"+month+"월/"+date;
    database_f.ref(ref).on("value",(snapshot)=>{
      console.log(cL);
      const val = snapshot.val();
      let cList=[];
      for(const key in val){
        console.log(cList)
        if(!cList.includes(val[key]["consignee"])){
          cList.push(val[key]["consignee"]);
          const op = document.createElement("option");
          op.value=val[key]["consignee"];
          op.text=val[key]["consignee"];
          cL.appendChild(op);
        }
      }
      
    });

}