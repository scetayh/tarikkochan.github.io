#!/bin/bash

##include {
source /usr/local/lib/slibsh/printjudgement.h.sh
source /usr/local/lib/slibsh/printmessage.h.sh
##}

export DOTNET_ROOT=$HOME/.dotnet
export PATH=$PATH:$DOTNET_ROOT:$DOTNET_ROOT/tools

function CheckCommandLineTool() {
    Slibsh_PrintJudgement_Existence "$2"
    if [ -f "$(which "$2")" ]; then
        Slibsh_PrintJudgement_AnswerYes
    else
        Slibsh_PrintJudgement_AnswerNo
        Slibsh_PrintMessage_Fafal_ItemNotFound "$1" "$2"
        echo "Install the latest $2 for $OS_TYPE."
        exit 1
    fi
}

function DownloadDotnet() {
    if wget https://dot.net/v1/dotnet-install.sh; then
        if ! bash dotnet-install.sh "$1"; then
            echo "Error: Cannot install .NET $1 for $OS_TYPE."
            exit 1
        fi
    else
        echo "Error: Cannot download dotnet-install scripts."
        echo "You should check the network connection or use a proxy."
        exit 1
    fi
}

function CheckDotnetRuntime() {
    echo -n "Checking whether .NET Runtime '$1' 8.0 for $OS_TYPE has been installed... "
    if dotnet --list-runtimes | grep "$1 8.0." &> /dev/null; then
        echo "yes"
    else
        echo "no"
        DownloadDotnet "Runtime 8.0.0" "--runtime dotnet --version 8.0.0"
    fi
}

if true; then

    # To enter ~/.fdnr
    export FORMER_DIRECTORY="$PWD"
    mkdir -p ~/.fdnr
    cd ~/.fdnr || exit 1

    # To check $ARCH
    if [ -n "$ARCH" ]; then
        if [ ! "$ARCH" = "x86" ];then
            if [ ! "$ARCH" = "x64" ]; then
                if [ ! "$ARCH" = "arm64" ]; then
                    echo "Error: $ARCH is not an available architecture."
                    exit 1
                fi
            fi
        fi
    else
        export ARCH=x64
    fi

    # To check OS type
    echo -n "Checking OS type... "
    if [ ! -e /System ]; then
        export OS_TYPE="GNU/Linux"
    else
        export OS_TYPE="Darwin (macOS)"
    fi
    echo "$OS_TYPE"

    # To Set environment variables
    export PATH="/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

    # To Check Git and Wget
    CheckCommandLineTool "$0" git
    CheckCommandLineTool "$0" wget

    # To check .NET SDK 8.0 for $OS_TYPE
    echo -n "Checking whether .NET SDK 8.0 for $OS_TYPE has been installed... "
    if dotnet --list-sdks | grep "8.0." &> /dev/null; then
        echo "yes"
    else
        echo "no"
        DownloadDotnet "SDK 8.0" "--channel 8.0"
    fi

    # To check .NET Runtime 8.0 for $OS_TYPE
    CheckDotnetRuntime Microsoft.AspNetCore.App
    CheckDotnetRuntime Microsoft.NETCore.App

    # To clone repository
    echo -n "Checking whether repository has been cloned... "
    if [ -d FishDeskNextReborn ]; then
        echo "yes"
    else
        echo "no"
        echo "Cloning 'https://github.com/liziyu0714/FishDeskNextReborn.git'..."
        rm -rf FishDeskNextReborn
        if ! git clone https://github.com/liziyu0714/FishDeskNextReborn.git; then
            echo "Error: Cannot clone repository 'https://github.com/liziyu0714/FishDeskNextReborn.git'."
            echo "You should check the network connection or use a proxy."
            exit 1
        fi
    fi

    # To build project
    cd FishDeskNextReborn || exit 1
    if ! dotnet publish --arch "$ARCH" --os win --framework net8.0-windows; then
        echo "Error: Cannot publish the project."
        echo "You should wait for a while and operate 'dotnet publish --arch x64 --os win' again."
        exit 1
    fi
    echo "Successfully published the project."
    echo "Go to '~/.fdnr/FishDeskNextReborn/src/FishDeskNextReborn/bin/Release/net8.0-windows/win-x64/' to check the products."
    echo "Now you can copy the directory above to your Windows platform."
    echo "Thank you for using this script ☆ Kira~"
    cd "$FORMER_DIRECTORY" || exit 1

fi