window.onload = loadData;

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
      console.log(posts);
      const postContainer = document.getElementById("post-container");
      postContainer.innerHTML = "";
      posts.forEach((postdata) => {
        if (postdata.status === "publish") {
          const post = document.createElement("div");
          post.classList.add("post");
          post.id = postdata.id;
          postContainer.appendChild(post);

          const title = document.createElement("h2");
          title.innerHTML = postdata.title;
          post.appendChild(title);

          const body = document.createElement("p");
          post.classList.add("body");
          body.innerHTML = postdata.body;
          post.appendChild(body);

          const timestamp = document.createElement("p");
          post.classList.add("timestamp");
          timestamp.innerHTML = postdata.time;
          post.appendChild(timestamp);

          const deleteButton = document.createElement("button");
          deleteButton.classList.add("delete-btn");
          deleteButton.id = postdata.id;
          deleteButton.innerHTML = "x";
          post.appendChild(deleteButton);
        }
      });
    })
    .then(() => {
      const deleteBtn = document.querySelectorAll(".delete-btn");
      for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener("click", deletePost);
      }
    })
    .catch((err) => console.log(err));
}

function deletePost(e) {
  const id = e.target.id;
  const mutation = `
    mutation {
      DeletePost(id: "${id}") {
        ok
      }
    }
  `;

  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: mutation }),
  })
    .then((res) => res.json())
    .then(() => loadData())
    .catch((err) => console.log(err));
}

const addPost = () => {
  console.log("clicked");
  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      query: "{ Posts { id title body status time} }",
      // mutation:
      //   "{AddPost(input: {input PostInput {id title body status time} })}",
    }),
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
};

//4 ways to call a graphQL API: https://www.apollographql.com/blog/4-simple-ways-to-call-a-graphql-api-a6807bcdb355
//const fetch = require("graphql-fetch")("http://localhost:4000/graphql");
