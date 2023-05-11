// ==UserScript==
// @name         miraiseed one-shot-login for GIGA
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  人間がやらんでいい作業は人間がやるな
// @author       GIG SCHOOL
// @match        https://miraiseed1.benesse.ne.jp/seed/*/displayLogin/*
// @match        https://miraiseed1.benesse.ne.jp/seed/vw020201/
// @match        https://miraiseed2.benesse.ne.jp/seed/*/displayLogin/*
// @match        https://miraiseed2.benesse.ne.jp/seed/vw020201/
// @match        https://miraiseed3.benesse.ne.jp/seed/*/displayLogin/*
// @match        https://miraiseed3.benesse.ne.jp/seed/vw020201/
// @match        https://miraiseed4.benesse.ne.jp/seed/*/displayLogin/*
// @match        https://miraiseed4.benesse.ne.jp/seed/vw020201/
// @match        https://miraiseed5.benesse.ne.jp/seed/*/displayLogin/*
// @match        https://miraiseed5.benesse.ne.jp/seed/vw020201/
// @match        https://miraiseed6.benesse.ne.jp/seed/*/displayLogin/*
// @match        https://miraiseed6.benesse.ne.jp/seed/vw020201/
// @match        https://miraiseed7.benesse.ne.jp/seed/*/displayLogin/*
// @match        https://miraiseed7.benesse.ne.jp/seed/vw020201/
// @match        https://miraiseed8.benesse.ne.jp/seed/*/displayLogin/*
// @match        https://miraiseed8.benesse.ne.jp/seed/vw020201/
// @match        https://miraiseed9.benesse.ne.jp/seed/*/displayLogin/*
// @match        https://miraiseed9.benesse.ne.jp/seed/vw020201/

// @icon

// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// ==/UserScript==
let mode = "" // login | service
window.onload = () => {
  (function () {
    "use strict";
    // Your code here...
    const URL = window.location.href;
    if (
      URL.match(
        /(https:\/\/|http:\/\/|)miraiseed\d+\.benesse\.ne\.jp\/seed\/.+\/displayLogin\/\d+/gi
      ) !== null ||
      URL.match(
        /(https:\/\/|http:\/\/|)miraiseed\d+\.benesse\.ne\.jp\/seed\/vw020201.+/gi
      ) !== null
    ) {
      mode = "login"
    }else{
      console.log("not login mode")
      return;
    }
    if(mode==="login"){
      console.log("ミライシード　ログイン画面");
      login_view();
    }


  })();
};


const login_view = () => {
    /**-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
     *
     *       　ログインデータ　ここから
     *        （書式に沿って適宜追加してみてください）
     *
     * -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
     */
    // 学校名, ID, パスワード
    const data = [
      ["テスト学校", "xxxx", "*******"],
      ["invalid test"],
      ["sample学校", "xxxx", "******"],
    ];
    /**-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
     *
     *       　ログインデータ　ここまで
     *
     * -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
     */ // プログラムのための整形（追加する人間のためじゃないよ）
    const schoolInfo = data.map((row) => {
      if (row.length !== 3) row = ["-- INVALID --", "", ""];
      const m = new Map();
      m.set("SchoolName", row[0]);
      m.set("UserNumber", row[1]);
      m.set("UserPass", row[2]);
      return m;
    });

    // dropdownmeu追加するためにbootstrap使う
    const head = document.querySelector("head");
    const styleLink = document.createElement("link");
    head.appendChild(styleLink);
    styleLink.setAttribute("rel", "stylesheet");
    styleLink.setAttribute("type", "text/css");
    styleLink.setAttribute(
      "href",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
    );
    styleLink.setAttribute(
      "integrity",
      "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
    );
    const jsSrc4BS = document.createElement("script");
    head.appendChild(jsSrc4BS);
    jsSrc4BS.setAttribute(
      "src",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    );
    jsSrc4BS.setAttribute(
      "integrity",
      "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
    );
    jsSrc4BS.setAttribute("crossorigin", "anonymous");

    //
    const oneShotLoginList = schoolInfo.map((school, idx) => {
      return `<div class="dropdown-item lead border-bottom pre-auto" name="onsehot" id="btn_${idx}">${school.get(
        "SchoolName"
      )}</div>`;
    });
    // ログイン情報をセット
    const login_button_go = `
    <div class="pt-5 px-5">
        <div class="dropdown">
        <button id="oneshot_btn" class="btn btn-lg btn-outline-secondary dropdwon-toggle py-2 px-4" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <span>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-activity" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M3 12h4l3 8l4 -16l3 8h4"></path>
            </svg>
            ONESHOT LOGIN
        </span>
        </button>
        <div class="dropdown-menu" aria-labelledby="oneshot_btn" style="height:500px; overflow: auto;">
            ${oneShotLoginList.join("")}
        </div>
        </div>
    </div>
  `;

    document
      .querySelector("header")
      .insertAdjacentHTML("afterend", login_button_go);

    const loginBtn = document.querySelector("input.btn");
    for (const [idx, school] of schoolInfo.entries()) {
      document.getElementById(`btn_${idx}`).addEventListener("click", (e) => {
        document.querySelector("input.number").value = school.get("UserNumber");
        document.querySelector("input.pass").value = school.get("UserPass");
        loginBtn.click();
      });
    }
}