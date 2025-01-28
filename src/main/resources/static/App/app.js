const down_arrow = document.getElementById("down_arrow");
const up_arrow = document.getElementById("up_arrow");
let storyCounter = 0; // Counter for stories
let stories = []; // Array to store the user stories

function updateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  let monthName;
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = daysOfWeek[now.getDay()];

  switch (month) {
    case "01": monthName = "Jan"; break;
    case "02": monthName = "Feb"; break;
    case "03": monthName = "Mar"; break;
    case "04": monthName = "Apr"; break;
    case "05": monthName = "May"; break;
    case "06": monthName = "Jun"; break;
    case "07": monthName = "Jul"; break;
    case "08": monthName = "Aug"; break;
    case "09": monthName = "Sep"; break;
    case "10": monthName = "Oct"; break;
    case "11": monthName = "Nov"; break;
    case "12": monthName = "Dec"; break;
    default: monthName = "MM"; break;
  }

  document.getElementById("date").textContent = day;
  document.getElementById("time").textContent = monthName;
  document.getElementById("day").textContent = dayName;
}
updateTime();
setInterval(updateTime, 60000);

const backToTopButton = document.getElementById("backToTop");
const cart = document.getElementById("cart-button");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    backToTopButton.classList.add("show");
    cart.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
    cart.classList.remove("show");
  }
});
backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

function addStory() {
  // Prevent form submission
  event.preventDefault();

  // Get values from form inputs
  const userStory = document.getElementById("userStory").value.trim();
  const priority = document.getElementById("priority").value;
  const description = document.getElementById("description").value.trim();

  // Validate that all fields are filled
  if (!userStory || !description) {
    alert("Please fill in all the fields before adding a story.");
    return;
  }

  // Add the story to the list
  stories.push({ userStory, priority, description });

  // Increment the story counter and update the button
  storyCounter++;
  document.getElementById("cartCounter").textContent = storyCounter;

  // Clear the input fields
  document.getElementById("userStory").value = "";
  document.getElementById("description").value = "";

  alert("Story added successfully!");
}

function toggleCart() {
  const cartPopup = document.getElementById("cartPopup");
  const storyList = document.getElementById("storyList");
  storyList.innerHTML = ""; // Clear the list before populating

  if (cartPopup.style.display === "none") {
    // Populate the list with stories
    stories.forEach((story, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${story.userStory} (Priority: ${
        story.priority
      })`;
      storyList.appendChild(listItem);
    });

    cartPopup.style.display = "block";
  } else {
    cartPopup.style.display = "none";
  }
}

function closeCart() {
  document.getElementById("cartPopup").style.display = "none";
}

//the fun beggins here
function submitStories() {
  // Ensure there are at least two stories
  if (stories.length < 2) {
    document.getElementById("storyWarning").style.display = "block";
    return;
  }

  // Hide the warning and display the loader
  document.getElementById("storyWarning").style.display = "none";
  document.getElementById("loader").style.display = "block";
  document.getElementById("storyList").innerHTML = ""; // Clear the story list

  // Send stories to the backend
  fetch("/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stories),
  })
    .then((response) => {
      // Check if the response is successful
      if (response.ok) {
        return response.json(); // Parse the JSON response
      } else {
        throw new Error("Failed to submit stories for analysis.");
      }
    })
    .then((prioritizedFeatures) => {
      // Display the results from the backend
      const storyList = document.getElementById("storyList");
      prioritizedFeatures.forEach((feature, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${feature}`;
        storyList.appendChild(listItem);
      });

      // Clear stories and reset the counter
      stories = [];
      storyCounter = 0;
      document.getElementById("cartCounter").textContent = storyCounter;

      // Inform the user of success
      alert("Stories analyzed successfully!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while analyzing the stories.");
    })
    .finally(() => {
      // Hide the loader regardless of success or failure
      document.getElementById("loader").style.display = "none";
    });
}

