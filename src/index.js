import * as deepar from "deepar";
import Carousel from "./carousel.js";

// Log the version. Just in case.
console.log("Deepar version: " + deepar.version);

// Top-level await is not supported.
// So we wrap the whole code in an async function that is called immediatly.
(async function () {
  // Get the element you want to place DeepAR into. DeepAR will inherit its width and height from this and fill it.
  const previewElement = document.getElementById("ar-screen");

  // trigger loading progress bar animation
  const loadingProgressBar = document.getElementById("loading-progress-bar");
  loadingProgressBar.style.width = "100%";

  // All the effects are in the public/effects folder.
  // Here we define the order of effect files.
  const effectList = [
    // Only keep the requested effects
    "effects/Bloobloom-BB-172-optimist-in-honey-honey-Clear-v2.deepar", // BB-172+-honey-honey
    "effects/RB218060171.deepar",
    "effects/RB36899064S2.deepar",
    "effects/Prada Linea Rossa-PS 54YS 1BO06U 74-03-v2-Compressed.deepar", // BO06U
  ];

  let deepAR = null;
  // Map known effects to their thumbnail images; others will use a text label
  const effectThumbMap = {
    "ray-ban-wayfarer": "ray-ban-wayfarer.png",
    "viking_helmet": "viking.png",
    "MakeupLook": "makeup.png",
    "Split_View_Look": "makeup-split.png",
    "flower_face": "flower_face.png",
    "Stallone": "stallone.png",
    "galaxy_background_web": "galaxy.png",
    "Humanoid": "humanoid.png",
    "Neon_Devil_Horns": "devil_horns.png",
    "Ping_Pong": "ping_pong.png",
    "Pixel_Hearts": "pixel_hearts.png",
    "Snail": "snail.png",
    "Hope": "hope.png",
    "Vendetta_Mask": "vendetta.png",
    "Fire_Effect": "fire.png",
  };

  // Build carousel slides dynamically to match effectList
  const sliderElem = document.querySelector("#carousel .carousel-slider");
  if (sliderElem) {
    sliderElem.innerHTML = "";
    effectList.forEach((effectPath) => {
      const base = effectPath.replace(/^effects\//, "").replace(/\.deepar$/, "");
      const thumb = effectThumbMap[base];
      const slide = document.createElement("div");
      slide.className = "slide";
      if (thumb) {
        const img = document.createElement("img");
        img.className = "responsive-img";
        img.src = `thumbs/${thumb}`;
        img.alt = base;
        slide.appendChild(img);
      } else {
        const label = document.createElement("div");
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.justifyContent = "center";
        label.style.height = "100%";
        label.style.padding = "10px";
        label.style.textAlign = "center";
        label.style.color = "#fff";
        label.style.background = "rgba(0,0,0,0.2)";
        label.style.borderRadius = "12px";
        label.textContent = base;
        slide.appendChild(label);
      }
      sliderElem.appendChild(slide);
    });
  }
  const licenseKey = window.DEEPAR_LICENSE_KEY;

  // Initialize DeepAR with an effect file.
  try {
    deepAR = await deepar.initialize({
      licenseKey: licenseKey,
      previewElement,
      effect: effectList[0],
      // Removing the rootPath option will make DeepAR load the resources from the JSdelivr CDN,
      // which is fine for development but is not recommended for production since it's not optimized for performance and can be unstable.
      // More info here: https://docs.deepar.ai/deepar-sdk/platforms/web/tutorials/download-optimizations/#custom-deployment-of-deepar-web-resources
      rootPath: "./deepar-resources",
      additionalOptions: {
        cameraConfig: {
          // facingMode: 'environment'  // uncomment this line to use the rear camera
        },
      },
    });
  } catch (error) {
    console.error(error);
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("permission-denied-screen").style.display = "block";
    return;
  }

  // Hide the loading screen.
  document.getElementById("loading-screen").style.display = "none";
  document.getElementById("ar-screen").style.display = "block";

  window.effect = effectList[0];

  const glassesCarousel = new Carousel("carousel");
  glassesCarousel.onChange = async (value) => {
    const loadingSpinner = document.getElementById("loading-spinner");

    if (window.effect !== effectList[value]) {
      loadingSpinner.style.display = "block";
      await deepAR.switchEffect(effectList[value]);
      window.effect = effectList[value];
    }
    loadingSpinner.style.display = "none";
  };
})();
