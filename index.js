const puppeteer = require("puppeteer");
const codeobj = require("./codes");
const dotenv = require("dotenv");
dotenv.config();

const loginLink = "https://www.hackerrank.com/auth/login";
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

let browserOpen = puppeteer.launch({
  headless: false,
  args: ["--start-maximized"],
  defaultViewport: null,
});

let page;

browserOpen
  .then(function (browserObj) {
    let browserOpenPromise = browserObj.newPage();
    return browserOpenPromise;
  })
  .then(function (newTab) {
    page = newTab;
    let hackerRankOpenPromise = newTab.goto(loginLink);
    return hackerRankOpenPromise;
  })
  .then(function () {
    let emailIsEntered = page.type("input[name='username']", email, {
      delay: 50,
    });
    return emailIsEntered;
  })
  .then(function () {
    let passwordIsEntered = page.type("input[name='password']", password, {
      delay: 50,
    });
    return passwordIsEntered;
  })
  .then(function () {
    let clickedLoginButton = page.click("button[data-hr-focus-item='private']");
    return clickedLoginButton;
  })
  .then(function () {
    let clickedAlgorith = waitAndClick(
      ".topic-card a[data-attr1='algorithms']",
      page
    );
    return clickedAlgorith;
  })
  .then(function () {
    let gotoWarmup = waitAndClick("input[value='warmup']", page);
    return gotoWarmup;
  })
  .then(function () {
    return delay(3000);
  })
  .then(function () {
    return page.$$(
      ".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled"
    );
  })
  .then(function (questionsArr) {
    console.log("Array Length is:", questionsArr.length);
    let questionWillSolve = questionSolver(
      page,
      questionsArr[0],
      codeobj.answers[0]
    );
    return questionWillSolve;
  })
  .catch(function (err) {
    console.error("Error:", err);
  });

function waitAndClick(selector, currPage) {
  return new Promise(function (resolve, reject) {
    let waitForModelPromise = currPage.waitForSelector(selector);
    waitForModelPromise
      .then(function () {
        let clickModel = currPage.click(selector);
        return clickModel;
      })
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function questionSolver(page, question, answer) {
  return new Promise(function (resolve, reject) {
    let questionClicked = question.click();
    questionClicked
      .then(function () {
        let codeArea = waitAndClick(
          ".monaco-editor.no-user-select.showUnused.showDeprecated.vs",
          page
        );
        return codeArea;
      })
      .then(function () {
        return waitAndClick(".checkbox-input", page);
      })
      .then(function () {
        return page.waitForSelector("textarea.custominput", page);
      })
      .then(function () {
        return page.type("textarea.custominput", answer, { delay: 10 });
      })
      .then(function () {
        let ctrlIspressed = page.keyboard.down("Control");
        return ctrlIspressed;
      })
      .then(function () {
        let aisPressed = page.keyboard.press("A", { delay: 100 });
        return aisPressed;
      })
      .then(function () {
        let XisPressed = page.keyboard.press("X", { delay: 100 });
        return XisPressed;
      })
      .then(function () {
        let ctrlIsUnpressed = page.keyboard.up("Control");
        return ctrlIsUnpressed;
      })
      .then(function () {
        let MainCodeArea = waitAndClick(
          ".monaco-editor.no-user-select.showUnused.showDeprecated.vs",
          page
        );
        return MainCodeArea;
      })
      .then(function () {
        let ctrlIsPressed = page.keyboard.down("Control");
        return ctrlIsPressed;
      })
      .then(function () {
        let aisPressed = page.keyboard.press("A");
        return aisPressed;
      })
      .then(function () {
        let visPressed = page.keyboard.press("V");
        return visPressed;
      })
      .then(function () {
        let ctrlIsUnpressed = page.keyboard.up("Control");
        return ctrlIsUnpressed;
      })
      .then(function () {
        return page.click(".hr-monaco__run-code", { delay: 50 });
      })
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        reject();
      });
  });
}
