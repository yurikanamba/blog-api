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
      const postContainer = document.getElementById("post-container");
      postContainer.innerHTML = "";
      posts.forEach((postdata) => {
        if (postdata.status === "publish") {
          const post = document.createElement("div");
          post.classList.add("post", `post-${postdata.id}`);
          postContainer.appendChild(post);

          const title = document.createElement("h2");
          title.classList.add("title");
          title.innerHTML = postdata.title;
          post.appendChild(title);

          const body = document.createElement("p");
          body.classList.add("body");
          body.innerHTML = postdata.body;
          post.appendChild(body);

          // const status = document.createElement("p");
          // status.classList.add("status");
          // status.innerHTML = `status: ${postdata.status}`;
          // post.appendChild(status);

          const timestamp = document.createElement("p");
          timestamp.classList.add("timestamp");
          timestamp.innerHTML = postdata.time;
          post.appendChild(timestamp);

          const editButton = document.createElement("button");
          editButton.classList.add("edit-btn");
          editButton.id = postdata.id;
          editButton.innerHTML = "✏️";
          post.appendChild(editButton);

          const deleteButton = document.createElement("button");
          deleteButton.classList.add("delete-btn");
          deleteButton.id = postdata.id;
          deleteButton.innerHTML = "🗑️";
          post.appendChild(deleteButton);
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

//FILTER BY STATUS
const showPublishBtn = document.querySelector(".published");
const showDraftsBtn = document.querySelector(".drafts");
function postsByStatus(e) {
  const status = e.target.innerHTML;

  const mutation = `
    {PostsByStatus(status: "${status}"){
      id
      title
      body
      status
      time
    }
    }
  `;

  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: mutation }),
  })
    .then((res) => res.json())
    .then((res) => {
      const posts = res.data.PostsByStatus;
      console.log(posts);
      const postContainer = document.getElementById("post-container");
      postContainer.innerHTML = "";
      posts.forEach((postdata) => {
        const post = document.createElement("div");
        post.classList.add("post", `post-${postdata.id}`);
        postContainer.appendChild(post);

        const title = document.createElement("h2");
        title.classList.add("title");
        title.innerHTML = postdata.title;
        post.appendChild(title);

        const body = document.createElement("p");
        body.classList.add("body");
        body.innerHTML = postdata.body;
        post.appendChild(body);

        // const status = document.createElement("p");
        // status.classList.add("status");
        // status.innerHTML = `status: ${postdata.status}`;
        // post.appendChild(status);

        const timestamp = document.createElement("p");
        timestamp.classList.add("timestamp");
        timestamp.innerHTML = postdata.time;
        post.appendChild(timestamp);

        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.id = postdata.id;
        editButton.innerHTML = "✏️";
        post.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.id = postdata.id;
        deleteButton.innerHTML = "🗑️";
        post.appendChild(deleteButton);
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
showPublishBtn.addEventListener("click", postsByStatus);
showDraftsBtn.addEventListener("click", postsByStatus);

//DELETE POST
function deletePost(e) {
  let isTrue = confirm("Are you sure you want to delete this post?");
  if (isTrue) {
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
}

//EDIT POST
function editPost(e) {
  const id = e.target.id;
  const titleAndBody = document.querySelector(`.post-${id}`).childNodes;
  const titlePlaceHolder = titleAndBody[0].innerText;
  const bodyPlaceHolder = titleAndBody[1].innerText;
  console.log(titlePlaceHolder, bodyPlaceHolder);

  document.getElementById("edit-post-title").placeHolder = titlePlaceHolder;
  document.getElementById("edit-post-body").placeHolder = bodyPlaceHolder;

  //display form
  const editPostForm = document.getElementById("popup");
  editPostForm.style.display = "flex";

  //add save button
  const post = document.querySelector(`.post-${id}`);
  const saveBtn = document.getElementById("edit-post-btn");

  saveBtn.addEventListener("click", () => {
    //get input values
    const titleVal = document.getElementById("edit-post-title").value;
    const bodyVal = document.getElementById("edit-post-body").value;
    const statusDropdown = document.getElementById("edit-post-status");
    const statusVal = statusDropdown.options[statusDropdown.selectedIndex].text;
    editPostForm.style.display = "none";

    // if (!titleVal && titlePlaceHolder) {
    //   titleVal = titlePlaceHolder;
    // }

    // if (!bodyVal && bodyPlaceHolder) {
    //   bodyVal = bodyPlaceHolder;
    // }

    const mutation = `
  mutation{
    EditPost(id: "${id}", title: "${titleVal}", body: "${bodyVal}", status: "${statusVal}") {
      id
      title
      body
      status
      time
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
  });
}

//ADD POST
const addPostBtn = document.getElementById("add-post-btn");

function addPost() {
  //get input values
  const titleVal = document.getElementById("post-title").value;
  const bodyVal = document.getElementById("post-body").value;
  const statusDropdown = document.getElementById("post-status");
  const statusVal = statusDropdown.options[statusDropdown.selectedIndex].text;

  const mutation = `
  mutation{
    AddPost(title: "${titleVal}", body: "${bodyVal}", status: "${statusVal}") {
      id
      title
      body
      status
      time
    }
  }
  `;

  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ query: mutation }),
  })
    .then((res) => res.json())
    .then((res) => console.log(res))
    .then(() => loadData())
    .catch((err) => console.log(err));
}

addPostBtn.addEventListener("click", addPost);

//4 ways to call a graphQL API: https://www.apollographql.com/blog/4-simple-ways-to-call-a-graphql-api-a6807bcdb355
//const fetch = require("graphql-fetch")("http://localhost:4000/graphql");
