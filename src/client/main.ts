import ts from "typescript";
import { script } from "../config";
let callbacks: unknown;
callbacks = 0;
callbacks = {};
const RegisterNetEvent = (data: string) => {
  ts.transpile(`RegisterNetEvent(${data})`);
};
RegisterNetEvent(`gm_${script}:callback`);
onNet(`gm_${script}:callback`, (result: unknown, id: number) => {
  callbacks[id](result);
  delete callbacks[id];
});
const serverCallback = (name: string, data: unknown, cb: unknown): void => {
  let id: number;
  id = 0;
  id = Object.keys(callbacks).length++;
  callbacks[id] = cb;
  data["CallbackID"] = id;
  emitNet(name, data);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////

import { conf } from "./utils";

let isPauseMenu = false;
let currentState = 0;
let states = [];
let state = "none";
let hunger = 0.0;
let thirst = 0.0;

const toggleHUD = (bool: boolean) => {
  if (state === "none") {
    state = states[conf["defaultState"]];
  }
  SendNuiMessage(
    JSON.stringify({
      type: "ui",
      state: state,
      show: bool,
    }),
  );
  SendNuiMessage(
    JSON.stringify({
      type: "conf",
      colorFood: conf["appearance"].colors.hunger,
      colorWater: conf["appearance"].colors.thirst,
      colorMoney: conf["appearance"].colors.money,
      colorJob: conf["appearance"].colors.job,
      colorTime: conf["appearance"].colors.time,
      colorBg: conf["appearance"].colors.background,
      foodActive: conf["show"].hunger,
      waterActive: conf["show"].thirst,
      moneyActive: conf["show"].money,
      jobActive: conf["show"].job,
      timeActive: conf["show"].time,
      timeFormat: conf["appearance"].timeFormat,
      scale: conf["appearance"].scale,
      opacity: conf["appearance"].opacity,
      gapScale: conf["appearance"].gapScale,
      barScale: conf["appearance"].barScale,
      position: conf["appearance"].position,
    }),
  );
};

const configLoaded = (): void => {
  if (conf["hideHUDAllow"]) {
    states = ["minimized", "expanded", "hidden"];
  } else {
    states = ["minimized", "expanded"];
  }
  SendNuiMessage(
    JSON.stringify({
      type: "conf",
      colorFood: conf["appearance"].colors.hunger,
      colorWater: conf["appearance"].colors.thirst,
      colorMoney: conf["appearance"].colors.money,
      colorJob: conf["appearance"].colors.job,
      colorTime: conf["appearance"].colors.time,
      colorBg: conf["appearance"].colors.background,
      foodActive: conf["show"].hunger,
      waterActive: conf["show"].thirst,
      moneyActive: conf["show"].money,
      jobActive: conf["show"].job,
      timeActive: conf["show"].time,
      timeFormat: conf["appearance"].timeFormat,
      scale: conf["appearance"].scale,
      opacity: conf["appearance"].opacity,
      gapScale: conf["appearance"].gapScale,
      barScale: conf["appearance"].barScale,
      position: conf["appearance"].position,
    }),
  );
  currentState = conf["defaultState"];
  toggleHUD(true);
};

const changeState = () => {
  if (
    (conf["hideHUDAllow"] && state === "hidden") ||
    (!conf["hideHUDAllow"] && state === "expanded")
  ) {
    currentState = 0;
  } else {
    currentState++;
  }
  state = states[currentState];
  toggleHUD(true);
};

on("esx_status:onTick", (status: unknown) => {
  hunger = Math.ceil(status[0].percent) / 100;
  thirst = Math.ceil(status[1].percent) / 100;
});

setTick(() => {
  if (conf["useToggleKey"] && IsControlJustPressed(1, conf["toggleKey"])) {
    changeState();
  }
});

setInterval(() => {
  serverCallback(`gm_${script}:getPlayerData_${conf["framework"]}`, {}, cb => {
    if (conf["framework"] === "esx") {
      SendNuiMessage(
        JSON.stringify({
          type: "val",
          food: hunger,
          water: thirst,
          money: cb.money,
          job: conf["appearance"].jobFormat
            .replace("_job_", cb.job)
            .replace("_grade_", cb.jobGrade),
        }),
      );
    } else if (conf["framework"] === "vrp") {
      cb = JSON.parse(cb);
      SendNuiMessage(
        JSON.stringify({
          type: "val",
          food: (100 - Math.ceil(cb["2"])) / 100,
          water: (100 - Math.ceil(cb["3"])) / 100,
          money: cb["1"],
          job: cb["4"] == "" ? "citizen" : cb["4"],
        }),
      );
    }
  });
}, 500);

setInterval(() => {
  if (IsPauseMenuActive()) {
    if (!isPauseMenu) {
      isPauseMenu = true;
      toggleHUD(false);
    }
  } else {
    if (isPauseMenu) {
      isPauseMenu = false;
      toggleHUD(true);
    }
  }
}, 100);

RegisterCommand(
  "hud",
  async (source, args) => {
    const argString = args.join(" ");
    if (argString === "") {
      if (conf["hideHUDAllow"]) {
        emit("chat:addMessage", {
          template: `<div style="padding: 0.5vw; margin: 0.5vw; background-color: rgba(35, 191, 124, 0.6); border-radius: 3px;">
          HUD Commands<br>/hud expanded<br>/hud minimized<br>/hud hidden</div>`,
        });
      } else {
        emit("chat:addMessage", {
          template: `<div style="padding: 0.5vw; margin: 0.5vw; background-color: rgba(35, 191, 124, 0.6); border-radius: 3px;">
          HUD Commands<br>/hud expanded<br>/hud minimized</div>`,
        });
      }
    } else if (argString === "expanded") {
      currentState = 1;
      state = "expanded";
      toggleHUD(true);
    } else if (argString === "minimized") {
      currentState = 0;
      state = "minimized";
      toggleHUD(true);
    } else if (argString === "hidden") {
      if (conf["hideHUDAllow"]) {
        currentState = 2;
        state = "hidden";
        toggleHUD(true);
      } else if (!conf["hideHUDAllow"]) {
        emit("chat:addMessage", {
          template: `<div style="padding: 0.5vw; margin: 0.5vw; background-color: rgba(200, 40, 30, 0.6); border-radius: 3px;">
          HUD Error<br>You are not allowed to use the hidden state</div>`,
        });
      }
    } else if (argString != "") {
      emit("chat:addMessage", {
        template: `<div style="padding: 0.5vw; margin: 0.5vw; background-color: rgba(200, 40, 30, 0.6); border-radius: 3px;">
        HUD Error<br>There is no ${argString} state</div>`,
      });
    }
  },
  false,
);

export { configLoaded };
