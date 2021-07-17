async function editPostHandler(event) {
    event.preventDefault();
    const title = document.querySelector("#post-title").innerHTML;
    const body = document.querySelector("#post-body").innerHTML;
    const post_id = window.location.toString().split("/")[
      window.location.toString().split("/").length - 1
    ];
    console.log(title, body);
    document.location.replace("/edit/" + post_id);
  }
  