// --- Authentication Functions ---

// Sign-Up Function
function signUp(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed up:", user);
      alert(`Welcome, ${user.email}! Your account has been created.`);
      updateUIOnAuthChange(user);
    })
    .catch((error) => {
      console.error("Sign-up error:", error.code, error.message);
      handleError(error);
    });
}

// Sign-In Function
function signIn(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed in:", user);
      alert(`Welcome back, ${user.email}!`);
      updateUIOnAuthChange(user);
    })
    .catch((error) => {
      console.error("Sign-in error:", error.code, error.message);
      handleError(error);
    });
}

// Sign-Out Function
function signOutUser() {
  auth.signOut()
    .then(() => {
      console.log("User signed out.");
      alert("You have been signed out.");
      updateUIOnAuthChange(null);
    })
    .catch((error) => {
      console.error("Sign-out error:", error);
      alert(`Error: ${error.message}`);
    });
}

// Handle Authentication Form Submissions
document.getElementById("signUpForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;
  signUp(email, password);
});
document.getElementById("signInForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;
  signIn(email, password);
});
document.getElementById("signOutButton").addEventListener("click", function() {
  signOutUser();
});

// Monitor Authentication State
auth.onAuthStateChanged(function(user) {
  updateUIOnAuthChange(user);
});

// Update UI Based on Auth State
function updateUIOnAuthChange(user) {
  if (user) {
    document.getElementById("signInDiv").style.display = "none";
    document.getElementById("signUpDiv").style.display = "none";
    document.getElementById("signOutButton").style.display = "block";
    // Load additional content
    loadEvents();
    loadJobs();
    checkFollowerRequirement();
  } else {
    document.getElementById("signInDiv").style.display = "block";
    document.getElementById("signUpDiv").style.display = "block";
    document.getElementById("signOutButton").style.display = "none";
  }
}

// Error Handling Function
function handleError(error) {
  let message;
  switch (error.code) {
    case "auth/email-already-in-use":
      message = "This email is already in use.";
      break;
    case "auth/invalid-email":
      message = "Please enter a valid email address.";
      break;
    case "auth/weak-password":
      message = "Password should be at least 6 characters.";
      break;
    case "auth/user-not-found":
    case "auth/wrong-password":
      message = "Incorrect email or password.";
      break;
    default:
      message = error.message;
  }
  alert(`Error: ${message}`);
}

// --- Event Submission Functions ---

// Toggle Promotion Options
const promoteEventCheckbox = document.getElementById("promoteEvent");
const promotionOptions = document.getElementById("promotionOptions");
promoteEventCheckbox.addEventListener("change", function() {
  if (this.checked) {
    promotionOptions.style.display = "block";
    document.getElementById("promotionLevel").required = true;
  } else {
    promotionOptions.style.display = "none";
    document.getElementById("promotionLevel").required = false;
  }
});

// Upload Event Image using Firebase Storage
function uploadEventImage(file) {
  return new Promise((resolve, reject) => {
    const storageRef = storage.ref("eventImages/" + file.name);
    const uploadTask = storageRef.put(file);
    uploadTask.on("state_changed",
      (snapshot) => {
        // (Optional: Track progress)
      },
      (error) => {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
        reject(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}

// Handle Event Form Submission
document.getElementById("eventForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  if (!auth.currentUser) {
    alert("You must be logged in to submit an event.");
    return;
  }
  let eventImageURL = "";
  const file = document.getElementById("eventImage").files[0];
  if (file) {
    eventImageURL = await uploadEventImage(file);
  }
  // Collect event data including new optional fields:
  const eventData = {
    eventName: document.getElementById("eventName").value,
    eventDateTime: document.getElementById("eventDateTime").value,
    eventLocation: document.getElementById("eventLocation").value,
    eventDescription: document.getElementById("eventDescription").value,
    eventCategory: document.getElementById("eventCategory").value,
    ticketInfo: document.getElementById("ticketInfo").value,
    organizerName: document.getElementById("organizerName").value,
    contactInfo: document.getElementById("contactInfo").value,
    socialMediaLinks: document.getElementById("socialMediaLinks").value,
    guestSpeaker: document.getElementById("guestSpeaker").value || "",
    wordOfTheDay: document.getElementById("wordOfTheDay").value || "",
    eventImageURL: eventImageURL,
    userId: auth.currentUser.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (promoteEventCheckbox.checked) {
    eventData.promoteEvent = true;
    eventData.promotionLevel = document.getElementById("promotionLevel").value;
    // Process payment via PayPal before final submission
    processPromotionPayment(eventData);
  } else {
    eventData.promoteEvent = false;
    try {
      await db.collection("events").add(eventData);
      alert("Event submitted successfully!");
      document.getElementById("eventForm").reset();
      promotionOptions.style.display = "none";
      document.getElementById("promotionLevel").required = false;
      loadEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error submitting event. Please try again.");
    }
  }
});

// --- PayPal Integration for Promotion Payments ---
function processPromotionPayment(eventData) {
  const paypalContainer = document.getElementById("paypal-button-container");
  paypalContainer.style.display = "block";
  const promotionAmountsUSD = {
    "neighborhood": 5,
    "city": 15,
    "metropolitan": 100,
    "province": 250,
    "country": 1000,
    "continent": 2500,
    "planet": 10000
  };
  const promotionLevel = eventData.promotionLevel;
  const amount = promotionAmountsUSD[promotionLevel] || 0;
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: amount.toString()
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert("Payment completed by " + details.payer.name.given_name);
        paypalContainer.style.display = "none";
        finalizeEventSubmission(eventData);
      });
    },
    onError: function(err) {
      console.error("PayPal error:", err);
      alert("Payment failed. Please try again.");
    }
  }).render("#paypal-button-container");
}

