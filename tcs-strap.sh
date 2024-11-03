printf "tcs-strap build 1"\\n;
printf "Copyright (C) 2024 Tarikko-ScetayhChan"\\n;

mkdir /tmp/tcs;

function tcs () {
    if [ -f "$*" ]; then {
        mkdir "$(dirname "$*")";
        curl "https://tarikkochan.top/tcs/$*" -o "/tmp/tcs/$*";
    }
    fi;
}