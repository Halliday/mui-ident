
@echo off 

rem Link @halliday/rest with it's local version
rmdir /s /q "node_modules\@halliday\rest\lib"
mklink /J "node_modules\@halliday\rest\lib" "..\node-rest\lib"

rem Link @halliday/ident with it's local version
rmdir /s /q "node_modules\@halliday\ident\lib"
mklink /J "node_modules\@halliday\ident\lib" "..\node-ident\lib"