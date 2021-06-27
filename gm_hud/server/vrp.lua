local Proxy = module("vrp", "lib/Proxy")

vRP = Proxy.getInterface("vRP")

RegisterServerEvent('gm_hud:getPlayerData_vrp')
AddEventHandler('gm_hud:getPlayerData_vrp', function(data)
    local dataTable = {}
    if vRP.getUserId({source}) == nil then
        local userId = vRP.getUserId(source)
        table.insert(dataTable, vRP.getMoney(userId))
        table.insert(dataTable, vRP.getHunger(userId))
        table.insert(dataTable, vRP.getThirst(userId))
        table.insert(dataTable, vRP.getUserGroupByType(userId,"job"))
    else
        local userId = vRP.getUserId({source})
        table.insert(dataTable, vRP.getMoney({userId}))
        table.insert(dataTable, vRP.getHunger({userId}))
        table.insert(dataTable, vRP.getThirst({userId}))
        table.insert(dataTable, vRP.getUserGroupByType({userId,"job"}))
    end
    
    local result = {}

    for key, value in ipairs(dataTable) do
        -- prepare json key-value pairs and save them in separate table
        table.insert(result, string.format("\"%s\":\"%s\"", key, value))
    end

    -- get simple json string
    result = "{" .. table.concat(result, ",") .. "}"

    TriggerClientEvent('gm_hud:callback', source, result, data.CallbackID)
end)
