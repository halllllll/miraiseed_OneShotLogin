// ==UserScript==
// @name         miraiseed one-shot-login for GIGA
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  人間がやらんでいい作業は人間がやるな
// @author       GIG SCHOOL
// @include      /(https:\/\/|http:\/\/|)miraiseed\d+\.benesse\.ne\.jp\/seed\/.+/
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
    }else if(
        URL.match(
            /(https:\/\/|http:\/\/|)miraiseed\d+\.benesse\.ne\.jp\/seed\/vw03\d+/gi
        )
    ){
        mode = "service"
    }else if(
        URL.match(
            /(https:\/\/|http:\/\/|)miraiseed\d+\.benesse\.ne\.jp\/seed\/errorPage\//gi
        )
    ){
        console.log("error page url parse")
        const baseurl = /(https:\/\/|http:\/\/|)miraiseed\d+\.benesse\.ne\.jp\/seed/gi
        const a = `${URL.match(baseurl)[0]}/vw020101/displayLogin/1`
        location.href = a;
        return;
    }else{
        console.log("not miraiseed");
        return;
    }
    if(mode==="login"){
      console.log("ミライシード　ログイン画面");
      login_view();
    }else if(mode === "service"){
      console.log("ミライシード　管理者画面");
      service_view();
    }else{
      console.log("nothing to do");
      return;
    }
  })();
};

// keywordでフィルタリング
const filterSchoolList = (data, keyword) => {
    if(keyword === ""){
        return data.map(row =>{
            const m = new Map();
            m.set("SchoolName", row[0]);
            m.set("UserNumber", row[1]);
            m.set("UserPass", row[2]);
            return m;
        });
    }
    // プログラムのための整形（追加する人間のためじゃないよ）
    keyword = keyword.replaceAll(" ", "").replaceAll("　", "");
    const re = new RegExp(keyword);
    return data.filter((row) => row.length === 3 && re.test(row[0])).map(row =>{
        const m = new Map();
        m.set("SchoolName", row[0]);
        m.set("UserNumber", row[1]);
        m.set("UserPass", row[2]);
        return m;
    });
}


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
     */

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

    // ログイン情報をセット
    const login_button_go = `
    <div class="pt-5 px-5">
        <div class="dropdown">
        <button id="oneshot_btn" class="btn btn-lg dropdwon-toggle py-2 px-4" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <span>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-activity" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M3 12h4l3 8l4 -16l3 8h4"></path>
            </svg>
            ONESHOT LOGIN
        </span>
        </button>
        <div class="dropdown-menu" aria-labelledby="oneshot_btn" style="max-height: 500px; overflow: auto; position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, 42px);padding-top: 0rem;">
          <div class="sticky-top"  style="margin-top: 1em; margin-bottom: 1em; display: flex; justify-content: center; width: fit-content; background-color: #fff; ">
            <p style="margin: .5em;">学校名：<input type="text" id="keyword" style="padding-right: 1em; width: 100%;" placeholder="半角/全角spaceで全件表示"><p>
          </div>
          <div>
            <div id="listInSubMenu"></div>
          </div>
        </div>
        </div>
    </div>
  `;

    document
      .querySelector("header")
      .insertAdjacentHTML("afterend", login_button_go);
    const loginBtn = document.querySelector("input.btn");
    
    let preserved_elements = [];

    document
        .getElementById("keyword")
        .addEventListener("change", e => {
            const listInSubmenu = document.getElementById("listInSubMenu");
            while (listInSubmenu.firstChild) {
                listInSubmenu.removeChild(listInSubmenu.lastChild);
            };
            //　イベントハンドラわからんから上書きしちゃう
            preserved_elements.forEach((ele, idx) => {
                console.log(`idx: ${idx}`)
                ele.removeEventListener("click", ()=>{})
                ele.removeEventListener("focus", ()=>{})
            });
            preserved_elements = [];

            const oneShotLoginList = filterSchoolList(data, e.target.value)
            const schoolInfo = oneShotLoginList.map((school, idx) => {
                return `<div class="dropdown-item lead border-bottom pre-auto btn-light" type="button" name="onsehot" tabindex="0" id="btn_${idx}">${school.get(
                  "SchoolName"
                )}</div>`;
            });
        
            listInSubmenu.insertAdjacentHTML("afterbegin", schoolInfo.join(""))
        
            for (const [idx, school] of oneShotLoginList.entries()) {
                document.getElementById(`btn_${idx}`)
                    .addEventListener("click", (e) => {
                        document.querySelector("input.number").value = school.get("UserNumber");
                        document.querySelector("input.pass").value = school.get("UserPass");
                        loginBtn.click();
                    });

                document.getElementById(`btn_${idx}`)
                    .addEventListener("focus", (e) => {
                        window.document.onkeydown = ee => {
                            if (ee.key === 'Enter') {
                                document.querySelector("input.number").value = school.get("UserNumber");
                                document.querySelector("input.pass").value = school.get("UserPass");
                                console.log("学校名: ", school.get("SchoolName"));
                                loginBtn.click();        
                            }
                        }
                    });
                preserved_elements = [...preserved_elements, document.getElementById(`btn_${idx}`)];
            }
        });
}


const service_view = () =>{
    // タイマー表示したい
    const t = `
        <div class="pt-5 px-5">
            <p>（タイムアウト避け）リロードまで <span id="intervalTimer"></span> 秒</p>
        </div>
    `;

    // 10分で切れるので9分30秒でとりあえずホームへ飛ばす
    let countdown = 60 * 9 + 30;

    document
        .querySelector(".header")
        .insertAdjacentHTML("afterend", t);
        
    (()=>{
        setInterval(()=>{
            if(countdown <= 0)location.href = location.href
            var mm = Math.floor(countdown / 60).toString().padStart(2,"0");
            var ss = (countdown % 60).toString().padStart(2, "0");
            var timer_area = document.getElementById('intervalTimer');
            timer_area.style.fontSize = "24pt";
            timer_area.style.color = "red";
            timer_area.innerHTML = `${mm}:${ss}`;
            countdown--;
        }, 1000)
    })();
}