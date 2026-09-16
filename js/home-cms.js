/*
 * =========================================================
 * WAADA HOMEPAGE CMS
 * =========================================================
 *
 * WordPress CMS:
 * https://waadacms.wordpress.com
 *
 * HOMEPAGE CMS STRUCTURE
 *
 * 1. Hero
 *    Category slug: home-hero
 *
 * 2. About
 *    Category slug: home-about
 *
 * 3. Latest Event
 *    Category slug: home-latest-event
 *
 * 4. Recent Initiatives
 *    Category slug: home-recent-initiatives
 *
 * =========================================================
 */


const WAADA_API_BASE =
  "https://public-api.wordpress.com/rest/v1.2/sites/waadacms.wordpress.com/posts/";


/* =========================================================
   BASIC HELPERS
========================================================= */


/*
 * Get WordPress posts by category.
 */
async function cmsPosts(category, number = 1) {

  const url =
    `${WAADA_API_BASE}?category=${encodeURIComponent(category)}` +
    `&number=${number}`;

  const response = await fetch(url);

  if (!response.ok) {

    throw new Error(
      `WordPress API request failed: ${response.status}`
    );

  }

  const data = await response.json();

  return (data.posts || []).sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date)
  );

}


/*
 * Convert WordPress HTML into
 * a temporary DOM element.
 */
function cmsContentElement(html = "") {

  const wrapper =
    document.createElement("div");

  wrapper.innerHTML = html;

  return wrapper;

}


/*
 * Convert HTML into plain text.
 */
function cleanText(value = "") {

  const temp =
    document.createElement("div");

  temp.innerHTML = value;

  return temp.textContent.trim();

}



/* =========================================================
   1. HERO
   =========================================================

   WordPress Post:
   Home – Hero

   Category:
   home-hero

   Client edits:
   Hero headline

   IMPORTANT:
   WordPress Post Title is NOT displayed.

   Existing homepage video remains unchanged.
========================================================= */


async function loadHomeHero() {

  try {

    const posts =
      await cmsPosts("home-hero", 1);

    if (!posts.length) {
      console.warn("No Home Hero post found.");
      return;
    }


    const post = posts[0];


    const heroTitle =
      document.getElementById(
        "home-hero-title"
      );


    if (!heroTitle) {
      return;
    }


    const content =
      cmsContentElement(
        post.content || ""
      );


    /*
     * First heading or paragraph
     * becomes Hero headline.
     */
    const firstContent =
      content.querySelector(
        "h1, h2, h3, h4, h5, h6, p"
      );


    if (firstContent) {

      heroTitle.innerHTML =
        firstContent.innerHTML;

    }


  } catch (error) {

    console.error(
      "Home Hero CMS error:",
      error
    );

  }

}



/* =========================================================
   2. ABOUT
   =========================================================

   WordPress Post:
   Home – About

   Category:
   home-about

   Client edits:
   About body content

   "About WAADA" heading stays in HTML.
========================================================= */


async function loadHomeAbout() {

  try {

    const posts =
      await cmsPosts("home-about", 1);


    if (!posts.length) {

      console.warn(
        "No Home About post found."
      );

      return;

    }


    const post =
      posts[0];


    const aboutContent =
      document.getElementById(
        "home-about-content"
      );


    if (!aboutContent) {
      return;
    }


    const content =
      cmsContentElement(
        post.content || ""
      );


    /*
     * Remove empty paragraphs.
     */
    content
      .querySelectorAll("p")
      .forEach((paragraph) => {

        if (
          !paragraph.textContent.trim()
        ) {

          paragraph.remove();

        }

      });


    /*
     * Apply homepage styling.
     */
    const paragraphs =
      content.querySelectorAll("p");


    paragraphs.forEach(
      (paragraph, index) => {

        paragraph.classList.add(
          "fs-5",
          "lh-lg",
          "text-start"
        );


        if (
          index ===
          paragraphs.length - 1
        ) {

          paragraph.classList.add(
            "mb-5"
          );

        } else {

          paragraph.classList.add(
            "mb-4"
          );

        }

      }
    );


    aboutContent.innerHTML =
      content.innerHTML;


  } catch (error) {

    console.error(
      "Home About CMS error:",
      error
    );

  }

}



