const raspberryPiBase = "http://localhost:9000";

function sendPiCommand(endpoint) {
  fetch(`${raspberryPiBase}/${endpoint}`, {
    method: "POST",
    mode: "no-cors"  // Remove if CORS is properly handled server-side
  })
  .then(() => {
    console.log(`${endpoint} command sent to Raspberry Pi`);
  })
  .catch(error => {
    console.error(`Failed to send ${endpoint} command:`, error);
  });
}

const availableMachines = [
  "AFT 210XP Nanospec",
  "Nikon OPTIPHOT-88 Optical Microscope / Image Capture",
  "Oxford Plasmalab 440 Magnetron Sputtering / RIE / ECR",
  "Tencor Alpha-Step 50 Surface Profiler",
  "Zygo Mark IV Interferometer"
];


function openLoginModal() {
  document.getElementById("login-modal").style.display = "block";
}

function closeLoginModal() {
  document.getElementById("login-modal").style.display = "none";
}

function submitLogin() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (!user.includes("_") || pass !== "C832047") {
    alert("UserID must include an underscore (_) and Password must be C832047.");
    return;
  }

  closeLoginModal();
  document.getElementById("login-btn").innerText = "Log Out";
  document.getElementById("login-btn").onclick = logout;

  const available = document.getElementById("available");
  available.innerHTML = "";
  availableMachines.forEach(machine => {
    const option = document.createElement("option");
    option.text = machine;
    available.add(option);
  });

  setTimeout(() => {
    sendPiCommand("unlock");
  }, 1000);
}

function logout() {
  document.getElementById("login-btn").innerText = "LOG IN";
  document.getElementById("login-btn").onclick = openLoginModal;
  document.getElementById("available").innerHTML = "";
  document.getElementById("inuse").innerHTML = "";
  updateButtons();

  // Reset Pi screen to lock view
  sendPiCommand("lock");

}


function startMachine() {
  const selected = document.getElementById("available").selectedOptions[0];
  if (!selected) return;
  document.getElementById("inuse").add(selected);
  updateButtons();
}

function stopMachine() {
  const selected = document.getElementById("inuse").selectedOptions[0];
  if (!selected) return;
  document.getElementById("available").add(selected);
  updateButtons();
}

function stopAll() {
  const inuse = document.getElementById("inuse");
  const available = document.getElementById("available");
  while (inuse.options.length > 0) {
    available.add(inuse.options[0]);
  }
  updateButtons();
}

function updateButtons() {
  document.getElementById("start").disabled = !document.getElementById("available").selectedOptions.length;
  document.getElementById("stop").disabled = !document.getElementById("inuse").selectedOptions.length;
  document.getElementById("stop-all").disabled = document.getElementById("inuse").options.length === 0;
}

document.getElementById("available").addEventListener("change", updateButtons);
document.getElementById("inuse").addEventListener("change", updateButtons);
