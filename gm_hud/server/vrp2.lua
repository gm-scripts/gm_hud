local gmhud = class("gmhud", vRP.Extension)
gmhud.User = class("User")

function gmhud:__construct()
    vRP.Extension.__construct(self)
end

RegisterServerEvent('gm_hud:getPlayerData_vrp')
AddEventHandler('gm_hud:getPlayerData_vrp', function(data)
    local dataTable = {}
    local user = vRP.users_by_source[source]
    if user ~= nil then
        table.insert(dataTable, user:getWallet())
        table.insert(dataTable, 100 - user:getVital("food") * 100)
        table.insert(dataTable, 100 - user:getVital("water") * 100)
        if user:getGroupByType("job") ~= nil then
            table.insert(dataTable, user:getGroupByType("job"))
        else
            table.insert(dataTable, "Unemployed")
        end
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

vRP:registerExtension(gmhud)
