
const footer = {
  init: function () {
    this._element = document.querySelector("#footer");

  },
  render: function () {
    this._element.innerHTML = `Copyright (c) 2017 <a href="/"><strong>Restaurant Reviews</strong></a> All Rights Reserved.`;
  }
}

const header = {
  init: function () {
    this._element = document.querySelector("#header");
    let nav = `
      <nav>
        <h1>
          <a href="/">Restaurant Reviews</a>
        </h1>
      </nav>
    `
  }
}
