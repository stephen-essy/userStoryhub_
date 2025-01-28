const down_arrow = document.getElementById("down_arrow");
const up_arrow = document.getElementById("up_arrow");
let storyCounter = 0; // Counter for stories
let stories = []; // Array to store the user stories


function updateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  let montName;
  const daysofWeek = ["sun", "Mon", "Tue", "WED", "Thur", "Fri", "Sat"];
  const dayName = daysofWeek[now.getDay()];
  switch (month) {
    case "1":
      montName = "Jan";
      break;
    case "2":
      montName = "Feb";
      break;
    case "3":
      montName = "Mar";
      break;
    case "4":
      montName = "Apr";
      break;
    case "5":
      montName = "May";
      break;
    case "6":
      montName = "Jun";
      break;
    case "7":
      montName = "Jul";
      break;
    case "8":
      montName = "Aug";
      break;
    case "9":
      montName = "Sept";
      break;
    case "10":
      montName = "Oct";
      break;
    case "11":
      montName = "Nov";
      break;
    case "12":
      montName = "Dec";
      break;
    default:
      montName = "MM";
      break;
  }
  document.getElementById("date").textContent = day;
  document.getElementById("time").textContent = montName;
  document.getElementById("day").textContent = dayName;
  console.log(month);
  console.log(montName);
  console.log(dayName);
}
updateTime();
const backToTopButton = document.getElementById("backToTop");
const cart=document.getElementById("cart-button")
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
      listItem.textContent = `${index + 1}. ${story.userStory} (Priority: ${story.priority})`;
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

function submitStories() {
  if (stories.length < 2) {
    document.getElementById("storyWarning").style.display = "block";
    return;
  }

  document.getElementById("storyWarning").style.display = "none";
  alert("Stories submitted for analysis!");
  // Logic for analyzing stories can be added here
}



