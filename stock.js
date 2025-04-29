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
let refFile;
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
              const tr = document.createElement("tr");
              for(let i=0;i<tdList.length;i++){
                const td = document.createElement("td");
                td.innerHTML=val[key][tdList[i]];
                tr.appendChild(td);
              }
              tr.setAttribute("id",val[key]["refValue"]);
              tr.classList.add("stockTr");
              tr.addEventListener("click",(e)=>{
                const target = e.target.parentNode;                
                target.classList.toggle("selected");
                const trList = document.querySelectorAll(".stockTr");
                trList.forEach((tr)=>{
                  if(!tr.classList.contains("selected")){
                    tr.style.display = "none";
                    // if(tr.id=="imgTr"){
                    //   tr.style.display = "block";
                    //   }
                    // const refValue = tr.id;
                    // const ref = "DeptName/"+deptName+"/InCargo/"+month+"월/"+date[i]+"/"+refValue;
                    // database_f.ref(ref).on("value",(snapshot)=>{
                    //   const val = snapshot.val();
                    //   desEle.innerHTML=val["description"];
                    //   const storageRef = storage_f.ref(deptName+"/"+month+"월/"+date[i]+"/"+refValue);
                    //   storageRef.listAll().then((res)=>{
                    //     res.items.forEach((itemRef)=>{
                    //       const li = document.createElement("li");
                    //       li.innerHTML=itemRef.name;
                    //       li.addEventListener("click",(e)=>{
                    //         const filePath = deptName+"/"+month+"월/"+date[i]+"/"+refValue+"/"+e.target.innerHTML;
                    //         storage_f.ref(filePath).getDownloadURL().then((url)=>{
                    //           window.open(url);
                    //         });
                    //       });
                    //       desEle.appendChild(li);
                    //     });
                    //   });
                    // });
                    
                  }
                });
                popUp();
                });
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
  const fileTr = document.querySelector("#imgTr");
  function popUp(){
    refFile="";
    const imageT = document.querySelector("#imageT");
    let imageSort;
    imageT.querySelectorAll("button").forEach((e)=>{
      if(e.classList.contains("imageTableSelected")){
        imageSort = e.id;
      }
    });

    const pDiv = document.querySelector("#periodDiv");
    pDiv.style="display:none";
    const sDiv = document.querySelector("#searchDiv");
    sDiv.style="display:none";
    const tDiv = document.querySelector("#tableDiv");
    tDiv.style.height="100%";
    const pop = document.querySelector("#mainPop");
    pop.style="display:grid";
    pop.style.gridTemplateRows="2fr 1fr";
    pop.style.border="1px solid black";
    const body = document.querySelector("body");
    body.style.display="grid";
    body.style.gridTemplateRows="10vh 85vh";
    
    fileTr.replaceChildren();
  const ref = document.querySelector(".selected").id;
  let imgRef=ref.replace("DeptName","images").replaceAll("/",",");
  imgRef = imgRef.split(",");
  const io=imgRef[4];
  const dateArr = imgRef[2];
  imgRef[3]=dateArr;
  imgRef[2]=io;
  imgRef.splice(4,1);
  if(imageSort=="ioBtn"){
    imgRef=imgRef.toString().replaceAll(",","/")+"/";
  }else if(imageSort=="sampleBtn"){
    imgRef=imgRef.toString().replaceAll(",","/")+"/sample/";
  }else if(imageSort=="damageBtn"){
    imgRef=imgRef.toString().replaceAll(",","/")+"/damage/";
  }
  console.log(imageSort,imgRef)
  refFile=imgRef;
  storage_f.ref(imgRef).listAll().then((res)=>{
    console.log(res)
    res.items.forEach((itemRef)=>{
      itemRef.getDownloadURL().then((url)=>{
        const td = document.createElement("td");
        const img = document.createElement("img");
        img.src=url;
        img.className="server-img";
        console.log(url)
        img.addEventListener("click", (e) => {
          img.parentNode.classList.toggle("file-selected");
          showModal(url,itemRef.name)
        });
        img.style.display="block";
        td.style.width="32.5vw";
        td.style.height="50vh";
        img.style.width="100%";
        img.style.height="100%";
        img.style.objectFit = "scale-down"; 
        td.appendChild(img);
        fileTr.appendChild(td);
      });
    });
  }).catch((e)=>{console.log(e)});
};
function popClose(){
  location.href="https://koacaiia.github.io/CargoStatus/stockList.html";
    
}
function imageSelect(target){
  const tableSort = document.querySelector("#imageT");
  tableSort.querySelectorAll("button").forEach((e)=>{
    e.className="";    
  })
  target.classList.toggle("imageTableSelected");
  popUp();
}

