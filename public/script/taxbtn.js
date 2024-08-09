document.addEventListener("DOMContentLoaded", () => {
    let taxSwitch = document.getElementById("flexSwitchCheckDefault");

    if (taxSwitch) { // Check if element exists
        taxSwitch.addEventListener("click", () => {
            let taxinfo = document.getElementsByClassName("taxinfo");
            for (let info of taxinfo) {
                info.classList.toggle("hidden");
            }
        });
    }
});
