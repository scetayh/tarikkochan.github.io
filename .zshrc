# prompt
export PROMPT=$'(%F{9}exit %?%f)\n┌─[%F{219}%n%f@%F{111}%M%f]  %F{215}%B%D%b %*%f    %F{0}╱/( ◕‿‿◕ )\\%f\n└─┬─┤ %l %x %F{10}%!%f %F{111}%U%~%u%f\n  └─> %u%f%F{111}%B%#%b%f '

# localizations
export LANG=zh_CN.UTF-8

# plugins
[ -f /usr/local/share/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh ] && source /usr/local/share/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
[ -f /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh ] && source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh

# compilation
export LDFLAGS="-L/opt/homebrew/opt/binutils/lib"
export CPPFLAGS="-I/opt/homebrew/opt/binutils/include"

# homebrew
[ -f /opt/homebrew/etc/profile.d/autojump.sh ] && . /opt/homebrew/etc/profile.d/autojump.sh
[ -f /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"
# Set PATH, MANPATH, etc., for Homebrew.
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles"
export HOMEBREW_API_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles/api"

# blog (hexo)
[ -d ~/Documents/blog ] && export blogDirectory=~/Documents/blog
export PATH="$PATH:/Users/scetayh/Documents/blog/node_modules/.bin:$GOROOT/bin:$GOPATH/bin:$MYSQL_HOME/bin:$MAVEN_HOME/bin:$CATALINA_HOME/bin:$CALIBRE_HOME:$JAVA_HOME/bin:$HEXO_ALGOLIA_INDEXING_KEY"
export HEXO_ALGOLIA_INDEXING_KEY="43e558ddb34e527169506593c80c7b9d"

function blog-deploy() {
	set -x
	export blogFormerDirectory=$(pwd)	&&
	cd "${blogDirectory}"				&&
	sudo hexo algolia 					&&
	sudo hexo cl						&&
	sudo hexo g 						&&
	sudo hexo d 						&&
	cd ${blogFormerDirectory}			&&
}

function blog-new() {
	export blogFormerDirectory=$(pwd)			&&
	cd ${blogDirectory}							&&
	pwd											&&
	sudo hexo n "$1" 							&&
	sudo chown scetayh: "source/_posts/$1.md"	&&
	sudo chmod +rw "source/_posts/$1.md"		&&
	cd ${blogFormerDirectory}					&&
	pwd
}

function blog-genzshrc() {
	eval cp "${blogDirectory}/source/_posts/dotzshrc.md" "${blogDirectory}/source/_data/" 									&&
	eval cat "${blogDirectory}/source/_data/dotzshrc.md-1.txt" > $(eval echo "${blogDirectory}/source/_posts/dotzshrc.md") 	&&
	eval cat "~/.zshrc" >> $(eval echo "${blogDirectory}/source/_posts/dotzshrc.md") 										&&
	eval cat "${blogDirectory}/source/_data/dotzshrc.md-2.txt" >> $(eval echo "${blogDirectory}/source/_posts/dotzshrc.md")
}

alias blog-server='sudo hexo server'
alias blog-commons='sudo indeux gen && git add . && git commit && git push'

# shortcuts
export editor="vim"

function esora() {
	if [ -d /Volumes/Stajurn/絵空和眠\ Esora\ Kazunemu\ \(Stajurn\)/esora-kazunemu ]; then
		ncmdump *.ncm
		export esoraDirectory=/Users/scetayh/Music/絵空和眠\ Esora\ Kazunemu\ \(YupyeSortaco\)/esora-kazunemu
		cp *.mp3 "${esoraDirectory}"
		cp *.jpg "${esoraDirectory}/media"
		export esoraDirectory=/Volumes/Stajurn/絵空和眠\ Esora\ Kazunemu\ \(Stajurn\)/esora-kazunemu
		cp *.mp3 "${esoraDirectory}"
		cp *.jpg "${esoraDirectory}/media"
		return 0
	else
		echo "$0: error: directory \`/Volumes/Stajurn/絵空和眠\ Esora\ Kazunemu\ \(Stajurn\)/esora-kazunemu' not found. Have you inserted Volume \`Stajurn'?"
		return 1
	fi
}

alias c='cat -en'
alias cmi='make distclean; ./configure && make clean && make -j$(sysctl -n hw.logicalcpu) && sudo make install'
alias cmi-j1='make distclean; ./configure && make clean && make -j1 && sudo make install'
alias ds0='sudo pmset -a disablesleep 0'
alias ds1='sudo pmset -a disablesleep 1'
alias gcc='gcc-14'
alias g++='g++-14'
alias l='ls -ahlF --color'
alias n='uname -a | lolcat && neofetch | lolcat'

function o() {
	[ -z "$1" ] && open .
	[ ! -z "$1" ] && open "$1"
}

alias ping-tarikko='ping -c 3 blog.tarikkochan.top'
alias p='export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890'

function v() {
	${editor} ~/.zshrc
	source ~/.zshrc
	[ -d ~/Documents/repos/tarikkochan.github.io ] && rm -rf ~/Documents/repos/tarikkochan.github.io/.zshrc && cp ~/.zshrc ~/Documents/repos/tarikkochan.github.io/ && cd ~/Documents/repos/tarikkochan.github.io/ && git add . && git commit -a -m "update .zshrc" && git push
	[ ! -z ${blogDirectory} ] && blog-genzshrc && blog-deploy
}

alias vimake='sudo ${editor} /etc/portage/make.conf'
alias viml='sudo ${editor} /etc/pacman.d/mirrorlist'
alias vipacman='sudo ${editor} /etc/pacman.conf'
alias vipaths='sudo ${editor} /etc/paths'
alias sed='/usr/bin/sed'
alias srmkh='sudo rm -f ~/.ssh/known_hosts'
alias sudo='sudo '
alias sudovi='sudo ${editor}'
