const down_arrow = document.getElementById("down_arrow");
const up_arrow = document.getElementById("up_arrow");
let storyCounter = 0; // Counter for stories
let stories = []; // Array to store the user stories
const alertPopup = document.getElementById("alertPopup");

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

document.getElementById("addStoryButton").addEventListener("click", function(event) {
  event.preventDefault();
  addStory();
});

function showAlert(message, type) {
  alertPopup.textContent = message;
  alertPopup.className = `alert-popup alert-${type} show`;

  setTimeout(() => {
    alertPopup.classList.remove("show");
  }, 3000); // Hide after 3 seconds
}

function addStory() {
  const userStory = document.getElementById("userStory").value.trim();
  const priority = document.getElementById("priority").value;
  const description = document.getElementById("description").value.trim();

  const userStoryPattern = /^As a (.+?), I want to (.+?) so that (.+)$/i;
  const matches = userStoryPattern.exec(userStory);

  if (!matches || matches.length !== 4) {
    showAlert("Invalid user story format! Please use the format: 'As a [role], I want to [goal] so that [reason]'.", "error");
    return;
  }

  const actor = matches[1];
  const goal = matches[2];
  const reason = matches[3];

  if (!userStory || !description || !actor || !goal || !reason) {
    showAlert("Please fill in all the fields before adding a story.", "error");
    return;
  }

  stories.push({ userStory, actor, goal, reason, priority, description });
  storyCounter++;
  document.getElementById("cartCounter").textContent = storyCounter;
  document.getElementById("userStory").value = "";
  document.getElementById("description").value = "";

  showAlert("Story added successfully!", "success");
}

function toggleCart() {
  const cartPopup = document.getElementById("cartPopup");
  const storyList = document.getElementById("storyList");
  storyList.innerHTML = "";

  if (cartPopup.classList.contains("active")) {
      cartPopup.classList.remove("active");
  } else {
      stories.forEach((story, index) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${index + 1}. ${story.userStory} (Priority: ${story.priority})`;
          storyList.appendChild(listItem);
      });

      cartPopup.classList.add("active");
  }
}

function closeCart() {
  document.getElementById("cartPopup").classList.remove("active");
}


function submitStories() {
  if (stories.length < 2) {
    document.getElementById("storyWarning").style.display = "block";
    return;
  }

  document.getElementById("storyWarning").style.display = "none";
  document.getElementById("loader").style.display = "block";
  document.getElementById("storyList").innerHTML = "";

  fetch("/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stories),
  })
    .then((response) => response.ok ? response.json() : Promise.reject("Failed to submit stories."))
    .then((prioritizedFeatures) => {
      const storyList = document.getElementById("storyList");
      prioritizedFeatures.forEach((feature, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${feature}`;
        storyList.appendChild(listItem);
      });

      document.getElementById("downloadPdfButton").style.display = "inline-block";
      showAlert("Stories analyzed successfully!", "success");
    })
    .catch((error) => showAlert(error, "error"))
    .finally(() => document.getElementById("loader").style.display = "none");
}

document.getElementById("downloadPdfButton").addEventListener("click", () => {
  fetch("http://localhost:8080/analyze/download-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stories),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`Failed to download PDF: ${text}`);
        });
      }
      return response.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "UserStories.pdf";
      a.click();
      URL.revokeObjectURL(url);
      showAlert("PDF downloaded successfully!", "success");
    })
    .catch((error) => showAlert(error.message, "error"));
});
