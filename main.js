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
// function fullScreen(){
//   doc.requestFullscreen();
// }
// fullScreen();
const database_f = firebase.database();
const messaging = firebase.messaging();
const storage_f = firebase.storage();
const deptName = "WareHouseDept2";
let ref;
let refFile;
let ioValue;
let upfileList;
let token;
const mC = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
let cliV = localStorage.getItem("stockListPassword");
let cliVo;
let cliVi;
if(cliV==null){
  const passW= prompt("재고목록 비밀번호를 설정하세요.");
  if(passW)
  {localStorage.setItem("stockListPassword",passW);

    }
  if(passW==null || passW==""){
    alert("비밀번호를 설정하지 않으면 재고목록을 볼 수 없습니다.");
    location.href="https://koacaiia.github.io/Wms-fine-/";
}}else{
  if(cliV=="1234"){
    cliVo="엠엔에프";
    cliVi="코만";
  }if(cliV=="508820"){
    cliVo="비앤케이에이";
    cliVi="비앤케이에이";
  }
}

const dateSelect = document.querySelector("#dateSelect");
const tBodyIn=document.querySelector("#tBodyIn");
const tBodyOut=document.querySelector("#tBodyOut");
const clientSelect = document.querySelector("#titleClient");
function dateChanged(){
    const d = dateSelect.value;
    tBodyIn.replaceChildren();
    tBodyOut.replaceChildren();
    getData(d);
}
dateSelect.value=dateT(new Date());
getData(dateSelect.value);
//  = clientSelect.value;
// titleDate.innerHTML = dateT(new Date());
// titleDate.innerHTML = "2024-09-24";
function getData(elapseDate){
  let ft4=0;
  let ft2=0;
  let lcl=0;
  let plt=0;
  let outE = 0;
  let outP = 0;
  document.querySelector("#tBodyIn").replaceChildren();
  document.querySelector("#tBodyOut").replaceChildren();
  for(let d in elapseDate){
    const date = elapseDate[d];
    const month=date.substring(5,7);
    const refI ="DeptName/"+deptName+"/InCargo/"+month+"월/"+date;
    const refO ="DeptName/"+deptName+"/OutCargo/"+month+"월/"+date;
    database_f.ref(refI).get().then((snapshot)=>{
        const val=snapshot.val();
        
        for(let i in val){
            const cli=val[i]["consignee"]
            if(cli ==cliVi){
              let spec="";
            if(val[i]["container40"]==="1"){
                spec="40FT";
              ft4+=1;}
            else if(val[i]["container20"]==="1"){
                spec="20FT";
              ft2+=1;}
            else if(val[i]["lclcargo"]!="0"){
                spce="LcL";
                lcl+=1;
            }else{
             continue
            }
            const tr = document.createElement("tr");
            tr.id=val[i]["refValue"];
            const td1 = document.createElement("td");
            td1.innerHTML=val[i]["consignee"];
            const td2 = document.createElement("td");
            td2.innerHTML=val[i]["container"];
            const td3 = document.createElement("td");
            td3.innerHTML=val[i]["Pqty"];
            const td4 = document.createElement("td");
            td4.innerHTML=spec;
            const td5 = document.createElement("td");
            td5.innerHTML=val[i]["description"];
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tBodyIn.appendChild(tr);
            tr.addEventListener("click",(e)=>{
                const trList = document.querySelectorAll("#tBodyIn tr");
                trList.forEach((e)=>{
                  if(e.classList.contains("clicked")){
                       e.classList.remove("clicked");}
                });
                e.target.parentNode.classList.toggle("clicked");
                // document.querySelector("#mainOut").style="display:none";
                ref=tr.id;
                ioValue="InCargo";
                popUp();
            });
            if(val[i]["working"]!=""){
                tr.style="color:red;font-weight:bold";
                }
                plt=plt+parseInt(val[i]["Pqty"]);
            }
            
        }
       
    }).
    catch((e)=>{
      console.log(e);
        // alert(e);
    });

    database_f.ref(refO).get().then((snapshot)=>{
        const val=snapshot.val();
        
        for(let i in val){
          if(val[i]["consigneeName"]==cliVo){
            const tr = document.createElement("tr");
            outE+=1;
            outP+=parseInt(val[i]["totalQty"].replace("PLT",""));
            tr.id=val[i]["keyValue"];
            let des = val[i]["description"];
            let manNo = val[i]["managementNo"];
            if(des.includes(",")){
              des = des.substring(0,des.indexOf(",")+1).replace(",","_외");
              manNo = manNo.substring(0,manNo.indexOf(",")+1).replace(",","_외");
            }
            const td1 = document.createElement("td");
            td1.innerHTML=val[i]["consigneeName"];
            const td2 = document.createElement("td");
            td2.innerHTML=val[i]["outwarehouse"];
            const td3 = document.createElement("td");
            td3.innerHTML=des;
            const td4 = document.createElement("td");
            td4.innerHTML=manNo;
            const td5 = document.createElement("td");
            td5.innerHTML=val[i]["totalQty"];
            const td6 = document.createElement("td");
            td6.innerHTML=val[i]["totalEa"];
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);
            tBodyOut.appendChild(tr);
            tr.addEventListener("click",(e)=>{
                const trList = document.querySelectorAll("#tBodyOut tr");
                trList.forEach((e)=>{
                  if(e.classList.contains("clicked")){
                    e.classList.remove("clicked");}
                });
                e.target.parentNode.classList.toggle("clicked");
                // document.querySelector("#mainIn").style="display:none";
                ref=tr.id;
                ioValue="outCargo";
                popUp();
            });
            if(val[i]["workprocess"]!="미"){
              tr.style="color:red;font-weight:bold";}
          }
        }
        
    }).catch((e)=>{
      console.log(e);
    });
  }
    
     toastOn("40FT:"+ft4+"   20FT:"+ft2+"    LCL:"+lcl,4000);
        document.querySelector("#title40").innerHTML=ft4
        document.querySelector("#title20").innerHTML=ft2
        document.querySelector("#titleP").innerHTML=plt
        document.querySelector("#titleOe").innerHTML=outE;
        document.querySelector("#titleOp").innerHTML=outP;
    
}
function popUp(){
    refFile="";
    const mainTitle = document.querySelector("#mainTitle");
    mainTitle.style="display:none";
    const mainContent = document.querySelector("#mainContent");
    mainContent.style="display:none";
    const pop = document.querySelector("#mainPop");
    pop.style="display:grid";
    const mainDiv = document.querySelector("#mainPopDiv");
    // mainDiv.replaceChildren();
    const fileInput = document.querySelector("#fileInput");
   
    const table= document.querySelector("#popInfoTable");
    const thR = table.querySelectorAll("tr")[0];
    thR.style.height="3vh";
    thR.replaceChildren();
    let thList;
    const tBody = table.querySelectorAll("tbody")[0];
    tBody.replaceChildren();
    const fileTr = document.querySelector("#imgTr");
    fileTr.replaceChildren();
    const h3List = document.querySelectorAll(".popTitleC");
    for(let i=0;i<h3List.length;i++){
      h3List[i].innerHTML="";
    }
    if(ioValue=="InCargo"){
      thList=["품명","PLT","EA","비고",];
      database_f.ref(ref).get().then((snapshot)=>{
          const val = snapshot.val();
          const container = val["container"];
          h3List[0].innerHTML=val["consignee"];
          h3List[1].innerHTML=val["container"];
          h3List[2].innerHTML=val["bl"];
          h3List[2].style.fontSize="x-small";
          database_f.ref(ref).parent.get().then((snapshot)=>{
              const val = snapshot.val();
              for(let i in val){
              const cont = val[i]["container"];
              if(container==cont){
                  
                  const tr = document.createElement("tr");
                  const td2 = document.createElement("td");
                  td2.innerHTML=val[i]["description"];
                  const td3 = document.createElement("td");
                  td3.innerHTML=val[i]["Pqty"];
                  const td4 = document.createElement("td");
                  td4.innerHTML=val[i]["incargo"];
                  const td5 = document.createElement("td");
                  td5.innerHTML=val[i]["remark"];
                  tr.appendChild(td2);
                  tr.appendChild(td3);
                  tr.appendChild(td4);
                  tr.appendChild(td5);
                  tBody.appendChild(tr);
              }}
              tBody.querySelectorAll("tr").forEach((tr)=>{
                tr.style.height="6vh";
              });
          }).catch((e)=>{
              console.log(e)});
  
      }).catch((e)=>{});
  }else if(ioValue=="outCargo"){
    thList=["품명","관리번호","PLT","EA","비고"];
     database_f.ref(ref).get().then((snapshot)=>{
          const val = snapshot.val();
          const des=val["description"].split(",");
          const manNo=val["managementNo"].split(",");
          const pQty = val["pltQty"].split(",");
          const eQty = val["eaQty"].split(",");
          h3List[0].innerHTML=val["consigneeName"];
          h3List[1].innerHTML=val["outwarehouse"];
          // const remark = val["remark"].split(" ,");
          let totalPlt=0;
          for(let i=0;i<des.length;i++){
              const tr = document.createElement("tr");
              const td1 = document.createElement("td");
              td1.innerHTML=des[i];
              const td2 = document.createElement("td");
              td2.innerHTML=manNo[i];
              const td3 = document.createElement("td");
              td3.innerHTML=pQty[i];
              totalPlt+=parseInt(pQty[i]);
              const td4 = document.createElement("td");
              td4.innerHTML=eQty[i];
              // const td5 = document.createElement("td");
              // td5.innerHTML=remark[i];
              tr.appendChild(td1);
              tr.appendChild(td2);
              tr.appendChild(td3);
              tr.appendChild(td4);
              // tr.appendChild(td5);
              tBody.appendChild(tr);
          }
          tBody.querySelectorAll("tr").forEach((tr)=>{
            tr.style.height="6vh";
          });
          h3List[2].innerHTML="총출고 "+totalPlt+" PLT";
          h3List[2].style="font-size:large;margin-top:3%;color:red;";
      }).catch((e)=>{});
  }
  
//   thList.forEach((e)=>{
//     const th = document.createElement("th");
//     th.innerHTML=e;
//     tr.appendChild(th);
//  });
 for(let i=0;i<thList.length;i++){
  const th = document.createElement("th");
  th.innerHTML=thList[i];
  thR.appendChild(th);
 }
//  for(let i=4;i<thList.length;i++){
//   const th = document.createElement("th");
//   th.innerHTML=thList[i];
//   thR1.appendChild(th);
//  }
  // thead.appendChild(tr);
  const resizeImage = (settings) => {
    const file = settings.file;
    const maxSize = settings.maxSize;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement("canvas");
  
    const dataURItoBlob = (dataURI) => {
      const bytes =
        dataURI.split(",")[0].indexOf("base64") >= 0
          ? atob(dataURI.split(",")[1])
          : unescape(dataURI.split(",")[1]);
      const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const max = bytes.length;
      const ia = new Uint8Array(max);
      for (let i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
      return new Blob([ia], { type: mime });
    };
  
    const resize = () => {
      let width = image.width;
      let height = image.height;
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      return dataURItoBlob(dataUrl);
    };
  
    return new Promise((ok, no) => {
      if (!file) {
        return;
      }
      if (!file.type.match(/image.*/)) {
        no(new Error("Not an image"));
        return;
      }
      reader.onload = (readerEvent) => {
        image.onload = () => {
          return ok(resize());
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImgInput = (e) => {
    fileTr.replaceChildren();
    upfileList = e.target.files;
    for(let i=0;i<e.target.files.length;i++){
    const config = {
      file: e.target.files[i],
      maxSize: 1500,
    };
    const imgTag = document.createElement("td");
    resizeImage(config)
      .then((resizedImage) => {
        const url = window.URL.createObjectURL(resizedImage);
        const img = document.createElement("img");
        img.className = "local-img"
        img.addEventListener("click", (e) => {
          img.parentNode.classList.toggle("file-selected");
          showModal(url,imgTag)
        });
        img.setAttribute("src", url);
        img.style.display = "block";
        imgTag.style.width="32.5vw";
        imgTag.style.height="29vh";
        img.style.width="100%";
        img.style.height="100%";
        img.style.objectFit = "scale"; // Ensures the image covers the container without distortion

        // Create a container div to center the image
        // const imgContainer = document.createElement("div");
        // imgContainer.style.display = "flex";
        // imgContainer.style.justifyContent = "center";
        // imgContainer.style.alignItems = "center";
        // imgContainer.style.width = "100%";
        // imgContainer.style.height = "29vh";
        // imgContainer.style.position = "relative";
        // imgContainer.appendChild(img);

        imgTag.appendChild(img);
        fileTr.appendChild(imgTag);
      })
      .then(() => {
        // const img = document.querySelector(".profile-img");
        // img.onload = () => {
        //   const widthDiff = (img.clientWidth - imgTag.offsetWidth);
        //   console.log(img.clientHeight,imgTag.offsetHeight);
        //   const heightDiff = (img.clientHeight - imgTag.offsetHeight) ;
        //   img.style.transform = `translate( -${widthDiff}px , -${heightDiff}px)`;
        // };
      })
      .catch((err) => {
        console.log(err);
      });
    }
    // document.querySelector(".upload-name").value=document.querySelector("#fileInput").value;
  };
  fileTr.replaceChildren();
  let imgRef=ref.replace("DeptName","images").replaceAll("/",",");
  // imgRef.replace("/",",");
  imgRef = imgRef.split(",");
  const io=imgRef[4];
  const dateArr = imgRef[2];
  imgRef[3]=dateArr;
  imgRef[2]=io;
  imgRef.splice(4,1);
  imgRef=imgRef.toString().replaceAll(",","/")+"/";
  console.log(imgRef);
  refFile=imgRef;
  storage_f.ref(imgRef).listAll().then((res)=>{
    res.items.forEach((itemRef)=>{
      itemRef.getDownloadURL().then((url)=>{
        const td = document.createElement("td");
        const img = document.createElement("img");
        img.src=url;
        img.className="server-img";
        img.addEventListener("click", (e) => {
          img.parentNode.classList.toggle("file-selected");
          showModal(url,itemRef.name)
        });
        img.style.display="block";
        td.style.width="32.5vw";
        td.style.height="50vh";
        img.style.width="100%";
        img.style.height="100%";
        img.style.objectFit = "scale-down"; // Ensures the image covers the container without distortion
        // Create a container div to center the image
        // const imgContainer = document.createElement("div");
        // imgContainer.style.display = "flex";
        // imgContainer.style.justifyContent = "center";
        // imgContainer.style.alignItems = "center";
        // imgContainer.style.width = "100%";
        // imgContainer.style.height = "29vh";
        // imgContainer.style.position = "relative";
        // imgContainer.appendChild(img);
        td.appendChild(img);
        fileTr.appendChild(td);
      });
    });
  });
};
function popClose(){
    document.querySelector("#mainTitle").style="display:grid";
    document.querySelector("#mainPop").style="display:none";
    document.querySelector("#mainContent").style="display:grid";
    document.querySelectorAll(".clicked").forEach((e)=>{
        e.classList.remove("clicked");
    });
    // document.querySelector("#mainOut").style="display:block";
}
const fileTr = document.querySelector("#imgTr");
function upLoad(){
    const fileInput = document.querySelector("#fileInput");
    
    let imgUrls = [];
    // const forTd = fileTr.querySelectorAll("td");
    const img = fileTr.querySelectorAll(".local-img");
    console.log(img);
    if(img.length==0){
      toastOn("사진 전송 없이 작업 완료 등록만 진행 합니다.");
          }else{
            for(let i=0;i<img.length;i++){
              console.log(img[i].src);
              const imgSrc = img[i].src;
              imgUrls.push(imgSrc);
            }
            const storageRef = storage_f.ref(refFile);
            console.log(imgUrls);
    imgUrls.forEach((imgUrl, index) => {
      fetch(imgUrl)
          .then(response => response.blob())
          .then(blob => {
              // const fileName = imgUrl.split('/').pop(); // Extract file name from URL
              const selectTr = document.querySelector(".clicked");
              const fileName = selectTr.cells[0].innerHTML+"_"+selectTr.cells[2].innerHTML+"_"+selectTr.cells[3].innerHTML+"_"+selectTr.cells[4].innerHTML+"_"+index+"_"+returnTime();
              const file = new File([blob], fileName, { type: blob.type });
              const fileRef = storageRef.child(fileName.replace("/","_"));
              fileRef.put(file).then((snapshot) => {
                  if (index === imgUrls.length - 1) {
                      // alert(imgUrls.length+" 개 Images업로드 완료");
                      console.log("업로드 완료");
                      fileTr.replaceChildren();
                      let imgRef=ref.replace("DeptName","images").replaceAll("/",",");
                      // imgRef.replace("/",",");
                      imgRef = imgRef.split(",");
                      const io=imgRef[4];
                      const dateArr = imgRef[2];
                      imgRef[3]=dateArr;
                      imgRef[2]=io;
                      imgRef.splice(4,1);
                      imgRef=imgRef.toString().replaceAll(",","/")+"/";
                      console.log(imgRef);
                      refFile=imgRef;
                      storage_f.ref(imgRef).listAll().then((res)=>{
                        res.items.forEach((itemRef)=>{
                          itemRef.getDownloadURL().then((url)=>{
                            const td = document.createElement("td");
                            const img = document.createElement("img");
                            img.src=url;
                            img.className="server-img";
                            img.addEventListener("click", (e) => {
                              img.parentNode.classList.toggle("file-selected");
                            });
                            img.style.display="block";
                            td.style.width="32.5vw";
                            td.style.height="50vh";
                            img.style.width="100%";
                            img.style.height="100%";
                            img.style.objectFit = "cover"; // Ensures the image covers the container without distortion
                    
                            // Create a container div to center the image
                            const imgContainer = document.createElement("div");
                            imgContainer.style.display = "flex";
                            imgContainer.style.justifyContent = "center";
                            imgContainer.style.alignItems = "center";
                            imgContainer.style.width = "100%";
                            imgContainer.style.height = "100%";
                            imgContainer.style.position = "relative";
                            imgContainer.appendChild(img);
                            td.appendChild(imgContainer);
                            fileTr.appendChild(td);
                          });
                        });
                      });
                      // popClose();
                  }
              });
          })
          .catch(error => {
            alert("Error uploading file:", error);
            console.error("Error uploading file:", error);
        });
      });
      toastOn(imgUrls.length+" 파일 업로드 완료");
          }
    let w;
    if(ioValue=="InCargo"){
      w={"working":"컨테이너진입"}
    }else{
      w={"workprocess":"완"}
    }
    database_f.ref(ref).update(w);
}
if(mC){
  // document.querySelector("#titleDate").style="display:none";
  // toastOn("모바일 환경에서 접속 됩니다.1");
  // const osRe = document.querySelector("#osRe");
  // osRe.classList.add("mobile");
  // osRe.classList.remove("osInput");
}else{
  const btn = document.querySelector("#titleDate");
  // btn.innerHTML="일정 업로드 Page Load";
  // td.forEach((e)=>{
  //   console.log(e);
  //   e.style.fontSize="small";
  // });
  }
function toastOn(msg,t){
  if(t == null){
    t=2000;
  }
  const toastMessage = document.createElement("div");
  toastMessage.id="tost_message";
  toastMessage.innerHTML = msg; 
  toastMessage.classList.add('active');
  document.body.appendChild(toastMessage);
  setTimeout(function(){
      toastMessage.classList.remove('active');
  },t);
}
function fileRemove(){
  const fileInput = document.querySelector("#fileInput");
  const fileTr = document.querySelector("#imgTr");
  let fileRemove = fileTr.querySelectorAll(".file-selected");
  const confirmRemove = confirm(fileRemove.length+" 개의 파일을 삭제하시겠습니까?");
  const imgUrls = []; 
  if(confirmRemove){
    for(let i=0;i<fileRemove.length;i++){
      fileRemove[i].remove();
    }
    fileTr.querySelectorAll("td").forEach((td)=>{
      const img = td.querySelector("img");
      const imgSrc = img.src;
      imgUrls.push(imgSrc);
    });
    
    // fileInput.value = imgUrls.join(", ");
  }
  closeModal();
}
function dateNext(){
  const d = new Date(dateSelect.value);
  if(d.getDay()===5){
    d.setDate(d.getDate()+3);
    toastOn("다음주 월요일 로 지정 됩니다.")
  }else if(d.getDay()===6){
    d.setDate(d.getDate()+2);
    toastOn("다음주 월요일 로 지정 됩니다.")
  }else{
    d.setDate(d.getDate()+1);
  }
  dateSelect.value=dateT(d);
  dateChanged();
}
function osSubmit(){
  const date = document.querySelector("#dateSelect").value;
  const year = date.substring(0,4);
  const month= date.substring(5,7);
  const refOs ="DeptName/"+deptName+"/Os/"+year+"/"+month+"월/"+date;
  const osM= document.querySelector("#osMo").value;
  const osWf = document.querySelector("#osWf").value;
  const osWo = document.querySelector("#osWo").value;
  const osR = document.querySelector("#osRe").value;
  const osObject={"osM":osM,"osWf":osWf,"osWo":osWo,"osR":osR};
  database_f.ref(refOs).update(osObject).then((e)=>{
    toastOn(osObject);
  }).catch((e)=>{});
}
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/firebase-messaging-sw.js')
//     .then((registration) => {
//       console.log('Service Worker registered with scope:', registration.scope);
//     })
//     .catch((err) => {
//       console.error('Service Worker registration failed:', err);
//     });
// }
// function requestPermission(){
//   Notification.requestPermission().then((permission)=>{
//     if(permission =="granted"){
//       console.log("Notification Permission Granted");
//       getToken();;
//     }else{
//       console.log("Unable to get Permission to Notify.")
//     }
//   });
//   if(!("Notification" in window)){
//     console.log("This browser does not support notifications.");
//   }
// }
// function getToken() {
//   return messaging.getToken({ vapidKey: 'BMSh5U53qMZrt9KYOmmcjST0BBjua_nUcA3bzMO2l5OUEF6CgMnsu-_2Nf1PqwWsjuq3XEVrXZfGFPEMtE8Kr_k' }) // Replace with your actual VAPID key
//     .then(currentToken => {
//       if (currentToken) {
//         console.log('FCM token:', currentToken);
//         token = currentToken;
//         return currentToken;
//       } else {
//         console.log('No registration token available. Request permission to generate one.');
//         return null;
//       }
//     })
//     .catch(err => {
//       console.log('An error occurred while retrieving token. ', err);
//       return null;
//     });
// }
// messaging.onMessage((payload) => {
//   console.log('Message received. ', payload);
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//       body: payload.notification.body,
//        icon: payload.notification.icon || '/images/default-icon.png'
//   };
//   console.log(notificationTitle,notificationOptions);
//   new Notification(notificationTitle, notificationOptions);
//   // alert(payload.notification.body);
// });

// // Call requestPermission on page load
// // document.addEventListener('DOMContentLoaded', () => {
// //   requestPermission();
// // });

// function sendMessage(token, title, body, icon) {
//   const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';
//   const serverKey = "AAAAYLjTacM:APA91bEfxvEgfzLykmd3YAu-WAI6VW64Ol8TdmGC0GIKao0EB9c3OMAsJNpPCDEUVsMgUkQjbWCpP_Dw2CNpF2u-4u3xuUF30COZslRIqqbryAAhQu0tGLdtFsTXU5EqsMGaMnGK8jpQ"; // Replace with your actual server key

//   const messagePayload = {
//     to: token,
//     notification: {
//       title: title,
//       body: body,
//       icon: icon || '/images/default-icon.png'
//     }
//   };

//   fetch(fcmEndpoint, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'key=' + serverKey
//     },
//     body: JSON.stringify(messagePayload)
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Message sent successfully:', data);
//   })
//   .catch(error => {
//     console.error('Error sending message:', error);
//   });
// }

// // Example usage
// document.addEventListener('DOMContentLoaded', () => {
//   requestPermission();

//   // Example: Send a message after getting the token
//   getToken().then(token => {
//     if (token) {
//       sendMessage(token, 'Hello!', 'This is a test message.', '/images/icon.png');
//     }
//   });
// });
 function reLoad(){
  console.log(mC);
  if(mC){
    location.reload();
  }else{
    location.href="https://koacaiia.github.io/Wms-fine-/";
  }
 }

function popDetail(ref){
  location.href=`imagePop.html?ref=${encodeURIComponent(ref)}`;
}
function returnTime(){
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return formattedTime;
}
function otherContents(e){
  location.href=e.id+".html";
}
function showModal(url,imgTag){
  const modal = document.getElementById("imgModal");
    const modalImg = document.getElementById("modalImg");
    modalImg.src = url;
    modal.style.display = "block";

    // Store the imgTag for later use
    modalImg.dataset.imgTag = imgTag;
}
function closeModal() {
  const modal = document.getElementById("imgModal");
  modal.style.display = "none";
}
function deleteImage() {
  const modalImg = document.getElementById("modalImg");
  const imgTag = modalImg.dataset.imgTag;
  console.log(imgTag);
  imgTag.remove();
  closeModal();
}
function saveImg() {
  const modalImg = document.getElementById("modalImg");
  console.log(modalImg);
  const url = modalImg.src;
  console.log(url.name);
  saveAs(url, modalImg.dataset.imgTag);
  
}
function popSaveAll(){
  const fileTr = document.querySelector("#imgTr");
  const img = fileTr.querySelectorAll(".server-img");
  const imgUrls = [];
  for(let i=0;i<img.length;i++){
    const imgSrc = img[i].src;
    imgUrls.push(imgSrc);
  }
  imgUrls.forEach((imgUrl, index) => {
    fetch(imgUrl)
        .then(response => response.blob())
        .then(blob => {
            const fileName = "SaveAll_"+index+"_"+returnTime();
            const file = new File([blob], fileName, { type: blob.type });
            saveAs(file, fileName);
        })
        .catch(error => {
          alert("Error uploading file:", error);
          console.error("Error uploading file:", error);
      });
    });
}
function titleConfirm(){
  const clientEncrypt =clientSelect.value;
  if(clientEncrypt==508820){
    cliV="비앤케이에이";}
  tBodyIn.replaceChildren();
  tBodyOut.replaceChildren();
  getData(dateSelect.value);
}
function encryptKoreanToNumber(text) {
  let encryptedText =0;
  for (let char of text) {
      const charCode = char.charCodeAt(0);
      if (charCode >= 0xAC00 && charCode <= 0xD7A3) { // 한글 음절 범위
          const number = (charCode - 0xAC00 + 100000).toString().padStart(6, '0');
          encryptedText += parseInt(number);
      } else {
          encryptedText += parseInt(char); // 한글이 아닌 문자는 그대로 추가
      }
  }
  return encryptedText;
}
function stockList(){
  // window.location.href = "stockList.html";
  const btnList = document.querySelector("#btnList");
  btnList.classList.toggle("stockList");
  if(btnList.classList.contains("stockList")){
    document.querySelector("#mainContent").style="display:none";
    btnList.innerHTML="입,출고 현황";
  }
  else{
    document.querySelector("#mainContent").style="display:grid";
    btnList.innerHTML="재고목록";
  }
}
function peroid(value){
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
    console.log("elapseDate",elapseDate);
    document.querySelector("#dateSelect").innerHTML = elapseDate[0]+" ~ "+elapseDate[elapseDate.length-1];
    getData(elapseDate);
    
  }