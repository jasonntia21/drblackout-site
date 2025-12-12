async function loadConfig() {
  const res = await fetch("./site.config.json");
  return res.json();
}

function youtubeToEmbed(url) {
  // supports youtu.be or youtube.com
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  const long = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  const id = (short && short[1]) || (long && long[1]) || "";
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

function setList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  items.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });
}

(async function init(){
  const cfg = await loadConfig();

  document.title = `${cfg.name} | Portfolio`;
  document.getElementById("name").textContent = cfg.name;
  document.getElementById("brandName").textContent = cfg.name;
  document.getElementById("footerName").textContent = cfg.name;
  document.getElementById("title").textContent = cfg.title;
  document.getElementById("intro").textContent = cfg.intro;

  // Buttons
  document.getElementById("demoBtn").href = cfg.demoReel.youtubeUrl;
  document.getElementById("resumeBtn").href = cfg.resumeUrl;
  document.getElementById("resumeBtnTop").href = cfg.resumeUrl;

  // Reel embed
  const embed = youtubeToEmbed(cfg.demoReel.youtubeUrl);
  document.getElementById("reelEmbed").src = embed;

  // Capstone
  document.getElementById("capTitle").textContent = cfg.capstone.title;
  document.getElementById("capRole").textContent = cfg.capstone.role;
  document.getElementById("capFormat").textContent = cfg.capstone.format;
  document.getElementById("capDesc").textContent = cfg.capstone.description;

  // Projects folder
  document.getElementById("projectsFolderBtn").href = cfg.projectsFolderUrl;

  // Music
  document.getElementById("musicHeadline").textContent = cfg.music.headline;
  document.getElementById("musicBody").textContent = cfg.music.body;

  const musicWrap = document.getElementById("musicEmbedWrap");
  const musicEmbed = document.getElementById("musicEmbed");
  const musicHint = document.getElementById("musicHint");

  if (cfg.music.embedUrl && !cfg.music.embedUrl.includes("PASTE_")) {
    musicWrap.style.display = "block";
    musicEmbed.src = cfg.music.embedUrl;
    musicHint.textContent = "";
  } else {
    musicHint.textContent = "Add your Spotify/SoundCloud embed URL in site.config.json to show your music player here.";
  }

  // Skills
  const chips = document.getElementById("chips");
  const chipItems = ["Premiere Pro", "Audition", "Cinematography", "Sound Design", "Storytelling"];
  chipItems.forEach(c => {
    const el = document.createElement("span");
    el.className = "chip";
    el.textContent = c;
    chips.appendChild(el);
  });

  setList("coreSkills", cfg.skills.core);
  setList("tools", cfg.skills.tools);

  // Contact
  const emailLink = document.getElementById("emailLink");
  emailLink.textContent = cfg.email;
  emailLink.href = `mailto:${cfg.email}`;
})();