async function finalizeEventSubmission(eventData) {
  try {
    await db.collection("events").add(eventData);
    alert("Event submitted successfully!");
    document.getElementById("eventForm").reset();
    promotionOptions.style.display = "none";
    document.getElementById("promotionLevel").required = false;
    loadEvents();
  } catch (error) {
    console.error("Error adding event after payment:", error);
    alert("Error submitting event. Please try again.");
  }
}

// --- Load Events from Firestore ---
async function loadEvents() {
  const eventsRef = db.collection("events").orderBy("timestamp", "desc");
  const snapshot = await eventsRef.get();
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";
  snapshot.forEach((doc) => {
    const event = doc.data();
    const eventItem = document.createElement("div");
    eventItem.classList.add("event-item");
    eventItem.innerHTML = `
      <h2>${event.eventName}</h2>
      <p><strong>Date & Time:</strong> ${event.eventDateTime}</p>
      <p><strong>Location:</strong> ${event.eventLocation}</p>
      <p><strong>Description:</strong> ${event.eventDescription}</p>
      <p><strong>Category:</strong> ${event.eventCategory}</p>
      <p><strong>Tickets:</strong> ${event.ticketInfo}</p>
      <p><strong>Organizer:</strong> ${event.organizerName}</p>
      <p><strong>Contact:</strong> ${event.contactInfo}</p>
      ${event.eventImageURL ? `<img src="${event.eventImageURL}" alt="Event Image">` : ""}
      <p><strong>Social Media:</strong> <a href="${event.socialMediaLinks}" target="_blank">${event.socialMediaLinks}</a></p>
      ${event.guestSpeaker ? `<p><strong>Guest Speaker / Line Up:</strong> ${event.guestSpeaker}</p>` : ""}
      ${event.wordOfTheDay ? `<p><strong>Word of the Day:</strong> ${event.wordOfTheDay}</p>` : ""}
      ${event.promoteEvent ? `<p><strong>Promotion:</strong> ${event.promotionLevel}</p>` : ""}
      <div class="event-actions">
        <button class="share-button"><i class="fas fa-share"></i></button>
        <button class="save-button"><i class="fas fa-bookmark"></i></button>
        <button class="repost-button"><i class="fas fa-retweet"></i></button>
        <button class="direction-button" onclick='openDirections("${event.eventLocation}")'><i class="fas fa-map-marker-alt"></i></button>
        <button class="accommodation-button" onclick="viewAccommodations('${encodeURIComponent(event.eventLocation)}')"><i class="fas fa-hotel"></i></button>
        <button class="nearby-button" onclick="showNearbyUsers('${encodeURIComponent(event.eventLocation)}')"><i class="fas fa-users"></i></button>
        <button class="going-button" onclick="rsvpEvent('${doc.id}')"><i class="fas fa-check"></i> Going (${event.goingCount || 0})</button>
      </div>
    `;
    eventList.appendChild(eventItem);
  });
  
  document.querySelectorAll(".share-button").forEach(button => {
    button.addEventListener("click", () => {
      alert("Share functionality coming soon!");
    });
  });
  document.querySelectorAll(".save-button").forEach(button => {
    button.addEventListener("click", () => {
      alert("Save functionality coming soon!");
    });
  });
  document.querySelectorAll(".repost-button").forEach(button => {
    button.addEventListener("click", () => {
      alert("Repost functionality coming soon!");
    });
  });
}

