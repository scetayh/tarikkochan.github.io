# Created by newuser for 5.9

# environment judgements

function isRoot () {
	[ "$(whoami)" = "root" ];
}

function onOSX () {
	[ -d /System/ ];
}

function onArch () {
	[ -d /etc/pacman.d/ ];
}

function onGentoo () {
	[ -d /etc/portage/ ];
}

function usingBash () {
	[[ "$0" =~ "bash" ]];
}

function usingZsh () {
	[[ "$0" =~ "zsh" ]];
}

# PATH

onOSX && \
	unset PATH && {
		export PATH=$PATH:/usr/local/bin;
		export PATH=$PATH:/usr/local/aarch64-apple-darwin24.0.0/bin;

		export PATH=$PATH:/opt/homebrew/opt/coreutils/libexec/gnubin;
		export PATH=$PATH:/opt/homebrew/opt/binutils/bin;
		export PATH=$PATH:/opt/homebrew/opt/ed/libexec/gnubin;
		export PATH=$PATH:/opt/homebrew/opt/ed/bin;
		export PATH=$PATH:/opt/homebrew/opt/findutils/libexec/gnubin;
		export PATH=$PATH:/opt/homebrew/opt/gawk/libexec/gnubin;
		export PATH=$PATH:/opt/homebrew/opt/gnu-indent/libexec/gnubin;
		export PATH=$PATH:/opt/homebrew/opt/gnu-sed/libexec/gnubin;
		export PATH=$PATH:/opt/homebrew/opt/gnu-tar/libexec/gnubin;
		export PATH=$PATH:/opt/homebrew/opt/gnu-which/libexec/gnubin;
		export PATH=$PATH:/opt/homebrew/opt/grep/libexec/gnubin;
		export PATH=$PATH:/opt/homebrew/opt/make/libexec/gnubin;
		export PATH=$PATH:/opt/homebrew/opt/file-formula/bin;
		export PATH=$PATH:/opt/homebrew/opt/unzip/bin;
		export PATH=$PATH:/opt/homebrew/opt/llvm/bin;

		export PATH=$PATH:$HOME/.dotnet;
		export PATH=$PATH:$HOME/.dotnet/tools;

		export PATH=$PATH:$BLOG_DIRECTORY/node_modules/.bin;
		export PATH=$PATH:$GOROOT/bin;
		export PATH=$PATH:$GOPATH/bin;
		export PATH=$PATH:$MYSQL_HOME/bin;
		export PATH=$PATH:$MAVEN_HOME/bin;
		export PATH=$PATH:$CATALINA_HOME/bin;
		export PATH=$PATH:$CALIBRE_HOMEexport PATH=$PATH:$JAVA_HOME/bin;
		export PATH=$PATH:$HEXO_ALGOLIA_INDEXING_KEYexport PATH=$PATH:/Applications/waifu2x.app/Contents/MacOS;
		export PATH=$PATH:/usr/local/lib/node_modules/;
		export PATH=$PATH:$HOME/pdfbooklet;
		export PATH=$PATH:/Users/scetayh/Documents/repos/soras/include;
		export PATH=$PATH:/opt/indeux/;
		export PATH=$PATH:$HOME/Documents/firework-rs-v0.3.1-x86_64-macos;
		export PATH=$PATH:$HOME/Documents/ChmlFrp-0.51.2_240715_darwin_arm64;

		export PATH=$PATH:/System/Cryptexes/App/usr/bin;
		export PATH=$PATH:/usr/bin;
		export PATH=$PATH:/bin;
		export PATH=$PATH:/usr/sbin;
		export PATH=$PATH:/sbin;
	}	

#isRoot && \
#	export PATH=$(/opt/homebrew/bin/gsed ':a;N;s/\n/:/g;ba' /etc/paths):$PATH;

# variables

onOSX && {
	export LC_ALL=zh_CN.UTF-8;
	export LANG=zh_CN.UTF-8;
}

export LDFLAGS="-L/opt/homebrew/opt/binutils/lib";
export CPPFLAGS="-I/opt/homebrew/opt/binutils/include";
export FORCE_UNSAFE_CONFIGURE=1;
export DOTNET_ROOT=$HOME/.dotnet;
export HEXO_ALGOLIA_INDEXING_KEY="43e558ddb34e527169506593c80c7b9d";
export EDITOR=nvim;

# prompt

export PS1='\e[01;34m\]$(e=$?; (( e )) && echo "$e ")\e[01;31m\]\h\[\e[01;34m\] \w $\[\e[00m\] ';
export PROMPT="\
(%F{9}exit %?%f)
┌─[%F{219}%n%f@%F{111}%M%f]  %F{215}%B%D%b %*%f    %F{0}╱/( ◕‿‿◕ )\\%f
└─┬─┤ %l %x %F{10}%!%f %F{111}%U%~%u%f
  └─> %u%f%F{111}%B%#%b%f \
