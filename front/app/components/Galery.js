import { PLAIN_API_BASE_ROUTE } from "../../env.js";
import userStore from "../scripts/userStore.js";
import { GALERY_ITEM_LIMIT_PER_PAGE } from "../scripts/utils.js";
import { GaleryOwner } from "../scripts/utils.js";

export const Galery = (owner, imageList) => {
  const { myGaleryStart, otherGaleryStart, user } = userStore.getState();

  let template = `<div class="card-deck">`;

  const start = owner === GaleryOwner.ME ? myGaleryStart : otherGaleryStart;
  const limitItem = start + GALERY_ITEM_LIMIT_PER_PAGE;
  const limit = limitItem < imageList.length ? limitItem : imageList.length;

  for (let i = start; i < limit; i++) {
    const image = imageList[i];
    const likeCount = image.likeList.length ? image.likeList.length : "";
    const commentCount = image.commentList.length
      ? image.commentList.length
      : "";
    let commentListTemplate = "";

    for (const comment of image.commentList) {
      const line = `<span class="comment-author">${comment.authorName} </span> <span>${comment.content}</span><br/>`;
      commentListTemplate += line;
    }

    const deleteOrshareImageItemBtn = `
      <div class="delete-and-share-btns-wrapper">
      <button type="button" class="view-item-action delete-image-btn" id="delete-image-btn-${owner}-${image.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash3" viewBox="0 0 16 16">
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
        </svg>
      </button> 
      <button type="button" class="view-item-action" id="share-image-btn-${owner}-${image.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-share-fill" viewBox="0 0 16 16">
          <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/>
        </svg>
      </button>
      </div>
    `;

    const imageItem = `
    <div class="card image-item" data-imagekey="${owner}-${
      image.id
    }" data-imageid="${image.id}">
      ${image.author.id === user.id ? deleteOrshareImageItemBtn : ""}
      <img class="card-img-top" src="${PLAIN_API_BASE_ROUTE}/users/images/${
      image.name
    }" alt="Card image cap" id="img-${owner}-${image.id}">
      <div class="image-author">Author: <span>${image.author.name}</span></div>
      <div class="card-body image-score-block">
        <div class="likes-block">
          <button type="button" class="view-item-action" id="likes-btn-${owner}-${
      image.id
    }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
              <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
            </svg>
          </button>
          <div class="like-count">${likeCount}</div>
        </div>
        <div class="comments-block">
          <button type="button" class="view-item-action" id="comments-btn-${owner}-${
      image.id
    }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chat-right-text-fill" viewBox="0 0 16 16">
              <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1"/>
            </svg>
          </button>
          <div class="comment-count">${commentCount}</div>
        </div>
        <div class="view-full-block">
          <button type="button" class="view-item-action" id="view-full-btn-${owner}-${
      image.id
    }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="card-footer">
        <textarea id="input-comment-${owner}-${
      image.id
    }" class="input-comment hidden" placeholder="Type your comment here" maxlength="255">
        </textarea>
      </div>
    </div>
    
    <div id="${owner}-${image.id}" class="view-image-item hidden">
      <button type="button" class="view-item-action" id="close-view-${owner}-${
      image.id
    }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#01081c" class="bi bi-x-circle"
          viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
        </svg>
      </button>
      <div><img class="card-img-top" src="${PLAIN_API_BASE_ROUTE}/users/images/${
      image.name
    }" alt="Card image cap"></div>
      <div class="comment-section">${commentListTemplate}</div>
    </div>
    `;
    template += imageItem;
  }

  template += `</div>`;

  template += `
    <div class="pagination-bloc">
      <button class="pagination-btn" id="prev-${owner}" data-owner="${owner}" hidden>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
      </svg>
      </button>
      <button class="pagination-btn" id="next-${owner}" data-owner="${owner}" hidden>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-arrow-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
        </svg>
      </button>
    </div>
  `;

  template += `
  <style>
    .image-item {
      width: calc(33.333% - 10px);
      min-widht: 200px;
      margin-bottom: 20px;
      cursor: pointer;
    }
    .view-item-action {
      margin-left: auto; 
      margin-right: 0;
      display: block; 
      background-color: grey;
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }

    .input-comment {
      width: 100%;
    }

    .image-score-block {
      display: flex;
      flex-orientation: rows;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .image-author {
      color: var(--bg-primary);
      margin-top: 15px;
      margin: auto;
      span {
        font-weight: bolder;
      }
    }

    .like-count, .comment-count {
      color: var(--bg-primary);
      font-weight: bolder;
      width: 50px;
      height: 30px;
      text-align: center;
    }

    .comment-author {
      font-weight: bolder;
      color: var(--bg-primary);
    }

    .comment-section {
      padding: 10px;
    }

    .pagination-btn{
      border: none;
      background-color: var(--bg-secondary);
       &:hover {
        background-color: var(--secondary);
      }
    }

    .delete-and-share-btns-wrapper {
      display: flex;
      justify-content: right;
      gap: 0;

      button {
        margin: 0 !important;
        background-color: white !important;
        width: 35px !important;
        height: 35px !important;

        &:hover {
          border-bottom: 3px solid var(--bg-primary) !important;
          border-radius: 0px;
        }
      }
    }  

  </style>
  `;

  return template;
};
