let taginput = document.querySelector(".tag-input");
let btntags = document.getElementsByClassName("btn-tags");
let tags = [];

for (let btns of btntags) {
    btns.addEventListener("click", function() {
        let id = this.getAttribute("id");

        this.classList.toggle("tag-check");

        // Check if the tag is already selected
        if (tags.includes(id)) {
            tags = tags.filter(tag => tag !== id); // Remove if already exists
        } else {
            tags.push(id); // Add new tag
        }

        // Update the input field value
        taginput.value = tags.join(", "); // Join tags with a comma and space

        console.log(tags);
    });
};