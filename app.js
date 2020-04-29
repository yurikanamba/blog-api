window.onload = loadData;

//LOAD POSTS
function loadData() {
  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      query: "{ Posts { id title body status time} }",
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.Posts)
    .then((posts) => {
      const postContainer = document.querySelector(".terminal-timeline");
      postContainer.innerHTML = "";
      posts.forEach((postdata) => {
        if (postdata.status === "publish") {
          const post = document.createElement("div");
          post.classList.add("terminal-card");
          postContainer.appendChild(post);

          const title = document.createElement("header");
          title.innerHTML = postdata.title;
          post.appendChild(title);

          const body = document.createElement("div");
          body.innerHTML = postdata.body;
          post.appendChild(body);

          const timestamp = document.createElement("div");
          let date = postdata.time.substr(0, 10);
          timestamp.innerHTML = date;
          post.appendChild(timestamp);
        }
      });
    })
    .then(() => {
      const deleteBtn = document.querySelectorAll(".delete-btn");
      const editBtn = document.querySelectorAll(".edit-btn");
      for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener("click", deletePost);
        editBtn[i].addEventListener("click", editPost);
      }
    })
    .catch((err) => console.log(err));
}