";

# shortcuts as aliases

alias c='cat -n';
alias cmi='make distclean; ./configure && make clean && make -j && sudo make install';
alias cmi-j1='make distclean; ./configure && make clean && make -j1 && sudo make install';
alias l='ls -ahlF --color';
alias ping-tarikko='ping -c 3 blog.tarikkochan.top';
alias srmkh='sudo rm -f ~/.ssh/known_hosts';
alias sudo='sudo ';
alias sudov='sudo $EDITOR';
alias vpaths='sudo $EDITOR /etc/paths';
alias zshrc-update='curl https://tarikkochan.top/zshrc -o ~/.zshrc'

onOSX && {
	alias blog='blog-cd && make';
	alias blog-cd='cd ~/Documents/blog';
	alias blog-commons='blog-commons-cd && make commons';
	alias blog-commons-cd='cd ~/Documents/repos/commons.tarikkochan.github.io';
	alias blog-new='blog-cd && sudo hexo n "$1" && sudo chown scetayh: "source/_posts/$1.md" && sudo chmod +rw "source/_posts/$1.md"';
	alias ds0='sudo pmset -a disablesleep 0';
	alias ds1='sudo pmset -a disablesleep 1';
	alias du='diskutil';
	alias p='export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890';
	alias roll='brew update && brew upgrade';
}

onArch && {
	alias roll='sudo pacman -Syyu';
	alias vml='sudo $EDITOR /etc/pacman.d/mirrorlist';
	alias vpacman='sudo $EDITOR /etc/pacman.conf';
}

onGentoo && {
	alias roll='sudo emerge -auvDN @world';
	alias t+='sudo date -s "20300701"';
	alias t-='sudo ntpdate -b -u 0.gentoo.pool.ntp.org && sudo hwclock --systohc';
	alias vmake='sudo $EDITOR /etc/portage/make.conf';
}

# shortcuts as functions

function alx() {
	p;
	curl https://alx.sh | sh;
}

function alx-ub() {
	p;
	curl -sL https://ubuntuasahi.org/install | sh;
}

function loading() {
	while true; do {
        for i in '|' '/' '-' '\'; do {
                printf \\b$i;
                sleep 0.05;
        }
        done;
	}
    done
}

function n() {
	[ -f "$(which lolcat)" ] && {
		uname -a;
		neofetch;
	} | \
		lolcat && \
			return 0;
	uname -a;
	neofetch;
}

function s() {
		source ~/.bashrc;
		source ~/.zshrc;
}

function t() {
	if [ -z "$1" ]; then {
		tree -alF --dirsfirst;
	}
	else {
		tree -alFL "$1" --dirsfirst;
	}
	fi;
}

function v() {
	$EDITOR ~/.zshrc;
	s;
	onOSX && \
		cp ~/.zshrc ~/Documents/repos/tarikkochan.github.io/ && \
			cd ~/Documents/repos/tarikkochan.github.io/ && \
				git add . && \
					git commit -a -m "update zshrc" && \
						git push;
}

onOSX && {
	function o() {
		[ -z "$1" ] && \
			open . || \
				open "$1";
	}

	function sleepafter () {
		[ ! -d /System ] && \
			echo "macOS supported only" && \
				return 1;

		[ "$(whoami)" != "root" ] && \
			echo "permission denied" && \
				return 1;

		[ "$1" -lt 0 ] && \
			echo "integer expected" && \
				return 1;

		ds1;
		echo -n $1;
		sleep 1;
		for ((i = 2; i <= $1; i++)); do {
			echo -n " $(($1 + 1 - i))";
			sleep 1;
		}
		done;
		echo;
		ds0;
		sudo shutdown -s +0;
	}
}

# plugins

onOSX && \
	usingZsh && {
			source /usr/local/share/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh;
			source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh;
		}

onGentoo && {
	[ -f $(which autoload) ] && \
		autoload -U compinit promptinit;
	[ -f $(which compinit) ] && \
		compinit;
	[ -f $(which promptinit) ] && \
		promptinit;
	[ -f $(which prompt) ] && \
		prompt gentoo;
}

# homebrew

onOSX && {
	[ -f /opt/homebrew/etc/profile.d/autojump.sh ] && . /opt/homebrew/etc/profile.d/autojump.sh;
	[ -f /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)";
	# Set PATH, MANPATH, etc., for Homebrew.
	export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git";
	export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git";
	export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles";
	export HOMEBREW_API_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles/api";
}

:;