const handleImgInput = (e) => {
  const fileTr=document.getElementById("imgTr")
  fileTr.replaceChildren();
  upfileList = e.target.files;
  for(let i=0;i<e.target.files.length;i++){
  const config = {
    file: e.target.files[i],
    maxSize: 1500,
  };
  const imgTag = document.createElement("td");
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

  resizeImage(config)
    .then((resizedImage) => {
      const url = window.URL.createObjectURL(resizedImage);
      const img = document.createElement("img");
      img.className = "local-img"
      img.addEventListener("click", (e) => {
        const tdList = img.parentNode.parentNode.querySelectorAll("td");
        tdList.forEach((td)=>{
            td.classList.remove("file-selected");
        });
        img.parentNode.classList.toggle("file-selected");
        console.log(img.parentNode.classList);
        showModal(url,imgTag)
      });
      img.setAttribute("src", url);
      img.style.display = "block";
      imgTag.style.width="32.5vw";
      imgTag.style.height="36vh";
      img.style.width="100%";
      img.style.height="100%";
      img.style.objectFit = "scale-down"; // Ensures the image covers the container without distortion

      imgTag.appendChild(img);
      fileTr.appendChild(imgTag);
    })
    .catch((err) => {
      console.log(err);
    });
  }
  // document.querySelector(".upload-name").value=document.querySelector("#fileInput").value;
};
document.querySelector("#fileInput").addEventListener("change",handleImgInput);
function upLoad(){
  let imageTcondition;
  let imageSort;
    imageT.querySelectorAll("button").forEach((e)=>{
      if(e.classList.contains("imageTableSelected")){
        imageSort = e.id;
      }
    });
  const selectT=document.querySelector("#imageT");
  selectT.querySelectorAll("button").forEach((e)=>{
    if(e.classList.contains("imageTableSelected")){
      imageTcondition = e.innerHTML;
    }
  });
  const selectC = prompt(imageTcondition +"추가 확인사항을 입력 하세요.",imageTcondition);
  if(selectC){
    confirm(selectC+" 의 내용으로 서버에 저장 됩니다.")
  }
  
  if(imageSort=="ioBtn"){
    refFile=refFile.toString().replaceAll(",","/")+"/";
  }else if(imageSort=="sampleBtn"){
    refFile=refFile.toString().replaceAll(",","/")+"/sample/";
  }else if(imageSort=="damageBtn"){
    refFile=refFile.toString().replaceAll(",","/")+"/damage/";
  }
  let imgUrls = [];
  const img = fileTr.querySelectorAll(".local-img");
  if(img.length==0){
    toastOn("사진 전송 없이 작업 완료 등록만 진행 합니다.");
        }else{
          for(let i=0;i<img.length;i++){
            const imgSrc = img[i].src;
            imgUrls.push(imgSrc);
          }
          const storageRef = storage_f.ref(refFile);
          
  imgUrls.forEach((imgUrl, index) => {
    fetch(imgUrl)
        .then(response => response.blob())
        .then(blob => {
            // const fileName = imgUrl.split('/').pop(); // Extract file name from URL
            const selectTr = document.querySelector(".clicked");
            const fileName = returnTime()+index;
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
                          img.style.display="block";
                          td.style="width:32.5vw;height:36vh;border:1px dashed red;border-radius:5px";
                          img.style.width="100%";
                          img.style.height="100%";
                          img.style.objectFit = "scale-down"; // Ensures the image covers the container without distortion
                          td.appendChild(img);
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

}