/* =========================================================
   3. LATEST EVENT
   =========================================================

   WordPress Post:
   Home – Latest Event

   Category:
   home-latest-event


   CLIENT CONTROLS:

   Featured Image
   ↓
   Large homepage event poster


   WordPress content:

   H2
   Event Title

   H2 / H3
   Event Subtitle

   Paragraph
   Date · Location

   Paragraphs
   Event description

   Link
   View Event Gallery


   IMPORTANT:
   WordPress Post Title
   "Home – Latest Event"
   is NOT displayed.
========================================================= */


async function loadHomeSpotlight() {

  try {

    const posts =
      await cmsPosts(
        "home-latest-event",
        1
      );


    if (!posts.length) {

      console.warn(
        "No Home Latest Event post found."
      );

      return;

    }


    const post =
      posts[0];


    /* -------------------------------------------------
       Homepage Elements
    ------------------------------------------------- */


    const image =
      document.getElementById(
        "home-spotlight-image"
      );


    const imageLink =
      document.getElementById(
        "home-spotlight-image-link"
      );


    const title =
      document.getElementById(
        "home-spotlight-title"
      );


    const subtitle =
      document.getElementById(
        "home-spotlight-subtitle"
      );


    const body =
      document.getElementById(
        "home-spotlight-content"
      );


    const date =
      document.getElementById(
        "home-spotlight-date"
      );


    const galleryButton =
      document.getElementById(
        "home-spotlight-link"
      );



    /* -------------------------------------------------
       Featured Image
    ------------------------------------------------- */


    if (
      image &&
      post.featured_image
    ) {

      image.src =
        post.featured_image;


      image.alt =
        cleanText(
          post.title ||
          "Latest Event"
        );

    }



    /* -------------------------------------------------
       Parse WordPress Content
    ------------------------------------------------- */


    const content =
      cmsContentElement(
        post.content || ""
      );


    /*
     * Remove empty blocks.
     */
    content
      .querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6"
      )
      .forEach((element) => {

        if (
          !element.textContent.trim() &&
          !element.querySelector("img")
        ) {

          element.remove();

        }

      });



    /* -------------------------------------------------
       Find Event Gallery Link
    ------------------------------------------------- */


    let galleryURL = "";


    const links =
      Array.from(
        content.querySelectorAll(
          "a[href]"
        )
      );


    if (links.length) {

      /*
       * Last link in WordPress content
       * is treated as Event Gallery link.
       */
      const lastLink =
        links[links.length - 1];


      galleryURL =
        lastLink.href;


      /*
       * Remove link from body content.
       */
      const parent =
        lastLink.closest("p");


      if (parent) {

        parent.remove();

      } else {

        lastLink.remove();

      }

    }



    /* -------------------------------------------------
       Event Title
    ------------------------------------------------- */


    let headings =
      Array.from(
        content.querySelectorAll(
          "h1, h2, h3, h4, h5, h6"
        )
      );


    if (
      headings.length &&
      title
    ) {

      title.innerHTML =
        headings[0].innerHTML;


      headings[0].remove();

    }



    /* -------------------------------------------------
       Event Subtitle
    ------------------------------------------------- */


    headings =
      Array.from(
        content.querySelectorAll(
          "h1, h2, h3, h4, h5, h6"
        )
      );


    if (
      headings.length &&
      subtitle
    ) {

      const subtitleText =
        headings[0]
          .textContent
          .trim();


      const looksLikeDate =
        /\b(19|20)\d{2}\b/.test(
          subtitleText
        ) ||
        subtitleText.includes("·");


      if (!looksLikeDate) {

        subtitle.innerHTML =
          headings[0].innerHTML;


        headings[0].remove();

      }

    }



    /* -------------------------------------------------
       Date / Location
    ------------------------------------------------- */


    const possibleDateElements =
      Array.from(
        content.querySelectorAll(
          "p, h1, h2, h3, h4, h5, h6"
        )
      );


    const dateElement =
      possibleDateElements.find(
        (element) => {

          const text =
            element.textContent.trim();


          return (

            /\b(19|20)\d{2}\b/.test(
              text
            ) &&

            (
              text.includes("·") ||
              text.includes(",")
            )

          );

        }
      );


    if (
      dateElement &&
      date
    ) {

      date.textContent =
        dateElement
          .textContent
          .trim();


      dateElement.remove();

    }



    /* -------------------------------------------------
       Event Body
    ------------------------------------------------- */


    if (body) {

      const paragraphs =
        content.querySelectorAll("p");


      paragraphs.forEach(
        (paragraph, index) => {

          paragraph.classList.add(
            "fs-5",
            "lh-lg",
            "text-start"
          );


          if (
            index ===
            paragraphs.length - 1
          ) {

            paragraph.classList.add(
              "mb-4"
            );

          } else {

            paragraph.classList.add(
              "mb-3"
            );

          }

        }
      );


      body.innerHTML =
        content.innerHTML;

    }



    /* -------------------------------------------------
       Event Gallery Button + Poster Link
    ------------------------------------------------- */


    if (galleryURL) {


      if (galleryButton) {

        galleryButton.href =
          galleryURL;


        galleryButton.style.display =
          "";

      }


      if (imageLink) {

        imageLink.href =
          galleryURL;

      }


    } else {


      /*
       * If client does not enter
       * an Event Gallery link,
       * hide button.
       */


      if (galleryButton) {

        galleryButton.style.display =
          "none";

      }


      if (imageLink) {

        imageLink.removeAttribute(
          "href"
        );

      }

    }


  } catch (error) {

    console.error(
      "Home Latest Event CMS error:",
      error
    );

  }

}