// --- Direction, Accommodations, and Nearby Users Functions ---
function openDirections(venueAddress) {
  const url = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(venueAddress);
  window.open(url, "_blank");
}

function viewAccommodations(venueAddressEnc) {
  const url = "https://www.google.com/maps/search/?api=1&query=accommodations+near+" + venueAddressEnc;
  window.open(url, "_blank");
}

function showNearbyUsers(venueAddressEnc) {
  alert("Feature coming soon: Displaying nearby users near the event venue.");
}

// --- RSVP/Going Functionality ---
async function rsvpEvent(eventId) {
  if (!auth.currentUser) {
    alert("Please sign in to RSVP.");
    return;
  }
  const eventRef = db.collection("events").doc(eventId);
  try {
    await eventRef.update({
      goingCount: firebase.firestore.FieldValue.increment(1)
    });
    alert("Your RSVP has been recorded.");
    loadEvents();
  } catch (error) {
    console.error("Error recording RSVP:", error);
    alert("Error processing your RSVP. Please try again.");
  }
}

// --- Job Posting Functions ---
async function getCurrentUserFollowerCount() {
  if (!auth.currentUser) return 0;
  const userDoc = await db.collection("users").doc(auth.currentUser.uid).get();
  if (userDoc.exists) {
    return userDoc.data().followerCount || 0;
  }
  return 0;
}

async function checkFollowerRequirement() {
  const followerThreshold = 1000;
  const followerCount = await getCurrentUserFollowerCount();
  const submitButton = document.getElementById("jobForm").querySelector('button[type="submit"]');
  if (followerCount < followerThreshold) {
    document.getElementById("followerNotice").style.display = "block";
    submitButton.disabled = true;
  } else {
    document.getElementById("followerNotice").style.display = "none";
    submitButton.disabled = false;
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

document.getElementById("jobForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  if (!auth.currentUser) {
    alert("You must be logged in to post a job.");
    return;
  }
  const followerThreshold = 1000;
  const followerCount = await getCurrentUserFollowerCount();
  if (followerCount < followerThreshold) {
    alert(`You need at least ${followerThreshold} followers to post a job.`);
    return;
  }
  const jobData = {
    jobTitle: document.getElementById("jobTitle").value,
    jobDescription: document.getElementById("jobDescription").value,
    companyName: document.getElementById("companyName").value,
    contactEmail: document.getElementById("contactEmail").value,
    postedBy: auth.currentUser.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  if (!validateEmail(jobData.contactEmail)) {
    alert("Please enter a valid email address.");
    return;
  }
  try {
    await db.collection("jobs").add(jobData);
    alert("Job posted successfully!");
    document.getElementById("jobForm").reset();
    loadJobs();
  } catch (error) {
    console.error("Error posting job:", error);
    alert("Error posting job. Please try again.");
  }
});

async function loadJobs() {
  const jobsRef = db.collection("jobs").orderBy("timestamp", "desc");
  const snapshot = await jobsRef.get();
  const jobList = document.getElementById("jobList");
  jobList.innerHTML = "";
  snapshot.forEach((doc) => {
    const job = doc.data();
    const jobItem = document.createElement("div");
    jobItem.classList.add("job-item");
    jobItem.innerHTML = `
      <h3>${job.jobTitle}</h3>
      <p><strong>Company:</strong> ${job.companyName}</p>
      <p>${job.jobDescription}</p>
      <p><strong>Contact:</strong> <a href="mailto:${job.contactEmail}">${job.contactEmail}</a></p>
      <p><small>Posted on: ${job.timestamp ? new Date(job.timestamp.toDate()).toLocaleDateString() : "Unknown"}</small></p>
      <button onclick="reportJob('${doc.id}')"><i class="fas fa-exclamation-triangle"></i> Report</button>
    `;
    jobList.appendChild(jobItem);
  });
}

function reportJob(jobId) {
  alert(`Reporting job ID: ${jobId}\nOur team will review the posting and take appropriate action.`);
  // Further reporting implementation can be added.
}
