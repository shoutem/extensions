<# 
.SYNOPSIS 
    Extensify 
.DESCRIPTION 
    Helps you to push and optionally publish multiple extensions to current environment.
    Also supports installing and installing multiple extensions to single app.
    Relase notes:
        Added -bump major/minor/patch parameter, automatically bumps version before pushing 

    Examples:
    #1 push all available extensions to current environment
    .\extensify.ps1 -extensions all
    #2 push some extensions to current environment
    .\extensify.ps1 -extensions shoutem-navigation, shoutem-layouts, shoutem-folder
    #3 push some extensions to current environment and bump patch 
    .\extensify.ps1 -extensions shoutem-navigation, shoutem-layouts, shoutem-folder -bump patch
    #4 push some extensions and also publish them
    .\extensify.ps1 -extensions shoutem-navigation, shoutem-layouts, shoutem-folder -publish
    #5 push some extensions and install them to given app id
    .\extensify.ps1 -extensions shoutem-navigation, shoutem-layouts, shoutem-folder -appId 1036 -install
    #6 get this... uninstall works too (note: if uninstalling, push and publish are skipped)
    .\extensify.ps1 -extensions shoutem-navigation, shoutem-layouts, shoutem-folder -appId 1036 -uninstall

    

    **TREAD CAREFULLY**
.NOTES 
    Depdends on correctly configured shoutem CLI. Be aware!
#> 

param(
[Parameter(Mandatory=$true)][String[]] $extensions, 
[switch] $publish, 
[String] $appId, 
[String] $bump,
[switch] $install, 
[switch] $uninstall)

if ($extensions.Count -eq 0) {
    Write-Host "You probably wanted to do something with extensions! Think about it one more time." -ForegroundColor Red
}

if ($install -or $uninstall -and [string]::IsNullOrEmpty($appId)) {
    Write-Host "If installing or uninstalling extensions, app id must be set!" -ForegroundColor Red
    exit
}

if ($extensions.Length -eq 1 -and $extensions[0] -eq "all") {
    $extensions = dir -Directory shoutem-*
}

Write-Host "OK! You want to manage "$extensions.Length" extensions. Lets roll..."  -ForegroundColor Green
Write-Host "Now pushing" $extension "to..."
shoutem env show

foreach ($extension in $extensions) {
    if (-not (Test-Path $extension)) {
        Write-Host $extension 'directory does not extist. Nothing to do, I am so sad now... :(' -ForegroundColor Red
        continue
    }

    Write-Host "Current:" ($extensions.IndexOf($extension) + 1) "/" $extensions.Count -ForegroundColor Green
    cd $extension

    if (-not [string]::IsNullOrEmpty($bump)) {
        $content = Get-Content extension.json
        $contentVersion = [regex]::matches($content, '"version": "([0-9]+\.[0-9]+\.[0-9]+)"')
        $versionParts = $contentVersion.groups[1].value.Split('.')
        if ($bump -eq 'major') {
            $versionParts[0] = [convert]::ToInt32($versionParts[0], 10) + 1
        } elseif ($bump -eq 'minor') {
            $versionParts[1] = [convert]::ToInt32($versionParts[1], 10) + 1
        } elseif ($bump -eq 'patch') {
            $versionParts[2] = [convert]::ToInt32($versionParts[2], 10) + 1 
        }
        $newVersion = $versionParts -join '.'
        $content = $content.Replace($contentVersion.groups[0].value, '"version": "' + $newVersion + '"')
        Write-Host "Bumping version from: " $contentVersion.groups[1].value " to " $newVersion -ForegroundColor Yellow
        Set-Content extension.json -Value $content
    }

    if (-not $uninstall){
        shoutem push 
        if ($publish) {
            shoutem publish
        }
    }


    if (-not [string]::IsNullOrEmpty($appId)) {
        if ($install) {
            shoutem install -a $appId
        }
        elseif ($uninstall) {
            shoutem uninstall -a $appId
        }
        else {
            Write-Host "You've sent app id, but didn't specify install or uninstall. Why?" -ForegroundColor Yellow
        }
    }
    cd ..
}

Write-Host "All done. Oh boy that was heavy... ;)" -ForegroundColor Green