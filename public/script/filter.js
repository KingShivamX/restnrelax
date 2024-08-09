document.addEventListener('DOMContentLoaded', () => {
    const btns = document.getElementsByClassName("filter"); //  all buttons
    let activeFilter = ''; // Track the active filter

    for (let btn of btns) {
        btn.addEventListener('click', function() {
            const selectedTag = this.id;

            // converting node list to array
            [...btns].forEach(button => {
                button.classList.remove('tag-clicked');
            });
            
            

            // Check if the clicked filter is already active
            if (selectedTag === activeFilter) {
                this.classList.remove('tag-clicked');
                // If the same filter is clicked again, show all listings
                filterListings('all');
                activeFilter = ''; // Reset active filter
            } else {
                this.classList.add('tag-clicked');
                // Apply the new filter
                filterListings(selectedTag);
                activeFilter = selectedTag; // Set new active filter
            }
        });
    }

    function filterListings(selectedTag) {
        const listingLinks = document.querySelectorAll('.listing-link');

        listingLinks.forEach(link => {
            const tags = JSON.parse(link.getAttribute('data-tags'));

            if (tags.includes(selectedTag) || selectedTag === 'all') {
                link.style.display = 'block'; // Show listing
            } else {
                link.style.display = 'none'; // Hide listing
            };
        });
    }
});