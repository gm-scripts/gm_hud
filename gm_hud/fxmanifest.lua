fx_version 'cerulean'
game 'gta5'

author 'Eichenholz & Obsidianical'
description 'Hud / GM-Scripts'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/img/*',
    'html/css/*',
    'html/js/*'
}

client_scripts {
    'client/main.js'
}

server_scripts {
    --'@vrp/lib/utils.lua', -- uncomment if you are using vrp 
    --'server/vrp.lua', -- uncomment if you are using vrp 1.0 or dunko 
    --'server/loadvrp2.lua', -- uncomment if you are using vrp 2.0
    'server/main.js'
}