structure load AdminDiamond ~~~ 0_degrees 
fill ~~~ ~~~ air
tellraw @a[tag=staffstatus] {"rawtext":[{"text":"§¶§cUAC STAFF §b► §d"},{"selector":"@s"},{"text":" §¶§bspawned a Diamond Admin Kit"}]}
execute @s[tag=staffstatus] ~~~ function particle/explode
execute @s[tag=staffstatus] ~~~ playsound random.enderchestopen @s ~~~ 2 1 3