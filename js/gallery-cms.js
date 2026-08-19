// ============================================
// WAADA Gallery CMS
// WordPress.com REST API → Gallery Page
// ============================================

const GALLERY_API =
  "https://public-api.wordpress.com/rest/v1.2/sites/waadacms.wordpress.com/posts/?category=gallery&number=100";


// ============================================
// Remove HTML and create clean text
// ============================================

function getPlainText(html = "") {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  return temp.textContent
    .replace(/\s+/g, " ")
    .trim();
}


// ============================================
// Short Gallery Card Description
// ============================================

function getCardDescription(post) {

  // Prefer WordPress excerpt
  let text = getPlainText(post.excerpt || "");

  // If excerpt does not exist,
  // use text from the post content
  if (!text) {
    text = getPlainText(post.content || "");
  }

  // Limit card description length
  const maxLength = 220;

  if (text.length > maxLength) {
    text =
      text.substring(0, maxLength).trim() + "...";
  }

  return text;
}


// ============================================
// Load Gallery Albums
// ============================================

async function loadGalleryAlbums() {

  const galleryList =
    document.getElementById("gallery-list");


  if (!galleryList) {

    console.error(
      "Gallery container #gallery-list was not found."
    );

    return;
  }


  try {

    // ----------------------------------------
    // Fetch Gallery Posts
    // ----------------------------------------

    const response =
      await fetch(GALLERY_API);


    if (!response.ok) {

      throw new Error(
        `WordPress API error: ${response.status}`
      );

    }


    const data =
      await response.json();


    console.log(
      "WAADA Gallery API:",
      data
    );


   const posts =
  data.posts || [];


// ============================================
// Sort Albums by Event Date
// Newest event first
// ============================================

posts.sort((a, b) => {
  return new Date(b.date) - new Date(a.date);
});


// Remove loading message
galleryList.innerHTML = "";

    // ----------------------------------------
    // No Gallery Posts
    // ----------------------------------------

    if (posts.length === 0) {

      galleryList.innerHTML = `
        <div class="col-12 text-center">
          <p>No galleries available yet.</p>
        </div>
      `;

      return;
    }



    // ----------------------------------------
    // Generate Gallery Cards
    // ----------------------------------------

    posts.forEach((post) => {

      const title =
        getPlainText(post.title || "Untitled");


      const description =
        getCardDescription(post);


      // ======================================
      // Featured Image
      //
      // SAME IMAGE IS USED FOR:
      // 1. Gallery card cover
      // 2. Album page Hero
      // ======================================

      const image =
        post.featured_image || "";


      // ======================================
      // Create Bootstrap Column
      // ======================================

      const album =
        document.createElement("div");


      album.className =
        "col-md-4";


      // ======================================
      // Create Link
      // ======================================

      const link =
        document.createElement("a");


      link.href =
        `gallery/album.html?id=${post.ID}`;


      link.className =
        "text-decoration-none text-dark";


      // ======================================
      // Card
      // ======================================

      const card =
        document.createElement("div");


      card.className =
        "card h-100";


      // ======================================
      // Featured Image → Card Cover
      // ======================================

      if (image) {

        const img =
          document.createElement("img");


        img.src =
          image;


        img.className =
          "card-img-top";


        img.alt =
          title;


        img.loading =
          "lazy";


        card.appendChild(img);

      }


      // ======================================
      // Card Body
      // ======================================

      const cardBody =
        document.createElement("div");


      cardBody.className =
        "card-body";


      // Title
      const cardTitle =
        document.createElement("h5");


      cardTitle.className =
        "card-title";


      cardTitle.textContent =
        title;


      cardBody.appendChild(
        cardTitle
      );


      // Description
      if (description) {

        const cardText =
          document.createElement("p");


        cardText.className =
          "card-text";


        cardText.textContent =
          description;


        cardBody.appendChild(
          cardText
        );

      }


      // ======================================
      // Build Card
      // ======================================

      card.appendChild(
        cardBody
      );


      link.appendChild(
        card
      );


      album.appendChild(
        link
      );


      galleryList.appendChild(
        album
      );

    });

  }


  catch (error) {

    console.error(
      "WAADA Gallery CMS Error:",
      error
    );


    galleryList.innerHTML = `
      <div class="col-12 text-center">
        <p>
          Gallery content could not be loaded.
        </p>
      </div>
    `;

  }

}


// ============================================
// Start Gallery CMS
// ============================================

document.addEventListener(
  "DOMContentLoaded",
  loadGalleryAlbums
);