/* =========================================================
   4. RECENT INITIATIVES
   =========================================================

   WordPress Post:
   Home – Recent Initiatives

   Category:
   home-recent-initiatives


   CLIENT STRUCTURE:


   GROUP 1
   ├── Image
   └── Group
       ├── H2
       ├── Paragraph
       └── Paragraph
           └── Album Link


   GROUP 2
   ├── Image
   └── Group
       ├── H2
       ├── Paragraph
       └── Paragraph
           └── Album Link


   GROUP 3
   ├── Image
   └── Group
       ├── H2
       ├── Paragraph
       └── Paragraph
           └── Album Link


   Homepage result:

   Image
   Title
   Description

   Entire card = clickable

   "Album Link" text is NOT displayed.

========================================================= */


async function loadRecentInitiatives() {

  try {


    /* -------------------------------------------------
       Get Home Recent Initiatives Post
    ------------------------------------------------- */


    const posts =
      await cmsPosts(
        "home-recent-initiatives",
        1
      );


    if (!posts.length) {

      console.warn(
        "No Home Recent Initiatives post found."
      );

      return;

    }


    const post =
      posts[0];



    /* -------------------------------------------------
       Homepage Container
    ------------------------------------------------- */


    const container =
      document.getElementById(
        "home-recent-initiatives"
      );


    if (!container) {

      console.warn(
        "Recent Initiatives container not found."
      );

      return;

    }



    /* -------------------------------------------------
       Parse WordPress Content
    ------------------------------------------------- */


    const content =
      cmsContentElement(
        post.content || ""
      );



    /* -------------------------------------------------
       Find TOP-LEVEL Gutenberg Groups

       Each top-level Group = one card.

       Nested Group inside each card is ignored
       as a separate card.
    ------------------------------------------------- */


    let groups =
      Array.from(
        content.querySelectorAll(
          ".wp-block-group"
        )
      )
      .filter((group) => {

        return !group
          .parentElement
          .closest(
            ".wp-block-group"
          );

      });



    /*
     * Homepage supports maximum
     * 3 Recent Initiative cards.
     */


    groups =
      groups.slice(0, 3);



    if (!groups.length) {

      console.warn(
        "No Recent Initiative Groups found."
      );

      return;

    }



    /* -------------------------------------------------
       Remove Static Fallback Cards

       Only remove them AFTER CMS data
       successfully loads.
    ------------------------------------------------- */


    container.innerHTML = "";



    /* -------------------------------------------------
       Build Cards
    ------------------------------------------------- */


    groups.forEach(
      (group) => {


        /* =============================================
           CMS IMAGE
        ============================================= */


        const sourceImage =
          group.querySelector(
            "img"
          );



        /* =============================================
           CMS TITLE
        ============================================= */


        const sourceTitle =
          group.querySelector(
            "h1, h2, h3, h4, h5, h6"
          );



        /* =============================================
           CMS DESCRIPTION
        ============================================= */


        const paragraphs =
          Array.from(
            group.querySelectorAll(
              "p"
            )
          );


        /*
         * Description =
         * first paragraph WITHOUT a link.
         */


        const description =
          paragraphs.find(
            (paragraph) => {

              return !paragraph
                .querySelector(
                  "a[href]"
                );

            }
          );



        /* =============================================
           CMS ALBUM LINK
        ============================================= */


        /*
         * Find first real link
         * anywhere inside this card Group.
         */


        const sourceLink =
          group.querySelector(
            "a[href]"
          );



        /* =============================================
           VALIDATE CARD
        ============================================= */


        /*
         * Image and Title are required.
         */


        if (
          !sourceImage ||
          !sourceTitle
        ) {

          console.warn(
            "Skipping incomplete Recent Initiative card."
          );

          return;

        }



        const albumURL =
          sourceLink
            ? sourceLink.href
            : "";



        /* =============================================
           BOOTSTRAP COLUMN
        ============================================= */


        const column =
          document.createElement(
            "div"
          );


        column.className =
          "col-md-4 mb-4";



        /* =============================================
           ENTIRE CARD LINK
        ============================================= */


        const cardLink =
          document.createElement(
            "a"
          );


        cardLink.className =
          "event-card d-block text-white text-decoration-none h-100";


        if (albumURL) {

          cardLink.href =
            albumURL;

        }



        /* =============================================
           SQUARE IMAGE WRAPPER
        ============================================= */


        const imageWrapper =
          document.createElement(
            "div"
          );


        imageWrapper.className =
          "home-initiative-image overflow-hidden rounded shadow-sm";


        /*
         * Force square directly in JS.
         *
         * This works even if original
         * WordPress image is vertical.
         */


        imageWrapper.style.position =
          "relative";


        imageWrapper.style.width =
          "100%";


        imageWrapper.style.paddingTop =
          "100%";


        imageWrapper.style.overflow =
          "hidden";



        /* =============================================
           IMAGE
        ============================================= */


        const image =
          document.createElement(
            "img"
          );


        image.src =
          sourceImage.currentSrc ||
          sourceImage.src;


        image.alt =
          sourceImage.alt ||
          cleanText(
            sourceTitle.innerHTML
          );


        image.className =
          "event-img home-initiative-img";


        image.loading =
          "lazy";


        image.decoding =
          "async";


        /*
         * Fill square wrapper.
         */


        image.style.position =
          "absolute";


        image.style.top =
          "0";


        image.style.left =
          "0";


        image.style.width =
          "100%";


        image.style.height =
          "100%";


        image.style.objectFit =
          "cover";


        image.style.objectPosition =
          "center";


        image.style.display =
          "block";


        imageWrapper.appendChild(
          image
        );



        /* =============================================
           TITLE
        ============================================= */


        const title =
          document.createElement(
            "h5"
          );


        title.className =
          "mt-3 fw-semibold";


        title.innerHTML =
          sourceTitle.innerHTML;



        /* =============================================
           DESCRIPTION
        ============================================= */


        const descriptionElement =
          document.createElement(
            "p"
          );


        descriptionElement.className =
          "mb-0";


        if (description) {

          descriptionElement.innerHTML =
            description.innerHTML;

        }



        /* =============================================
           BUILD CARD
        ============================================= */


        cardLink.appendChild(
          imageWrapper
        );


        cardLink.appendChild(
          title
        );


        if (description) {

          cardLink.appendChild(
            descriptionElement
          );

        }



        /*
         * IMPORTANT:
         *
         * We DO NOT copy the WordPress
         * "Album Link" paragraph.
         *
         * We only use its URL for
         * the entire card.
         */


        column.appendChild(
          cardLink
        );


        container.appendChild(
          column
        );


      }
    );


  } catch (error) {

    console.error(
      "Home Recent Initiatives CMS error:",
      error
    );

  }

}



/* =========================================================
   INITIALIZE HOMEPAGE CMS
========================================================= */


document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadHomeHero();

    loadHomeAbout();

    loadHomeSpotlight();

    loadRecentInitiatives();

  }
);