# variables
export PATH="\
/usr/local/bin\
:/usr/local/aarch64-apple-darwin24.0.0/bin\
\
:/opt/homebrew/opt/coreutils/libexec/gnubin\
:/opt/homebrew/opt/binutils/bin\
:/opt/homebrew/opt/ed/libexec/gnubin\
:/opt/homebrew/opt/ed/bin\
:/opt/homebrew/opt/findutils/libexec/gnubin\
:/opt/homebrew/opt/gawk/libexec/gnubin\
:/opt/homebrew/opt/gnu-indent/libexec/gnubin\
:/opt/homebrew/opt/gnu-sed/libexec/gnubin\
:/opt/homebrew/opt/gnu-tar/libexec/gnubin\
:/opt/homebrew/opt/gnu-which/libexec/gnubin\
:/opt/homebrew/opt/grep/libexec/gnubin\
:/opt/homebrew/opt/make/libexec/gnubin\
:/opt/homebrew/opt/file-formula/bin\
:/opt/homebrew/opt/unzip/bin\
:/opt/homebrew/opt/llvm/bin\
\
:$HOME/.dotnet\
:$HOME/.dotnet/tools\
\
:$BLOG_DIRECTORY/node_modules/.bin\
:$GOROOT/bin\
:$GOPATH/bin\
:$MYSQL_HOME/bin\
:$MAVEN_HOME/bin\
:$CATALINA_HOME/bin\
:$CALIBRE_HOME\
:$JAVA_HOME/bin\
:$HEXO_ALGOLIA_INDEXING_KEY\
\
:/Applications/waifu2x.app/Contents/MacOS\
:/usr/local/lib/node_modules/\
:$HOME/pdfbooklet\
:/opt/indeux/\
:$HOME/Documents/firework-rs-v0.3.1-x86_64-macos\
:$HOME/Documents/ChmlFrp-0.51.2_240715_darwin_arm64\
\
:/System/Cryptexes/App/usr/bin\
:/usr/bin\
:/bin\
:/usr/sbin\
:/sbin\
"
export LC_ALL=zh_CN.UTF-8
export LANG=zh_CN.UTF-8
export PROMPT="\
(%F{9}exit %?%f)
┌─[%F{219}%n%f@%F{111}%M%f]  %F{215}%B%D%b %*%f    %F{0}╱/( ◕‿‿◕ )\\%f
└─┬─┤ %l %x %F{10}%!%f %F{111}%U%~%u%f
  └─> %u%f%F{111}%B%#%b%f \
"
export LDFLAGS="-L/opt/homebrew/opt/binutils/lib"
export CPPFLAGS="-I/opt/homebrew/opt/binutils/include"
export FORCE_UNSAFE_CONFIGURE=1
export DOTNET_ROOT=$HOME/.dotnet
export HEXO_ALGOLIA_INDEXING_KEY="43e558ddb34e527169506593c80c7b9d"
export EDITOR=nvim
export BLOG_DIRECTORY=~/Documents/blog

# shortcuts
alias blog-cd='cd $BLOG_DIRECTORY'
alias blog-deploy='blog-cd && sudo hexo algolia && sudo hexo cl && sudo hexo g && sudo hexo d'
alias blog-new='blog-cd && sudo hexo n "$1" && sudo chown scetayh: "source/_posts/$1.md" && sudo chmod +rw "source/_posts/$1.md"'
alias c='cat -n'
alias cmi='make distclean; ./configure && make clean && make -j && sudo make install'
alias cmi-j1='make distclean; ./configure && make clean && make -j1 && sudo make install'
alias ds0='sudo pmset -a disablesleep 0'
alias ds1='sudo pmset -a disablesleep 1'
alias l='ls -ahlF --color'
alias n='{ uname -a; neofetch } | lolcat'
function o() { [ -z "$1" ] && open . || open "$1" }
alias ping-tarikko='ping -c 3 blog.tarikkochan.top'
alias p='export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=http://127.0.0.1:7890'
function quietsource() { [ -f "$1" ] && source "$1" }
function v() {
	$EDITOR ~/.zshrc
	source ~/.zshrc
	[ -d ~/Documents/repos/tarikkochan.github.io ] && cp ~/.zshrc ~/Documents/repos/tarikkochan.github.io/1.zshrc && cd ~/Documents/repos/tarikkochan.github.io/ && git add . && git commit -a -m "update 1.zshrc" && git push
}
alias vimake='sudo $EDITOR /etc/portage/make.conf'
alias viml='sudo $EDITOR /etc/pacman.d/mirrorlist'
alias vipacman='sudo $EDITOR /etc/pacman.conf'
alias vipaths='sudo $EDITOR /etc/paths'
alias srmkh='sudo rm -f ~/.ssh/known_hosts'
alias su='login root'
alias sudo='sudo '
alias sudovi='sudo $EDITOR'

# plugins
quietsource /usr/local/share/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
quietsource /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh

# homebrew
[ -f /opt/homebrew/etc/profile.d/autojump.sh ] && . /opt/homebrew/etc/profile.d/autojump.sh
[ -f /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"
# Set PATH, MANPATH, etc., for Homebrew.
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles"
export HOMEBREW_API_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles/api"
