import { script } from "../config";

onNet(`gm_${script}:getPlayerData_esx`, data => {
  let ESX: unknown;
  emit("esx:getSharedObject", obj => (ESX = obj));
  const xPlayer = ESX["GetPlayerFromId"](source);
  const cb = {
      money: xPlayer.getMoney(),
      job: xPlayer.getJob().label,
      jobGrade: xPlayer.getJob().grade_label 
  };
  emitNet(`gm_${script}:callback`, source, cb, data.CallbackID);
});
