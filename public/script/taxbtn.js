let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click" , ()=>{
    let taxinfo = document.getElementsByClassName("taxinfo");
    for (info of taxinfo) {
        info.classList.toggle("hidden");
    }
});